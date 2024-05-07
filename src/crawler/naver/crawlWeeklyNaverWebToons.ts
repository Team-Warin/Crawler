import type { Browser } from 'puppeteer';
import type { Database } from '../../types/supabase-twl';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UpdateDays, WebToon } from '../../types/crawl';

import { crawlNaverWebToons } from './crawlNaverWebToon';

export async function crawlWeeklyNaverWebToons(
  browser: Browser,
  supabase: SupabaseClient<Database>
) {
  const dayList: UpdateDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const webtoonList: WebToon[] = [];

  for (const day of dayList) {
    const webtoons = await crawlNaverWebToons(
      browser,
      supabase,
      'weekday',
      `week=${day.toLowerCase()}`,
      [day]
    );

    const promise = webtoons.map((webtoon) => {
      const listInWebtoon = webtoonList.find(
        ({ mediaId }) => mediaId === webtoon.mediaId
      );

      if (listInWebtoon) {
        const [updateDay] = webtoon.updateDays;

        listInWebtoon.updateDays = [
          ...new Set([...listInWebtoon.updateDays, updateDay]),
        ];
      } else {
        webtoonList.push(webtoon);
      }
    });

    await Promise.allSettled(promise);
  }

  return webtoonList;
}
