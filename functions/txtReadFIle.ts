import { promises as fs } from 'fs';

async function readFIle(filePath: string) {
  try {
    const data = await fs.readFile(filePath,);
    const dataArray = data.toString().split('$$$').filter(line => line.trim() !== '');
    return dataArray;
  } catch (err) {
    console.error('Erro ao ler o arquivo:', err);
  }
}

export default readFIle;
