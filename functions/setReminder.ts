import txtWriteFunction from "./txtWriteFile"

const setRemainder = async (data: string, remaining: string, name: string, phone: string, id: number) => {
   function gerarReminders(endDate: string, taxaAviso: number, quantidade: number): string[] {
    const [diaStr, mesStr, anoStr] = endDate.split('/');
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10) - 1;
    const ano = parseInt(anoStr, 10);

    const dataFinal = new Date(ano, mes, dia);
    const reminders: string[] = [];

    for (let i = 1; i <= quantidade; i++) {
        const reminder = new Date(dataFinal);
        reminder.setDate(dataFinal.getDate() - taxaAviso * i);

        const diaFormat = reminder.getDate().toString().padStart(2, '0');
        const mesFormat = (reminder.getMonth() + 1).toString().padStart(2, '0');
        const anoFormat = reminder.getFullYear();

        reminders.push(`${diaFormat}/${mesFormat}/${anoFormat}`);
    }

    return reminders;
}

    const dataArray = (gerarReminders(data, parseInt(remaining.split("/")[0]), parseInt(remaining.split("/")[1]))).join(", ");
    const txtFormating = [dataArray, name, phone, id]
    const txtAdd = txtFormating.join('$#') + "\n";
    await txtWriteFunction('./wtzpweb/reminderList.txt', (txtAdd));
}

export default setRemainder;

