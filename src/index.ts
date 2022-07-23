import express from "express";
// file extensions required for ESM
import articles from "./routes/articles.js";

const app = express();

app.use("/articles", articles);

app.listen(5500, () => console.log("listening on port 5500"));
