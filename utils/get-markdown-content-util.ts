"use server";

import fs from "fs";
import path from "path";

export const getMarkdownString = async () => {
  const filePath = path.join(process.cwd(), "user-guide.md");
  const fileContent = fs.readFileSync(filePath, "utf8");

  return fileContent;
};
