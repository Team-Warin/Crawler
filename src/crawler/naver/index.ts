import type { Browser } from 'puppeteer';
import type { WebToon } from '../../types/crawl';
import type { Database } from '../../types/supabase-twl';
import type { SupabaseClient } from '@supabase/supabase-js';

import { crawlWeeklyNaverWebToons } from './crawlWeeklyNaverWebToons';
import { crawlDailyNaverWebtoons } from './crawlDailyNaverWebToons';
import { crawlFinishedNaverWebtoons } from './crawlFinishedNaverWebToons';

export const NAVER_WEBTOON_URL = 'https://m.comic.naver.com';

export async function getNaverWebToons(
  browser: Browser,
  supabase: SupabaseClient<Database>,
  crawl: { daily?: boolean; weekly?: boolean; finished?: boolean } = {
    daily: true,
    weekly: true,
    finished: true,
  },
  errorCount: number = 0
) {
  try {
    let dailyWebtoons: WebToon[] = [];
    let weeklyWebtoons: WebToon[] = [];
    let finishedWebtoons: WebToon[] = [];

    if (!errorCount) console.log('crawl start');

    const cookies = [
      {
        name: 'NID_AUT',
        value: process.env.NAVER_NID_AUT ?? '',
        domain: '.naver.com',
      },
      {
        name: 'NID_SES',
        value: process.env.NAVER_NID_SES ?? '',
        domain: '.naver.com',
      },
    ];

    const page = await browser.newPage();
    await page.setCookie(...cookies); // naver login 쿠키 설정

    if (crawl.daily) {
      dailyWebtoons = await crawlDailyNaverWebtoons(browser, supabase);
    }

    if (crawl.weekly) {
      weeklyWebtoons = await crawlWeeklyNaverWebToons(browser, supabase);
    }

    if (crawl.finished) {
      finishedWebtoons = await crawlFinishedNaverWebtoons(browser, supabase);
    }

    console.log('Naver WebToon Crawl Complate');
    return [...weeklyWebtoons, ...dailyWebtoons, ...finishedWebtoons];
  } catch (e) {
    const ERROR_MESSAGE = 'Naver WebToon Crawl Failed';
    console.log(`${ERROR_MESSAGE} : \n`, e);
    if (errorCount < 10) {
      errorCount++;
      console.error(`${errorCount}번째 재시도`);
      return getNaverWebToons(browser, supabase, crawl, errorCount);
    }
    throw new Error(ERROR_MESSAGE);
  }
}
