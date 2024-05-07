import type { Browser } from 'puppeteer';
import type { Database } from '../../types/supabase-twl';
import type { SupabaseClient } from '@supabase/supabase-js';

import { crawlNaverWebToons } from './crawlNaverWebToon';

export async function crawlDailyNaverWebtoons(
  browser: Browser,
  supabase: SupabaseClient<Database>
) {
  return await crawlNaverWebToons(
    browser,
    supabase,
    'weekday',
    'week=dailyPlus',
    ['naverDaily']
  );
}
