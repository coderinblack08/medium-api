import express from "express";
// file extensions required for ESM
import articles from "./routes/articles.js";
import authors from "./routes/authors.js";
import topics from "./routes/topics.js";
import puppeteer from "puppeteer";
import fs from "fs";

const app = express();

async function fetchTopics(limit: number) {
  if (fs.existsSync("./topics.json")) return;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://medium.com/search/tags?q=+");

  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
  );

  async function extractTopics() {
    return page.evaluate(() => {
      let data: string[] = [];
      let elements = document.querySelectorAll("a.hy.ea.bb.hl > div");
      elements.forEach(
        (element) => element.textContent && data.push(element.textContent)
      );
      const next_page: any = document.querySelector(
        "button.cp.cq.aw.ax.ay.az.ba.bb.bc.bd.cr.cs.bg.ct.cu"
      );
      if (next_page) next_page.click();
      return data;
    });
  }

  let results: string[] = [];
  for (let index = 0; index < limit; index++) {
    console.log("Scraped tags: " + index);
    await page.waitForTimeout(200);
    results = await extractTopics();
  }

  // await page.screenshot({
  //   path: "./screenshot.png",
  //   fullPage: true,
  // });

  fs.writeFileSync("./topics.json", JSON.stringify(results));
  browser.close();
}

fetchTopics(20).catch(console.error);

app.use("/articles", articles);
app.use("/topics", topics);
app.use("/authors", authors);

app.listen(process.env.PORT || 5500, () =>
  console.log("listening on port 5500")
);
