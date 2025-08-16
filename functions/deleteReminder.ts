import copyAndAppend from "./txtCopyFIle";
import txtWriteFunction from "./txtWriteFile";
import clearFile from "./txtClenFIle";
import readFIle from "./txtReadFIle";

const deleteReminder = async (idUser: number) => {
    const dataList = await readFIle('./wtzpweb/reminderList.txt');
    await clearFile('./wtzpweb/reminderList.txt');
    const list = (dataList)?.toString().split(/\r?\n/);
    if (list && list.length > 0) {
        for (const item of list) {
            if (!item.trim()) continue;
            const [dateStr, description, phone, id] = item.split('$#');

            if (parseInt(id) !== idUser) {
                const newData = [dateStr, description, phone, id];
                const txtAdd = newData.join('$#') + "\n";
                await txtWriteFunction('./wtzpweb/tempList.txt', txtAdd);
            }
        }

        await copyAndAppend('./wtzpweb/tempList.txt', './wtzpweb/reminderList.txt');
        await clearFile('./wtzpweb/tempList.txt');
    }

    return;
};

export default deleteReminder;


