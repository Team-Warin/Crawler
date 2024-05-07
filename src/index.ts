import { getNaverWebToons } from './crawler/naver';
import { browser } from './modules/browser';
import { Supabase } from './modules/supabase';

import division from './modules/division';

process.on('SIGINT', () => {
  browser.close();
  process.exit();
});

(async () => {
  const supabase = Supabase();

  const naverWebToons = await getNaverWebToons(browser, supabase, {
    finished: true,
  });

  const divisionData = division(naverWebToons, 500);

  const promise = divisionData.map(async (webtoons) => {
    const result = await supabase.from('medias').upsert(webtoons);
    console.log(result);
  });

  await Promise.all(promise);

  console.log('Browser Close!');
  await browser.close();
})();
