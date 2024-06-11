import venom from 'venom-bot';
import { manejarMensaje } from './chatbootController.js';

const whatsapp = venom.create(
  'nombreDeSesion',
  (base64Qr, asciiQR, attempts, urlCode) => {
    console.log(asciiQR);
  },
  undefined,
  {
    useChrome: false,
    headless: 'new',
    devtools: false,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox']
  }
);

whatsapp.then((client) => {
  client.onMessage((message) => {
    manejarMensaje(client, message);
  });

  client.onIncomingCall((call) => {
    client.sendText(call.peerJid, 'No puedo responder llamadas en este momento.');
  });

  console.log('¡El cliente está listo!');
}).catch((err) => console.log(err));

const sendMessage = async (numero, mensaje) => {
  try {
    const client = await whatsapp;
    const numeroFormateado = `${numero}@c.us`;
    await client.sendText(numeroFormateado, mensaje);
    console.log('Mensaje enviado con éxito');
  } catch (err) {
    console.error('Error al enviar el mensaje:', err);
  }
};

export { whatsapp, sendMessage };
