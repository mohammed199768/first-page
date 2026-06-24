import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3212';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu'],
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: 'networkidle0' });

const files = [
  'davinci.png',
  'old-plan.png',
  'hand-draw.png',
  'math.png',
  'new-plan.png',
];

const out = await page.evaluate(async (files) => {
  const results = [];
  for (const f of files) {
    const img = new Image();
    img.src = '/assets/home-story/' + f;
    await img.decode().catch(() => {});
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let data;
    try {
      data = ctx.getImageData(0, 0, w, h).data;
    } catch (e) {
      results.push({ f, w, h, err: 'tainted' });
      continue;
    }
    let minX = w, minY = h, maxX = 0, maxY = 0, opaque = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > 16) {
          opaque++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    const transparent = opaque / (w * h) < 0.999;
    results.push({
      f,
      size: `${w}x${h}`,
      hasAlpha: transparent,
      bbox: transparent
        ? {
            x: (minX / w).toFixed(2),
            y: (minY / h).toFixed(2),
            x2: (maxX / w).toFixed(2),
            y2: (maxY / h).toFixed(2),
            cx: ((minX + maxX) / 2 / w).toFixed(2),
            cy: ((minY + maxY) / 2 / h).toFixed(2),
          }
        : 'opaque (no transparency)',
    });
  }
  return results;
}, files);

console.log(JSON.stringify(out, null, 2));
await browser.close();
