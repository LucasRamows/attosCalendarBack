import getReminder from "../functions/getReminder";
import clearFile from "../functions/txtClenFIle";
import readFIle from "../functions/txtReadFIle";


const Reminder = async () => {
    const run = async () => {
        const now = new Date()
        const time = now.getHours()

        if (time - 3 > 7 && time - 3 < 21){
        const dataList = await readFIle('./wtzpweb/reminderList.txt');

        if (dataList && dataList.toString().trim() !== "") {
            const list = dataList.toString().split(/\r?\n/);
            await clearFile('./wtzpweb/reminderList.txt');
            await getReminder(list);
        }
}
        setTimeout(run, 1000 * 60 * 60 * 2);
    };

    run();
};

export default Reminder;
