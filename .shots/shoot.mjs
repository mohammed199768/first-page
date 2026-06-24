import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3213';
const OUT = 'C:\\Users\\domim\\Desktop\\inkspire-cinematic\\.shots\\';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: 'networkidle0' });

const info = await page.evaluate(() => {
  const t = document.querySelector('.ick-track');
  return { clientWidth: t.clientWidth, scrollWidth: t.scrollWidth };
});
console.log('track', info);
const w = info.clientWidth;

// capture each scene centred (horizontal scrollLeft = i * width)
for (let i = 0; i <= 6; i++) {
  await page.evaluate((left) => {
    document.querySelector('.ick-track').scrollLeft = left;
    document.querySelector('.ick-track').dispatchEvent(new Event('scroll'));
  }, i * w);
  await new Promise((r) => setTimeout(r, 1300)); // let the reveal transition finish
  await page.screenshot({ path: `${OUT}h${i}.png` });
  console.log('shot h' + i, 'scrollLeft', i * w);
}

// a mid-transition frame between scene 1 and 2
await page.evaluate((left) => {
  document.querySelector('.ick-track').scrollLeft = left;
}, 1.5 * w);
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: `${OUT}hmid.png` });

await browser.close();
console.log('done');
