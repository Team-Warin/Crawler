import puppeteer from 'puppeteer';

export const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  ignoreDefaultArgs: ['--disable-extensions'],
  args: [
    '--disable-setuid-sandbox',
    '--disable-notifications',
    '--disable-extensions',
  ],
});
