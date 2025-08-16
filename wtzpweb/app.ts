import { Client, LocalAuth } from "whatsapp-web.js";
const qrcode = require('qrcode-terminal');

// Inicializar client com LocalAuth
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] } // útil para servidores Linux
});

// Exibir QR code se necessário
client.on('qr', (qr: string) => {
    qrcode.generate(qr, { small: true });
});

// Indicar quando o client está pronto
let clientReady = false;
client.on('ready', () => {
    console.log('Client is ready!');
    clientReady = true;
});

// Função para enviar mensagem, espera client estar pronto
const waitClientReady = () => {
    return new Promise<void>((resolve) => {
        if (clientReady) resolve();
        else client.once('ready', () => resolve());
    });
};

const sendMessage = async (phone: string, message: string) => {
    await waitClientReady();
    const formattedPhone = "55" + phone.replace(/\D/g, '') + "@c.us";
    const formattedMessage = "Lembrete: " + message;

    try {
        console.log(formattedPhone)
        await client.sendMessage(formattedPhone, formattedMessage);
        console.log(`Mensagem enviada para ${formattedPhone}`);
    } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
    }
};


// Exemplo de resposta a mensagens
client.on('message', (msg) => {
    console.log(msg.from, msg.body);
    if (msg.body === '!ping') {
        msg.reply('pong');
    }
});

// Inicializa o client
client.initialize();

export { sendMessage };
