# Documentación del Servicio de WhatsApp

## Índice

1. [Libreria Utilizada](#librerías-utilizadas)
2. [Funciones Principales](#funciones-principales)
    - [manejarMensaje](#manejarMensaje)
    - [formatearFecha](#formatearFecha)
    - [procesarMensaje](#procesarMensaje)
    - [esMensajeInicial](#esMensajeInicial)
    - [saludarUsuario](#saludarUsuario)
    - [manejarOpcionesMenu](#manejarOpcionesMenu)
    - [obtenerInfoUsuario](#obtenerInfoUsuario)
    - [obtenerHistorialReservaciones](#obtenerHistorialReservaciones)
    - [obtenerUltimaReservacion](#obtenerUltimaReservacion)
3. [Configuración del Cliente de WhatsApp](#configuración-del-cliente-de-whatsapp)
    - [startClient](#startClient)
    - [sendMessage](#sendMessage)

## Libreria Utilizada

### `venom-bot`

- **Descripción**: `venom-bot` es una librería para interactuar con la API de WhatsApp Web.
- **Uso**: Se utiliza para crear una instancia del cliente de WhatsApp, enviar y recibir mensajes, y manejar llamadas entrantes.

```js
import venom from 'venom-bot';
```

## Funciones Principales

### manejarMensaje

- **Descripción**: Función principal para manejar mensajes entrantes. Almacena los mensajes en un objeto `mensajesPendientes` y los procesa después de un tiempo.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `message`: El mensaje recibido.
- **Funcionamiento**: 
  - Almacena el mensaje en `mensajesPendientes`.
  - Procesa el mensaje después de 1 segundo, verificando si el usuario está registrado y enviando una respuesta inicial.

```js
  const manejarMensaje = async (client, message) => {
    const numeroUsuario = message.from;
    console.log('Inicio de chat con:',numeroUsuario)
    if (message.isGroupMsg) {
      return;
    }

    mensajesPendientes[numeroUsuario] = message;

    setTimeout(async () => {
      if (mensajesPendientes[numeroUsuario] && mensajesPendientes[numeroUsuario].id === message.id) {
        const ultimoMensaje = mensajesPendientes[numeroUsuario];
        delete mensajesPendientes[numeroUsuario];
        const usuario = await obtenerInfoUsuario(numeroUsuario);
        await procesarMensaje(client, ultimoMensaje, usuario);
      }
    }, 1000);
  };
```

### formatearFecha

- **Descripción**: Formatea una fecha en un formato legible en español.
- **Parámetros**:
  - `fecha`: La fecha a formatear.
- **Funcionamiento**: Devuelve la fecha formateada en un formato legible.

```js
const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
};
```

### procesarMensaje

- **Descripción**: Procesa el mensaje del usuario y envía la respuesta correspondiente.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `message`: El mensaje recibido.
  - `usuario`: Información del usuario.
- **Funcionamiento**: 
  - Envía un saludo inicial si el mensaje es un saludo.
  - Maneja las opciones del menú si el usuario está registrado.

```js
const procesarMensaje = async (client, message, usuario) => {
  const numeroUsuario = message.from;
  const respuestaInicial = `
  Bienvenido al chatbot. Por favor, elige una opción:
  1. Ver historial de reservaciones.
  2. Ver estado de reservación.
  3. Información del usuario.
  4. Ir a la web.
  5. Salir.
  `;

  const mensaje = message.body.toLowerCase().trim();

  if (esMensajeInicial(mensaje)) {
    if (usuario) {
      await saludarUsuario(client, numeroUsuario, usuario);
      await client.sendText(numeroUsuario, respuestaInicial);
    } else {
      await client.sendText(numeroUsuario, 'Lo sentimos, este número no está registrado en nuestros sistemas. Si quieres ser parte de Descanso Nomada, puedes registrarte a través del siguiente enlace: http://localhost:5174/singIn');
    }
  } else if (usuario) {
    await manejarOpcionesMenu(client, mensaje, usuario, numeroUsuario);
  } else {
    await client.sendText(numeroUsuario, 'No entiendo tu mensaje. Por favor, escribe "Hola" o "Menú" para ver las opciones.');
  }
};
```

### esMensajeInicial

- **Descripción**: Verifica si el mensaje es un saludo inicial.
- **Parámetros**:
  - `mensaje`: El mensaje recibido.
- **Funcionamiento**: Devuelve `true` si el mensaje es un saludo inicial.

```js
const esMensajeInicial = (mensaje) => {
  const mensajesIniciales = ['hi', 'hola', 'buen dia', 'hola buen dia', 'menú', 'menu'];
  return mensajesIniciales.includes(mensaje);
};
```

### saludarUsuario

- **Descripción**: Envía un saludo al usuario.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `numeroUsuario`: El número de teléfono del usuario.
  - `usuario`: Información del usuario.
- **Funcionamiento**: Envía un mensaje de saludo al usuario.

```js
const saludarUsuario = async (client, numeroUsuario, usuario) => {
  const saludo = `Hola, ${usuario.nombre_usuario}, soy Eli. ¿En qué puedo ayudarte hoy?`;
  await client.sendText(numeroUsuario, saludo);
};
```

### manejarOpcionesMenu

- **Descripción**: Maneja las opciones del menú enviadas por el usuario.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `mensaje`: El mensaje recibido.
  - `usuario`: Información del usuario.
  - `numeroUsuario`: El número de teléfono del usuario.
- **Funcionamiento**: Envía una respuesta basada en la opción seleccionada por el usuario.

```js
const manejarOpcionesMenu = async (client, mensaje, usuario, numeroUsuario) => {
  const respuestaInicial = `
  Bienvenido al chatbot. Por favor, elige una opción:
  1. Ver historial de reservaciones.
  2. Ver estado de reservación.
  3. Información del usuario.
  4. Ir a la web.
  5. Salir.
  `;

  switch (mensaje) {
    case '1':
      const historial = await obtenerHistorialReservaciones(usuario.id_usuario);
      if (historial.length > 0) {
        const respuestaHistorial = historial.map((reserva) => `
          Hotel: ${reserva.nombre_hotel}
          Tipo de Habitación: ${reserva.nombre_tipo_habitacion}
          Fecha de Entrada: ${formatearFecha(reserva.fecha_entrada)}
          Fecha de Salida: ${formatearFecha(reserva.fecha_salida)}
          Total: ${reserva.total} Lps
          Estado: ${reserva.estado}
        `).join('\n');
        await client.sendText(numeroUsuario, `Historial de reservaciones:\n${respuestaHistorial}`);
      } else {
        await client.sendText(numeroUsuario, 'Aún no ha hecho ninguna reservación en ningún hotel.');
      }
      break;
    case '2':
      const estadoReservacion = await obtenerUltimaReservacion(usuario.id_usuario);
      if (estadoReservacion) {
        await client.sendText(numeroUsuario, `Última reservación:\nHotel: ${estadoReservacion.nombre_hotel}\nTipo de Habitación: ${estadoReservacion.nombre_tipo_habitacion}\nFecha de Entrada: ${formatearFecha(estadoReservacion.fecha_entrada)}\nFecha de Salida: ${formatearFecha(estadoReservacion.fecha_salida)}\nTotal: ${estadoReservacion.total} Lps\nEstado: ${estadoReservacion.estado}`);
      } else {
        await client.sendText(numeroUsuario, 'Aún no ha hecho ninguna reservación en ningún hotel.');
      }
      break;
    case '3':
      await client.sendText(numeroUsuario, `Información del usuario:\nNombre: ${usuario.nombre_usuario}\nCorreo: ${usuario.correo}\nDNI: ${usuario.dni}\nTeléfono: ${usuario.telefono}`);
      break;
    case '4':
      await client.sendText(numeroUsuario, 'Visita nuestra web: http://localhost:5173');
      break;
    case '5':
      await client.sendText(numeroUsuario, 'Gracias por usar nuestro servicio. ¡Hasta luego!');
      break;
    default:
      await client.sendText(numeroUsuario, 'No entiendo tu mensaje. Por favor, elige una opción válida o escribe "Hola" o "Menú" para ver las opciones.');
      await client.sendText(numeroUsuario, respuestaInicial);
  }
};

```

### obtenerInfoUsuario

- **Descripción**: Obtiene la información del usuario desde la base de datos.
- **Parámetros**:
  - `numeroUsuario`: El número de teléfono del usuario.
- **Funcionamiento**: Devuelve la información del usuario si está registrado.

```js
const obtenerInfoUsuario = async (numeroUsuario) => {
  const sql = `SELECT id_usuario, nombre_usuario, correo, dni, telefono FROM tbl_usuarios WHERE telefono = $1`;
  try {
    const numeroFormateado = numeroUsuario.replace('@c.us', '').replace('504', '');
    const result = await db.query(sql, [numeroFormateado]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    return null;
  }
};
```

### obtenerHistorialReservaciones

- **Descripción**: Obtiene el historial de reservaciones del usuario.
- **Parámetros**:
  - `idUsuario`: El ID del usuario.
- **Funcionamiento**: Devuelve el historial de reservaciones del usuario.

```js
const obtenerHistorialReservaciones = async (idUsuario) => {
  const sql = `
    SELECT h.nombre AS nombre_hotel, th.nombre_tipo AS nombre_tipo_habitacion, rd.fecha_entrada, rd.fecha_salida, rd.total, rd.estado
    FROM tbl_reservaciones_detalle rd
    JOIN tbl_hoteles h ON rd.id_hotel = h.id_hotel
    JOIN tbl_tipos_habitacion th ON rd.id_tipo_habitacion = th.id_tipo_habitacion
    WHERE rd.id_usuario = $1
    ORDER BY rd.fecha_entrada DESC
  `;
  try {
    const result = await db.query(sql, [idUsuario]);
    return result.length > 0 ? result : [];
  } catch (error) {
    return [];
  }
};

```

### obtenerUltimaReservacion

- **Descripción**: Obtiene la última reservación del usuario.
- **Parámetros**:
  - `idUsuario`: El ID del usuario.
- **Funcionamiento**: Devuelve la última reservación del usuario.

```js
const obtenerUltimaReservacion = async (idUsuario) => {
  const sql = `
    SELECT h.nombre AS nombre_hotel, th.nombre_tipo AS nombre_tipo_habitacion, r.fecha_entrada, r.fecha_salida, r.total, r.estado
    FROM tbl_reservaciones r
    JOIN tbl_habitaciones hab ON r.id_habitacion = hab.id_habitacion
    JOIN tbl_hoteles h ON hab.id_hotel = h.id_hotel
    JOIN tbl_tipos_habitacion th ON hab.id_tipo_habitacion = th.id_tipo_habitacion
    WHERE r.id_usuario = $1
    ORDER BY r.fecha_entrada DESC
    LIMIT 1
  `;
  try {
    console.log('Buscando última reservación para usuario ID:', idUsuario);
    const result = await db.query(sql, [idUsuario]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    return null;
  }
};
```

## Configuración del Cliente de WhatsApp

### startClient

- **Descripción**: Función para iniciar el cliente de WhatsApp utilizando `venom-bot`.
- **Funcionamiento**:
  - Crea una instancia del cliente de WhatsApp.
  - Muestra el código QR en la consola para escanearlo.
  - Maneja el estado de la sesión.
  - Configura el cliente para manejar mensajes y llamadas entrantes.

```js
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
```

### sendMessage

- **Descripción**: Función para enviar mensajes a través del cliente de WhatsApp.
- **Parámetros**:
  - `numero`: El número de teléfono del destinatario.
  - `mensaje`: El mensaje a enviar.
- **Funcionamiento**: 
  - Formatea el número de teléfono.
  - Envía el mensaje utilizando el cliente de WhatsApp.
  - Maneja errores si el cliente no está inicializado o si ocurre un error al enviar el mensaje.

```js
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

```

## Ejemplo de Uso

```javascript
import { startClient, sendMessage } from './whatsappService';

// Iniciar el cliente de WhatsApp
startClient();

// Enviar un mensaje
sendMessage('1234567890', 'Hola, este es un mensaje de prueba.');
