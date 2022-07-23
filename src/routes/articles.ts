import cheerio from "cheerio";
import { Router } from "express";
import fetch from "node-fetch";
import type { ChildNode } from "domhandler";

const articles = Router();

articles.get("/trending", async (req, res) => {
  const page = await fetch("https://medium.com");
  const $ = cheerio.load(await page.text());
  const response = [];
  for (const post of $(".pw-trending-post > div:nth-child(2)")) {
    const [author, title, metadata] = post.children;

    function getAuthor(div: ChildNode) {
      const $$ = cheerio.load($.html(div));

      console.log($$("div > a").attr("href")?.trim(), "\n");

      // test two different regex and get the one that matches
      const regex1 = /^\/@(.+)\?.*$/;
      const regex2 = /^https:\/\/medium.com\/(.+)\?.*$/;
      let username: string | undefined;
      let publication: string | undefined;
      const author = $$("div > a").attr("href")?.trim();
      if (author) {
        if (regex1.test(author)) {
          username = author.match(regex1)?.at(1);
        } else if (regex2.test(author)) {
          publication = author.match(regex2)?.at(1);
          username = $$("div > div:nth-child(2) > a")
            .attr("href")
            ?.trim()
            .match(regex1)
            ?.at(1);
        }
      }

      return { username, publication };
    }

    response.push({
      author: getAuthor(author),
    });
  }
  res.json(response);
});

articles.get("/author/:author", async (req, res) => {});

articles.get("/topic/:topic", async (req, res) => {});

export default articles;
