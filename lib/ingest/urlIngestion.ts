import { YoutubeTranscript } from 'youtube-transcript';
import * as cheerio from 'cheerio';
import { adminDb, isAdminConfigured, Source } from '@/lib/instantdb-admin';
import { generateEmbedding } from './embeddings';
import { chunkText } from './seedIngestion';
import { id as createId } from '@instantdb/admin';

interface UrlContent {
  title: string;
  content: string;
  author?: string;
  metadata: Record<string, any>;
}

/**
 * Extract video ID from various YouTube URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
    /youtube\.com\/embed\/([^&\?\/]+)/,
    /youtube\.com\/v\/([^&\?\/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Fetch and parse YouTube video transcript
 */
async function fetchYouTubeTranscript(url: string): Promise<UrlContent> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }
  
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const content = transcript.map(item => item.text).join(' ');
    
    // Fetch video title from API or page
    const title = `YouTube Video ${videoId}`;
    
    return {
      title,
      content,
      metadata: {
        videoId,
        duration: transcript.length,
        url,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch YouTube transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch and parse article/webpage content
 */
async function fetchArticleContent(url: string): Promise<UrlContent> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style, nav, header, footer').remove();
    
    // Extract title
    const title = $('title').text() || $('h1').first().text() || 'Untitled';
    
    // Extract main content (prioritize article tags, then main, then body)
    let content = '';
    if ($('article').length) {
      content = $('article').text();
    } else if ($('main').length) {
      content = $('main').text();
    } else {
      content = $('body').text();
    }
    
    // Clean up whitespace
    content = content.replace(/\s+/g, ' ').trim();
    
    // Extract author if available
    const author = $('meta[name="author"]').attr('content') || 
                   $('.author').first().text() || 
                   undefined;
    
    return {
      title,
      content,
      author,
      metadata: {
        url,
        fetchedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Determine content type and fetch accordingly
 */
async function fetchUrlContent(url: string): Promise<UrlContent> {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return fetchYouTubeTranscript(url);
  } else {
    return fetchArticleContent(url);
  }
}

/**
 * Ingest a URL source into InstantDB
 */
export async function ingestUrl(url: string, tags: string[] = []): Promise<string> {
  if (!isAdminConfigured()) {
    throw new Error('InstantDB admin token not configured');
  }

  // Check if URL already exists
  const result = await adminDb.query({
    sources: {
      $: {
        where: { url },
      },
    },
  });

  const existingSources = (result?.sources || []) as Source[];
  if (existingSources.length > 0) {
    throw new Error('This URL has already been ingested');
  }
  
  // Create source record
  const sourceId = createId();
  await adminDb.transact(
    adminDb.tx.sources[sourceId].update({
      type: url.includes('youtube') ? 'youtube' : 'article',
      url,
      title: 'Processing...',
      tags: JSON.stringify(tags),
      status: 'processing',
      createdAt: Date.now(),
    })
  );
  
  try {
    // Fetch content
    console.log(`Fetching content from ${url}...`);
    const urlContent = await fetchUrlContent(url);
    
    // Update source with title and author
    await adminDb.transact(
      adminDb.tx.sources[sourceId].update({
        title: urlContent.title,
        author: urlContent.author,
        metadata: JSON.stringify(urlContent.metadata),
      })
    );
    
    // Chunk the content
    const chunks = chunkText(urlContent.content);
    console.log(`Created ${chunks.length} chunks`);
    
    // Generate embeddings and store chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        const embedding = await generateEmbedding(chunk);
        const chunkId = createId();
        
        await adminDb.transact(
          adminDb.tx.sourceChunks[chunkId].update({
            sourceId,
            content: chunk,
            embedding: JSON.stringify(embedding),
            chunkIndex: i,
            metadata: JSON.stringify({
              ...urlContent.metadata,
              chunkIndex: i,
            }),
            createdAt: Date.now(),
          })
        );
      } catch (error) {
        console.error(`Error embedding chunk ${i}:`, error);
      }
    }
    
    // Update source status
    await adminDb.transact(
      adminDb.tx.sources[sourceId].update({
        status: 'completed',
      })
    );
    
    console.log(`✅ Successfully ingested ${url}`);
    return sourceId;
    
  } catch (error) {
    // Update source status to failed
    await adminDb.transact(
      adminDb.tx.sources[sourceId].update({
        status: 'failed',
        metadata: JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }),
      })
    );
    
    throw error;
  }
}
