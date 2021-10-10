import puppeteer from 'puppeteer';
import { Cyclist, PrismaClient, Medium } from '@prisma/client';
import { DateTime } from 'luxon';

(async () => {
    // FUNCTIONS
    const getCyclistsWithinArticle = async (cyclists: Cyclist[]) => {
        return await page.evaluate((cyclists) => {
            const headline = document.querySelector('header h1')?.textContent ?? '';
            const subtitle = document.querySelector('header .strapline')?.textContent ?? '';
            const body = document.querySelector('#article-body')?.textContent ?? '';

            const allText = headline + subtitle + body;
            return cyclists
                .filter((cyclist: Cyclist) => {
                    const lastName = new RegExp(cyclist.lastName, 'gi');
                    const fullName = new RegExp(`${cyclist.firstName} ${cyclist.lastName}`, 'gi');

                    return lastName.test(allText) || fullName.test(allText);

                })
                .map(cyclist => ({ headline, ...cyclist }))
        }, cyclists as any);
    }

    const getYesterdaysArticlesUrls = async () => {
        return await page.evaluate(() => {
            const articles = document.querySelectorAll('.article-link');
            const yesterdaysArticles = Array.from(articles)
                .filter(article => {
                    const time = article.querySelector('.published-date.relative-date');
                    return !!time?.textContent?.includes('1 day ago');
                })
                .map(article => article.getAttribute('href'));
            return yesterdaysArticles;
        });
    }

    const createArticles = async (results: (Cyclist & { headline: string })[], href: string) => {
        console.log(results);
        await prisma.article.createMany({
            data: results.map(cyclist => ({
                cyclistId: cyclist.id,
                headline: cyclist.headline,
                medium: Medium.CYCLING_NEWS,
                published: DateTime.local().minus({ days: 1 }).toJSDate(),
                url: href,
            })),
            skipDuplicates: true,
        });
    }

    // CONSTANTS
    const prisma = new PrismaClient();
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { height: 1100, width: 1600 },
    });
    const page = await browser.newPage();

    await page.goto('https://www.cyclingnews.com/news/?page=1');

    // accept cookies
    // const acceptCookies = await page.waitForSelector('.css-k8o10q');
    // await acceptCookies.click('.css-k8o10q');

    const hrefs = await getYesterdaysArticlesUrls();
    const cyclists = await prisma.cyclist.findMany();

    for (const href of hrefs) {
        await page.goto(href);
        await createArticles(
            await getCyclistsWithinArticle(cyclists) as (Cyclist & { headline: string })[],
            href
        );
        await page.goBack();
    }
})();