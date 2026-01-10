import { init } from '@instantdb/admin';

// Initialize InstantDB Admin (for server-side operations)
export const adminDb = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f',
  adminToken: process.env.INSTANT_ADMIN_TOKEN || '', // You'll need to add this to .env.local
});

// Schema types for InstantDB
export interface Tutorial {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  order: number;
  createdAt: number;
}

export interface Source {
  id: string;
  type: string;
  title: string;
  author?: string;
  url?: string;
  status: string;
  createdAt: number;
}

export interface SourceChunk {
  id: string;
  sourceId: string;
  content: string;
  chunkIndex: number;
  metadata?: string;
  createdAt: number;
}
