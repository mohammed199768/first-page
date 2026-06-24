import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--disable-gpu'],
});
const p = await b.newPage();
await p.goto('http://localhost:3210', { waitUntil: 'networkidle0' });
const r = await p.evaluate(() => ({
  supportsTimeline: CSS.supports('animation-timeline: scroll()'),
  prefersReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  trackFlexDir: getComputedStyle(document.querySelector('.ick-pan-track')).flexDirection,
  outerHeight: getComputedStyle(document.querySelector('.ick-pan-outer')).height,
  ua: navigator.userAgent,
}));
console.log(JSON.stringify(r, null, 2));
await b.close();
