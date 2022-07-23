import express from "express";
import articles from "./routes/articles";

const app = express();

app.use("/articles", articles);

app.listen(3000, () => console.log("listening on port 3000"));
