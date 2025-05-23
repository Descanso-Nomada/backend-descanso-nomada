import { db } from '../database/conn.js';

let mensajesPendientes = {};


//Funcion para el manejo entrante de mensages, ignorando por defecto los mensages grupales
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

//Esta funcion nos ayuda a formatear la fecha de una forma mas legible
const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

//Funcionamiento de las respuestas del chatboot, separado por funciones especificas para un mejor manejo de las respuestas
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

const esMensajeInicial = (mensaje) => {
  const mensajesIniciales = ['hi', 'hola', 'buen dia', 'hola buen dia', 'menú', 'menu'];
  return mensajesIniciales.includes(mensaje);
};
 
const saludarUsuario = async (client, numeroUsuario, usuario) => {
  const saludo = `Hola, ${usuario.nombre_usuario}, soy Eli. ¿En qué puedo ayudarte hoy?`;
  await client.sendText(numeroUsuario, saludo);
};

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


//Funcion para obtener la información del usuario con el que se esta chateando
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


//Funcion para obtener las reservaciones del usuario con el que se esta chateando
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


//Funcion para obtener la ultima reservacion del usuario con el que se esta chateando
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

export { manejarMensaje };
