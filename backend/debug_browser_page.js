const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser to check localhost:5000 and localhost:3000...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const urls = [
    'http://localhost:5000/',
    'http://localhost:5000/login',
    'http://localhost:5000/music',
    'http://localhost:3000/',
    'http://localhost:3000/login',
    'http://localhost:3000/music'
  ];

  for (const url of urls) {
    console.log(`\n========================================`);
    console.log(`TESTING URL: ${url}`);
    console.log(`========================================`);
    const page = await browser.newPage();
    
    page.on('console', msg => console.log(`[BROWSER CONSOLE ${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.log(`[BROWSER UNCAUGHT ERROR]:`, err.message));
    page.on('requestfailed', req => console.log(`[FAILED REQUEST]: ${req.url()} - ${req.failure()?.errorText}`));

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
      console.log(`HTTP Status: ${response.status()}`);
      
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      console.log(`Body length: ${bodyHTML.length} chars`);
      console.log(`Body HTML snippet: ${bodyHTML.substring(0, 300)}...`);
      
      const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'NO ROOT ELEMENT');
      console.log(`Root HTML snippet: ${rootHTML.substring(0, 300)}...`);
    } catch (err) {
      console.error(`Error loading ${url}:`, err.message);
    }
    await page.close();
  }

  await browser.close();
})();
