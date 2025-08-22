import { Client, LocalAuth } from "whatsapp-web.js";
import { createTask, getIdByPhone, updateTask } from "../functions/prismaFunctions";
import deleteReminder from "../functions/deleteReminder";
const qrcode = require('qrcode-terminal');
interface QuotedMessage {
    body: string;
    type: string;
    kind?: string;
}
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] } // útil para servidores Linux
});

client.on('qr', (qr: string) => {
    qrcode.generate(qr, { small: true });
});

let clientReady = false;
client.on('ready', () => {
    console.log('Client is ready!');
    clientReady = true;
});

const waitClientReady = () => {
    return new Promise<void>((resolve) => {
        if (clientReady) resolve();
        else client.once('ready', () => resolve());
    });
};

const sendMessage = async (phone: string, message: string) => {
    await waitClientReady();
    const formattedPhone = "55" + phone.replace(/\D/g, '') + "@c.us";
    const formattedMessage = `${message}`;

    try {
        console.log(formattedPhone)
        await client.sendMessage(formattedPhone, formattedMessage);
        console.log(`Mensagem enviada para ${formattedPhone}`);
    } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
    }
};


client.on('message', async (msg: any) => {
    console.log('Mensagem recebida:', msg.body);
    if (msg.hasQuotedMsg) {
        if ((msg.body).toLowerCase() === "#ok") {
            const id = parseInt(msg._data.quotedMsg.body.split(" -")[0])
            console.log(id);
            const status = true;
            const isPriority = false;
            const task = await updateTask(
                id,
                status,
                isPriority
            );
            deleteReminder(id);
            await client.sendMessage(msg.from, "Tarefa finalizada com sucesso!")
        } else {
            await client.sendMessage(msg.from, "Se deseja finalizar uma tarefa, responda com *#ok*")
        }

    } else {

        if (msg.body.split("-")[0] === "#n") {
            const formattedPhone = msg.from.split("@")[0].replace(/^(\d{2})/, "");
            const taskName = msg.body.split("-")[1];
            const taskDate = msg.body.split("-")[2].replace(" ", "");
            const reminder = msg.body.split("-")[3].replace(" ", "");
            const id = await getIdByPhone(formattedPhone);

            try {
                const createdTask = await createTask(taskName,
                    taskDate,
                    reminder,
                    "desc",
                    false,
                    id ? id : "",
                    formattedPhone)
            } catch (error) {
                console.log("erro")
            }
        } else {
            await client.sendMessage(msg.from, "Para criar uma nova tarefa envie uma nova mensagem contendo as informações abaixo:")
            await client.sendMessage(msg.from, "1- Nome da Tarefa")
            await client.sendMessage(msg.from, "2- Data da Tarefa")
            await client.sendMessage(msg.from, "3- Dias p/aviso")
            await client.sendMessage(msg.from, "4- Vezes p/dia")
            await client.sendMessage(msg.from, "Formato: #n-Lavar Roupa - 15/02/2000 - {dias}/{3}")
        }

    }

});

client.initialize();

export { sendMessage };
