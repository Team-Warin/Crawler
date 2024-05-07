import type { Browser } from 'puppeteer';
import type { Database } from '../../types/supabase-twl';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Singularity, UpdateDays, WebToon } from '../../types/crawl';

import { NAVER_WEBTOON_URL } from '.';
import { getHtml } from './getHtml';
import { SERVICE_CODE } from '..';
import division from '../../modules/division';

import sharp from 'sharp';

/**
 * Naver WebToon Crawl Function
 * @param {'weekday' | 'finish'} type webtoon type
 * @param {string} query
 * @param {WebToon['updateDays']} updateDays webtoon updateDays
 * @param {Singularity} Singularity webtoon Singularity
 */
export async function crawlNaverWebToons(
  browser: Browser,
  supabase: SupabaseClient<Database>,
  type: 'weekday' | 'finish',
  query: string,
  updateDays: WebToon['updateDays'],
  Singularity: Singularity = []
) {
  let WebToon: WebToon[] = [];

  //page html data
  const $ = await getHtml(`${NAVER_WEBTOON_URL}/webtoon/${type}.nhn?${query}`);

  const rootElement = $('#ct > div.section_list_toon > ul > li > a');

  const divisionElem = division(rootElement.toArray(), 10);

  for (let Element of divisionElem) {
    const promise = Element.map(async (elem) => {
      //badge
      const badgeAreaText = $(elem).find('span.area_badge').text();
      const isAdultWebtoon = badgeAreaText.includes('청유물');

      const isNewWebtoon = badgeAreaText.includes('신작');

      const singularityList = [...Singularity];
      const isWaitFreeWebtoon = badgeAreaText.includes('유료작품');
      if (isWaitFreeWebtoon) singularityList.push('waitFree');

      // update
      const titleBoxText = $(elem).find('div.title_box').text();
      const isPausedWebtoon = titleBoxText.includes('휴재');
      const isUpdatedWebtoon = titleBoxText.includes('업데이트');

      // webtoon url
      const path = $(elem).attr('href');

      // webtoon title
      const title = $(elem).find('.title').text();
      console.log('title:', title);

      // webtoon author
      const author = $(elem)
        .find('.author')
        .text()
        .replaceAll(' / ', ',')
        .replaceAll(/\n|\t| /g, '');

      const titleId = path ? path.split('?titleId=')[1].split('&')[0] : '0';

      // browser page
      const page = await browser.newPage();

      await page.setRequestInterception(true);

      page.on('request', (req) => {
        if (['font', 'stylesheet', 'image'].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(NAVER_WEBTOON_URL.replace('m.comic', 'comic') + path, {
        waitUntil: 'networkidle2',
      });

      // summary
      const summary = await page.$eval(
        '#content > div.EpisodeListInfo__comic_info--yRAu0 > div > div.EpisodeListInfo__summary_wrap--ZWNW5 > p',
        (data) => data.textContent
      );

      // genre
      let genre = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            '#content > div.EpisodeListInfo__comic_info--yRAu0 > div > div.EpisodeListInfo__summary_wrap--ZWNW5 > div > div > a'
          ),
          (element) => {
            if (element.textContent)
              return element.textContent.replace('#', '');
          }
        )
      );

      // imageUrl
      const imgUrl = $(elem).find('div.thumbnail > img').attr('src') ?? '';

      if (!imgUrl.match(/\.(jpe?g|png)/g)?.join('')) return;

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response
            .url()
            .includes(imgUrl.match(/\.(jpe?g|png)/g)?.join('') ?? '.jpg')
        ),
        page.goto(imgUrl, {
          waitUntil: 'networkidle2',
        }),
      ]);

      console.log(title, 'image getting');

      const buffer = await response.buffer();

      const backdropImg =
        'data:image/avif;base64,' +
        (await sharp(buffer).avif().toBuffer()).toString('base64');

      const { data } = await supabase
        .from('medias')
        .select('*')
        .match({ mediaId: SERVICE_CODE.NAVER + titleId })
        .single();

      const setUpdateDays = (updateDays: UpdateDays): UpdateDays => {
        if (updateDays.includes('finished')) {
          return ['finished'];
        }

        return [...updateDays];
      };

      const webtoon: WebToon = {
        type: 'webtoon',
        mediaId: SERVICE_CODE.NAVER + titleId,
        title: title,
        author: author,
        summary: summary ?? '',
        genre: genre as string[],
        url: NAVER_WEBTOON_URL.replace('m.comic', 'comic') + path,
        backdropImg: backdropImg,
        service: 'naver',
        updateDays: setUpdateDays(updateDays),
        additional: {
          new: isNewWebtoon,
          adult: isAdultWebtoon,
          rest: isPausedWebtoon,
          up: isUpdatedWebtoon,
          singularityList,
        },
      };

      page.close();
      WebToon.push(webtoon);
      return webtoon;
    });

    await Promise.allSettled(promise);
  }

  return WebToon;
}
