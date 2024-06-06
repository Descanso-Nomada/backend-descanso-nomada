import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, NoAuth } = pkg;

let client;

export const initializeWhatsApp = () => {
    client = new Client({
        authStrategy: new NoAuth()  // Asegúrate de que NoAuth se esté utilizando aquí
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
        console.log('Escanea este código QR con tu WhatsApp para iniciar sesión');
    });

    client.on('ready', () => {
        console.log('Cliente de WhatsApp está listo');
    });

    client.on('message_create', message => {
        console.log(`Mensaje recibido: ${message.body}`);
        if (message.body === '!ping') {
            client.sendMessage(message.from, 'pong');
        }
    });

    client.initialize();
};

export const sendMessage = (number, message) => {
    if (!client) {
        throw new Error('El cliente de WhatsApp no está inicializado');
    }
    client.sendMessage(number, message);
};
