import { Client, LocalAuth } from "whatsapp-web.js";
import { createTask, getIdByPhone, updateTask } from "../functions/prismaFunctions";
import deleteReminder from "../functions/deleteReminder";
import { reminderMiddleware } from "./modules";
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
    reminderMiddleware(msg);
});

client.initialize();

export { sendMessage };
