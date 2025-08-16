import e from "express";
import fs from "fs/promises";

async function clearFile(path: string) {
  await fs.writeFile(path, "");
  console.log(`Arquivo ${path} zerado!`);
}

export default clearFile;   