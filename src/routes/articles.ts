import { Router } from "express";

const articles = Router();

articles.get("/trending", async (req, res) => {});

articles.get("/author/:author", async (req, res) => {});

articles.get("/topic/:topic", async (req, res) => {});

export default articles;
