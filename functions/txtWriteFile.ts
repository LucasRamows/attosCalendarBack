import fs from 'fs';


const txtWriteFunction = async (filePath: string, content: string) => {
    try {
       await fs.appendFileSync(filePath, content);
    } catch (error) {
        await fs.writeFileSync(filePath, content);
    }
};

export default txtWriteFunction;