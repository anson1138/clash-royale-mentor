import { init } from '@instantdb/react';

// InstantDB App ID - set in environment or use default
const INSTANT_APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f';

// Initialize InstantDB for client-side usage
export const db = init({
  appId: INSTANT_APP_ID,
});

export { INSTANT_APP_ID };
