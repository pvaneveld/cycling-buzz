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
    await page.goto('https://www.wielerflits.nl/');

    // cancel notifications


    // await page.evaluate(() => {
    //     document.querySelector('#onesignal-slidedown-cancel-button').click();
    // });
    const button = await page.waitForSelector('.align-right.secondary.slidedown-button');
    button.click();
    // await gdpr iframe and accept all cookies
    const gdprFrameHandle = await page.waitForSelector('#gdpr-consent-notice');
    const frame = await gdprFrameHandle.contentFrame();
    await frame.click('#save');


    // await frame.click('#save');
    // await browser.close();
})();