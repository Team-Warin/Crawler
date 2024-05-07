import type { Database } from '../types/supabase-twl.d.ts';

import { createClient } from '@supabase/supabase-js';

export function Supabase() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ROLE_KEY!,
    {
      db: { schema: 'todaywantlook' },
    }
  );
}
