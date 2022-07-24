# Slingshot Medium Scrapper

> Project for [slingshotahead.com](https://slingshotahead.com)'s technical/specialization test

## Stack used

- Node.js (with ESM)
- Typescript
- Puppeteer
- Cheerio + Node-fetch
- Express.js

## Setup Locally

- Run `git clone` or download the code as a zip from GitHub
- Run `yarn install` to download required dependencies
- Finally, run `yarn dev` and `yarn watch` and access the website on `localhost:5500`

## API Docs

- `/topics`: If a limit is provided, the API will return `limit * 30` items back. By default, limit is set to 1.
- `/topics/:topic`: Returns a feed of popular articles categorized under the topic.
- `/articles/trending`: Scrapes the trending articles on medium's home page.
- `/authors/:author`: Returns information and recent articles from the author.

Test it out by using CURL, Postman, or any language of your choosing!

## Deployment

The website is deployed on Railway. No environment variables need ot be set.

https://medium-api-production.up.railway.app

## Video Demo

Explanation of how everything works and the limitations of building said API.

https://vimeo.com/732842471
