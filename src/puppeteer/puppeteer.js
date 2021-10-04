const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');

(async () => {
    const prisma = new PrismaClient();
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { height: 1100, width: 1600 },
    });
    const page = await browser.newPage();
    await page.goto('https://www.cyclingnews.com/news/?page=1');

    // accept cookies
    const acceptCookies = await page.waitForSelector('.css-k8o10q');
    await acceptCookies.click('.css-k8o10q');

    const cyclists = await prisma.cyclist.findMany();

    const hrefs = await page.evaluate(() => {
        const articles = document.querySelectorAll('.article-link');
        const yesterdaysArticles = Array.from(articles)
            .filter(article => {
                const time = article.querySelector('.published-date.relative-date');
                return !!time?.textContent.includes('1 day ago');
            })
            .map(article => article.getAttribute('href'));
        return yesterdaysArticles;
    });

    for (const href of hrefs) {
        await page.goto(href);
        await page.goBack();
    }


    // open the date filter and select the previous day
    // await page.click('.btn.btn-warning');
    // await page.evaluate(() => {
    //     const dateRangeInput = document.querySelector('#date_range');
    //     dateRangeInput.removeAttribute('readonly');
    // });
    // const yesterday = DateTime.local().minus({ days: 1 }).toFormat('yyyy-MM-dd');
    // await page.type('#date_range', `${yesterday} to ${yesterday}`);
    // await page.keyboard.press('Escape');
    // await page.keyboard.press('Tab');
})();