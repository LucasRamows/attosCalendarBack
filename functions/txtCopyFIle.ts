import fs from "fs/promises";

async function copyAndAppend(src: string, dest: string) {
  try {
    const data = await fs.readFile(src, "utf-8");

    await fs.appendFile(dest, data);

    console.log(`Conteúdo de ${src} adicionado em ${dest}`);
  } catch (err) {
    console.error("Erro:", err);
  }
}

export default copyAndAppend;
