import { Router } from "express";
import fetch from "node-fetch";
import fs from "fs";
import { dirname, join, resolve } from "path";

const topics = Router();
const fake_dirname = resolve(dirname(""));

// converts RSS feed into JSON
topics.get("/:topic", async (req, res) => {
  const feed = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/${req.params.topic}`
  );
  const data: any = await feed.json();
  res.json(data.items);
});

topics.get("/", async (req, res) => {
  // limit is in terms of how many multiples of 30's should be fetched
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 1;

  // if (!limit || limit === 1) {
  //   const page = await fetch("https://medium.com/search/tags?q=+");
  //   const $ = cheerio.load(await page.text());
  //   const topics = [];
  //   for (const topic of $("a.hy.ea.bb.hl > div")) {
  //     topics.push($(topic).text());
  //   }
  //   return res.json(topics);
  // }

  if (limit < 1 || limit > 20) {
    return res.status(422).json({ error: "limit must be within 1 to 20" });
  }

  if (!fs.existsSync(join(fake_dirname, "./topics.json"))) {
    return res.status(422).json({ error: "topics.json not found" });
  }

  const allTopics = JSON.parse(
    fs.readFileSync(join(fake_dirname, "./topics.json"), {
      encoding: "utf8",
    })
  );
  return res.json(allTopics.slice(0, limit * 30));
});

export default topics;
