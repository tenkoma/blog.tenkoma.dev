#!/usr/bin/env node
// add-post.mjs - Create a new blog post
// Usage: node add-post.mjs "My Post Title"
//        or:  ./add-post.mjs "My Post Title"
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

function titleToSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

// --- メイン処理 ---
const title = process.argv[2];

if (!title) {
  console.error("Usage: node add-post.mjs [title]");
  process.exit(1);
}

const now = new Date();
const year = String(now.getFullYear());
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const slug = titleToSlug(title) || `${year}-${month}-${day}`;
const pubDate = `${year}-${month}-${day}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

const dir = join("src", "content", "blog", year, month);
const filePath = join(dir, `${slug}.mdx`);

if (existsSync(filePath)) {
  console.error(`Error: ${filePath} already exists`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const content = `---
title: "${title}"
description: ""
pubDate: "${pubDate}"
published: true
tags: []
---
`;

writeFileSync(filePath, content);
console.log(`Created: ${filePath}`);
