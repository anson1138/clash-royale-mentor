import type { InstantRules } from '@instantdb/react';

// InstantDB Schema and Permissions
// This defines what data can be read/written and by whom

const rules = {
  // Knowledge Base Sources
  sources: {
    allow: {
      // Anyone can read sources
      view: 'true',
      // Only allow creating/updating through admin
      create: 'false',
      update: 'false',
      delete: 'false',
    },
  },
  
  // Source Chunks (for RAG)
  sourceChunks: {
    allow: {
      view: 'true',
      create: 'false',
      update: 'false',
      delete: 'false',
    },
  },
  
  // Tutorials
  tutorials: {
    allow: {
      view: 'true',
      create: 'false',
      update: 'false',
      delete: 'false',
    },
  },
  
  // User Decks (personal data)
  decks: {
    allow: {
      view: 'true',
      create: 'true',
      update: 'auth.id == data.userId',
      delete: 'auth.id == data.userId',
    },
  },
  
  // Battle Snapshots
  battleSnapshots: {
    allow: {
      view: 'true',
      create: 'true',
      update: 'auth.id == data.userId',
      delete: 'auth.id == data.userId',
    },
  },
} satisfies InstantRules;

export default rules;
