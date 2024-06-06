import venom from 'venom-bot';

const whatsapp = venom.create(
  'sessionName',
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
    if (message.body === 'Hi') {
      client.sendText(message.from, 'Hello! This is a response from venom-bot.');
    }
  });

  client.onIncomingCall((call) => {
    client.sendText(call.peerJid, 'I cannot answer calls at the moment.');
  });

  console.log('Client is ready!');
}).catch((err) => console.log(err));

const sendMessage = async (number, message) => {
  try {
    const client = await whatsapp;
    const formattedNumber = `${number}@c.us`;
    await client.sendText(formattedNumber, message);
    console.log('Message sent successfully');
  } catch (err) {
    console.error('Error when sending message:', err);
  }
};

export { whatsapp, sendMessage };
