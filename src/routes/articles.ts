import cheerio from "cheerio";
import { Router } from "express";
import fetch from "node-fetch";
import type { ChildNode } from "domhandler";

const articles = Router();

articles.get("/trending", async (_, res) => {
  const page = await fetch("https://medium.com");
  const $ = cheerio.load(await page.text());
  const response = [];
  for (const post of $(".pw-trending-post > div:nth-child(2)")) {
    const [author, title, metadata] = post.children;

    function getAuthor(div: ChildNode) {
      const $$ = cheerio.load($.html(div));

      // test two different regex and get the one that matches
      const regex1 = /^\/@(.+)\?.*$/;
      const regex2 = /^https:\/\/medium.com\/(.+)\?.*$/;
      let username: string | undefined;
      let displayName: string | undefined;
      let publication: string | undefined;
      const author = $$("div > a").attr("href")?.trim();
      if (author) {
        if (regex1.test(author)) {
          username = author.match(regex1)?.at(1);
          displayName = $$("div > a").text();
        } else if (regex2.test(author)) {
          publication = author.match(regex2)?.at(1);
          const el = $$("div > div:nth-child(2) > a");
          displayName = el.children().first().text();
          username = el.attr("href")?.trim().match(regex1)?.at(1);
        }
      }

      return { username, displayName, publication };
    }

    // function getMetadata(div: ChildNode) {
    //   const $$ = cheerio.load($.html(div));
    //   const publishedDate = $$("div > span:nth-child(1)").text();
    //   const readingTime = $$("div > .pw-reading-time").text();
    //   return { publishedDate, readingTime };
    // }

    const titleContent = cheerio.load($.html(title))("a > div > h2").text();

    const url = cheerio
      .load($.html(title))("a")
      .attr("href")
      ?.trim()
      .split("?")[0];

    response.push({
      url,
      title: titleContent,
      author: getAuthor(author),
      // medium broken when using a fetch request
      // metadata: getMetadata(metadata),
    });
  }
  res.json(response);
});

articles.get("/author/:author", async (req, res) => {});

articles.get("/topic/:topic", async (req, res) => {});

export default articles;
