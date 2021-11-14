## Cycling buzz back end

### :link: Where

- The website this api is connected to can be found here [here](https://cycling-buzz-app.herokuapp.com/)

### :mag: What?

Cycling buzz back consist of a puppeteer script for scraping articles about my most favorite cyclists.
This scripts runs every night as a Heroku Scheduled jobs. Results are saved to a Postgres database on Heroku.
The database is exposed by a GraphQL API. This API is used to create a timeline of news articles.

### :question: Why

This is a learning project to fiddle around with some technologies i hadn't used before:
- Apollo and GraphQL
- Puppeteer

### :wrench: How

The main parts of the stack are as follows:

- `ts-node`: because... typescript :)
- `puppeteer`: popular web scraper
- `docker`: used to containerize a local dev environment
- `apollo-server / GraphQL`: tools to build a GraphQL API.
