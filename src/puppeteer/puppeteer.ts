import puppeteer from 'puppeteer';
import { Cyclist, PrismaClient, Medium } from '@prisma/client';
import { DateTime } from 'luxon';
import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: 'https://357348179eba40f0b38601dceab72210@o1041077.ingest.sentry.io/6010032',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
});

const getArticles = async () => {
    try {
        // FUNCTIONS

        /**
         * @@description look for cyclist and article content. Return cyclist and headline if found.
         */
        const getCyclistsWithinArticle = async (cyclists: Cyclist[]) => {
            return await page.evaluate((cyclists) => {
                const headline = document.querySelector('header h1')?.textContent ?? '';
                const subtitle =
                    document.querySelector('header .strapline')?.textContent ?? '';
                const body = document.querySelector('#article-body')?.textContent ?? '';

                const allText = headline + subtitle + body;
                return cyclists
                    .filter((cyclist: Cyclist) => {
                        const lastName = new RegExp(cyclist.lastName, 'gi');
                        const fullName = new RegExp(
                            `${cyclist.firstName} ${cyclist.lastName}`,
                            'gi'
                        );

                        return lastName.test(allText) || fullName.test(allText);
                    })
                    .map((cyclist: Cyclist) => ({ headline, ...cyclist }));
            }, cyclists as any);
        };

        /**
         * @description get yesterdays articles
         */
        const getYesterdaysArticlesUrls = async () => {
            return await page.evaluate(() => {
                const articles = document.querySelectorAll('.article-link');
                const yesterdaysArticles = Array.from(articles)
                    .filter((article) => {
                        const time = article.querySelector('time');
                        return !!time?.textContent?.includes('1 day ago');
                    })
                    .map((article) => article.getAttribute('href'));
                return yesterdaysArticles;
            });
        };

        /**
         * @description create articles record for each cyclist found within an article. 
         */
        const createArticles = async (
            results: (Cyclist & { headline: string })[],
            href: string
        ) => {
            await prisma.article.createMany({
                data: results.map((cyclist) => ({
                    cyclistId: cyclist.id,
                    headline: cyclist.headline,
                    medium: Medium.CYCLING_NEWS,
                    published: DateTime.utc().minus({ days: 1 }).toJSDate(),
                    url: href,
                })),
            });
        };

        // CONSTANTS
        const prisma = new PrismaClient();
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { height: 1100, width: 1600 },
        });

        // FLOW
        const page = await browser.newPage();

        // browse to the news
        await page.goto('https://www.cyclingnews.com/news/?page=1');

        const yesterdaysArticlesUrls = await getYesterdaysArticlesUrls();

        if (!yesterdaysArticlesUrls?.length) {
            Sentry.captureMessage(
                `Found no articles for ${DateTime.utc().minus({ days: 1 }).toISO()}.`,
                Sentry.Severity.Debug
            );
        }

        // get all cyclists once
        const cyclists = await prisma.cyclist.findMany();

        // Keep track of the articles created
        let articleCount = 0;

        for (const url of yesterdaysArticlesUrls) {
            // Visit href
            await page.goto(url);

            // Look up all cyclists who appear in the article
            const cyclistsWithinArticle = (await getCyclistsWithinArticle(
                cyclists
            )) as (Cyclist & { headline: string })[];

            // Create article entries for them
            if (cyclistsWithinArticle?.length) {
                await createArticles(cyclistsWithinArticle, url);
                articleCount += cyclistsWithinArticle?.length;
            }

            // Go back to the main page
            await page.goBack();
        }

        Sentry.captureMessage(
            `Created ${articleCount} articles for ${DateTime.utc()
                .minus({ days: 1 })
                .toISO()}`,
            Sentry.Severity.Info
        );

        process.exit(0);
    } catch (error) {
        Sentry.captureException(error);
    }
};

getArticles();
