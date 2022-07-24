import { Router } from "express";
import fetch from "node-fetch";

const authors = Router();

authors.get("/:author", async (req, res) => {
  // convert RSS feed into JSON and return
  const feed = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${req.params.author}`
  );
  const data: any = await feed.json();
  res.json({
    info: data.description,
    articles: data.items,
  });
});

export default authors;
