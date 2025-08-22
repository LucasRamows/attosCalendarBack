import { clear } from "console";
import { sendMessage } from "../wtzpweb/app";
import copyAndAppend from "./txtCopyFIle";
import txtWriteFunction from "./txtWriteFile";
import clearFile from "./txtClenFIle";

const getReminder = async (list: any) => {
    if (list && list.length > 0) {
        for (const item of list) {
            if (!item.trim()) continue;

            const [dateStr, name, phone, id] = item.split('$#');
            console.log(dateStr, name, phone, id);
            const dates = dateStr.split(", ");
            const [day, month, year] = dates[0].split("/").map(Number);
            const data = new Date(year, month - 1, day);
            const today = new Date();

            if (
                data.getDate() === today.getDate() &&
                data.getMonth() === today.getMonth() &&
                data.getFullYear() === today.getFullYear()
            ) {
                console.log(`Enviando lembrete para ${phone}: ${name}`);
                const message = `${id} - Lembrete: ${name} `;
                await sendMessage(phone, message);

                if (dates.length > 1) {
                    dates.shift();
                    const newData = [dates.join(", "), name, phone, id];
                    const txtAdd = newData.join('$#') + "\n";
                    await txtWriteFunction('./wtzpweb/tempList.txt', txtAdd);
                }
            } else if (data.getDate() <= today.getDate() &&
                data.getMonth() <= today.getMonth() &&
                data.getFullYear() <= today.getFullYear()) {
                if (dates.length > 1) {
                    dates.shift();
                    const newData = [dates.join(", "), name, phone, id];
                    const txtAdd = newData.join('$#') + "\n";
                    await txtWriteFunction('./wtzpweb/tempList.txt', txtAdd);
                }
            } else {
                const newData = [dateStr, name, phone, id];
                const txtAdd = newData.join('$#') + "\n";
                await txtWriteFunction('./wtzpweb/tempList.txt', txtAdd);
            }
        }

        await copyAndAppend('./wtzpweb/tempList.txt', './wtzpweb/reminderList.txt');
        await clearFile('./wtzpweb/tempList.txt');
    }

    return;
};

export default getReminder;