"use server";

import fs from "fs";
import path from "path";

export const getMarkdownString = async () => {
  const filePath = path.join(process.cwd(), "terms-of-use.md");
  const fileContent = fs.readFileSync(filePath, "utf8");

  return fileContent;
};
