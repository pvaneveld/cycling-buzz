const { DateTime } = require('luxon');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { height: 1100, width: 1600 },
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ],

    });
    const page = await browser.newPage();
    await page.goto('https://www.wielerflits.nl/nieuwsoverzicht/');

    // await gdpr iframe and accept all cookies
    const gdprFrameHandle = await page.waitForSelector('#gdpr-consent-notice');
    const frame = await gdprFrameHandle.contentFrame();
    await frame.click('#save');


    // open the date filter and select the previous day
    await page.click('.btn.btn-warning');
    await page.evaluate(() => {
        const dateRangeInput = document.querySelector('#date_range');
        dateRangeInput.removeAttribute('readonly');
    });
    const yesterday = DateTime.local().minus({ days: 1 }).toFormat('yyyy-MM-dd');
    await page.type('#date_range', `${yesterday} to ${yesterday}`);
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
})();