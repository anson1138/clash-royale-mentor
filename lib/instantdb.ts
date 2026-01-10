import { init } from '@instantdb/react';

// Initialize InstantDB
export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f',
});
