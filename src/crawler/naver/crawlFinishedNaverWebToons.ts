import type { Browser } from 'puppeteer';
import type { Database } from '../../types/supabase-twl';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { WebToon } from '../../types/crawl';

import { getHtml } from './getHtml';
import { NAVER_WEBTOON_URL } from '.';

import { crawlNaverWebToons } from './crawlNaverWebToon';

export async function crawlFinishedNaverWebtoons(
  browser: Browser,
  supabase: SupabaseClient<Database>
) {
  const $ = await getHtml(NAVER_WEBTOON_URL + '/webtoon/finish.nhn?page=1');
  const pageCount = Number(
    $('#ct > div.section_list_toon > div.paging_type2 > em > span').text()
  );

  const pageList = [...new Array(pageCount).keys()];

  const finishedWebtoons: WebToon[] = [];

  for (const page of pageList) {
    console.log(`${page + 1} / ${pageCount}`);
    const webtoons = await crawlNaverWebToons(
      browser,
      supabase,
      'finish',
      `page=${page + 1}`,
      ['finished']
    );

    finishedWebtoons.push(...webtoons);
  }

  return finishedWebtoons;
}
