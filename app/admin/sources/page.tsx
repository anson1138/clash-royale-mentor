'use client';

import { useState, useEffect } from 'react';

interface Source {
  id: string;
  type: string;
  title: string;
  url?: string;
  author?: string;
  status: string;
  chunkCount: number;
  createdAt: string;
}

export default function AdminSources() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loadingSources, setLoadingSources] = useState(true);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/sources');
      const data = await response.json();
      if (data.success) {
        setSources(data.sources);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoadingSources(false);
    }
  };

  const handleIngestSeed = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/ingest/seed', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Success! Ingested ${data.data.tutorialsCount} tutorials with ${data.data.chunksCount} chunks.`);
        fetchSources();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/ingest/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Successfully ingested ${url}`);
        setUrl('');
        setTags('');
        fetchSources();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Admin: Manage Sources
        </h1>
        
        <div className="space-y-6">
          {/* Seed Ingestion */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Seed Content Ingestion
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Import the local <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">deck-doctor-tutorials.md</code> file
              into the knowledge base. This will create source chunks with embeddings for RAG retrieval.
            </p>
            <button
              onClick={handleIngestSeed}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Ingesting...' : 'Ingest Seed Tutorials'}
            </button>
          </div>

          {/* URL Ingestion */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Add Expert Source URL
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Add YouTube videos, articles, or guides to expand the AI knowledge base.
            </p>
            <form onSubmit={handleIngestUrl} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://article.com/..."
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="deck-building, strategy, pro-tips"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Ingesting...' : 'Ingest URL'}
              </button>
            </form>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.startsWith('✅') 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Sources List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ingested Sources
            </h2>
            {loadingSources ? (
              <p className="text-gray-600 dark:text-gray-300">Loading sources...</p>
            ) : sources.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No sources ingested yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Author</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Chunks</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((source) => (
                      <tr key={source.id} className="border-t dark:border-gray-700">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {source.type}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {source.url ? (
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                              {source.title}
                            </a>
                          ) : (
                            source.title
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{source.author || '-'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            source.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            source.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {source.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{source.chunkCount}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm">
                          {new Date(source.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
