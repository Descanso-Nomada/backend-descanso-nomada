import venom from 'venom-bot';
import { manejarMensaje } from './chatbootController.js';

let clientInstance;

//Creacion de la instancia del servicio de whatsapp
const startClient = () => {
  venom.create(
    'nombreDeSesion',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log('QR Code:', asciiQR);
    },
    (statusSession, session) => {
      console.log('Status Session:', statusSession);
      console.log('Session name:', session);
    },
    {
      useChrome: false,
      headless: 'new',
      devtools: false,
      browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
      autoClose: 0,
      disableWelcome: true,
      folderNameToken: 'tokens',
    }
  ).then((client) => {
    clientInstance = client;

    client.onMessage((message) => {
      console.log('Mensaje recibido:', message);
      manejarMensaje(client, message).catch(err => console.error('Error al manejar mensaje:', err));
    });

    client.onIncomingCall((call) => {
      console.log('Llamada entrante:', call);
      client.sendText(call.peerJid, 'No puedo responder llamadas en este momento.');
    });

    console.log('¡El cliente está listo!');
  }).catch((err) => {
    console.error('Error initializing WhatsApp client:', err);
  });
};

//Funcion para el envio de mensajes
const sendMessage = async (numero, mensaje) => {
  try {
    if (!clientInstance) {
      throw new Error('El cliente de WhatsApp no está inicializado.');
    }
    const numeroFormateado = `${numero}@c.us`;
    await clientInstance.sendText(numeroFormateado, mensaje);
    console.log('Mensaje enviado con éxito');
  } catch (err) {
    console.error('Error al enviar el mensaje:', err);
  }
};

export { sendMessage, startClient };
