import { init } from '@instantdb/admin';

// InstantDB configuration
const INSTANT_APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f';
const INSTANT_ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN || '';

// Initialize InstantDB Admin (for server-side operations)
export const adminDb = init({
  appId: INSTANT_APP_ID,
  adminToken: INSTANT_ADMIN_TOKEN,
});

// Check if admin is configured
export function isAdminConfigured(): boolean {
  return !!INSTANT_ADMIN_TOKEN;
}

// Schema types for InstantDB
export interface Tutorial {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  order: number;
  sourceId?: string;
  createdAt: number;
}

export interface Source {
  id: string;
  type: string;
  title: string;
  author?: string;
  url?: string;
  tags?: string;
  metadata?: string;
  status: string;
  createdAt: number;
}

export interface SourceChunk {
  id: string;
  sourceId: string;
  content: string;
  embedding?: string;
  chunkIndex: number;
  metadata?: string;
  createdAt: number;
}
