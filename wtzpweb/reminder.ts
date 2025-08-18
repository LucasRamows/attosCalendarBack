import getReminder from "../functions/getReminder";
import clearFile from "../functions/txtClenFIle";
import readFIle from "../functions/txtReadFIle";


const Reminder = async () => {
    const run = async () => {
        const dataList = await readFIle('./wtzpweb/reminderList.txt');

        if (dataList && dataList.toString().trim() !== "") {
            const list = dataList.toString().split(/\r?\n/);
            await clearFile('./wtzpweb/reminderList.txt');
            await getReminder(list);
        }

        setTimeout(run, 1000 * 60);
    };

    run();
};

export default Reminder;
