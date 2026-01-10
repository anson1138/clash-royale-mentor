import { NextResponse } from 'next/server';
import { generateCitedAnswer } from '@/lib/rag/retrieval';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, systemPrompt } = body;
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }
    
    const result = await generateCitedAnswer(query, systemPrompt);
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
