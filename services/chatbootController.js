import { db } from '../database/conn.js';

let mensajesPendientes = {};

const manejarMensaje = async (client, message) => {
  const numeroUsuario = message.from;

  if (message.isGroupMsg) {
    return;
  }

  mensajesPendientes[numeroUsuario] = message;

  setTimeout(async () => {
    if (mensajesPendientes[numeroUsuario].id === message.id) {
      const ultimoMensaje = mensajesPendientes[numeroUsuario];
      delete mensajesPendientes[numeroUsuario];

      const usuario = await obtenerInfoUsuario(numeroUsuario);
      await procesarMensaje(client, ultimoMensaje, usuario);
    }
  }, 1000);
};

const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

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

  if (message.type === 'chat' && message.body) {
    const mensaje = message.body.toLowerCase();

    if (mensaje === 'hi' || mensaje === 'hola' || mensaje === 'buen dia' || mensaje === 'hola buen dia' || mensaje === 'menú' || mensaje === 'menu') {
      if (usuario) {
        await client.sendText(numeroUsuario, `Hola, buen día. Bienvenido a nuestro bot de respuestas automáticas, ${usuario.nombre_usuario}.`);
        await client.sendText(numeroUsuario, respuestaInicial);
      } else {
        await client.sendText(numeroUsuario, 'Hola, buen día. Bienvenido a nuestro bot de respuestas automáticas\n¿Estás registrado en Descanso Nomada? Responde con "si" o "no".');
        mensajesPendientes[numeroUsuario] = { paso: 'preguntaRegistro' };
      }
    } else if (usuario) {
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
          await client.sendText(numeroUsuario, 'No entiendo tu mensaje. Por favor, escribe "Hola" o "Menú" para ver las opciones.');
          await client.sendText(numeroUsuario, respuestaInicial); 
      }
    } else {
      if (mensaje === 'si' && mensajesPendientes[numeroUsuario] && mensajesPendientes[numeroUsuario].paso === 'preguntaRegistro') {
        await client.sendText(numeroUsuario, 'Por favor, ingresa tu número de identidad.');
        mensajesPendientes[numeroUsuario].paso = 'esperaDNI';
      } else if (mensaje === 'no' && mensajesPendientes[numeroUsuario] && mensajesPendientes[numeroUsuario].paso === 'preguntaRegistro') {
        await client.sendText(numeroUsuario, 'Debes estar registrado para recibir ayuda.');
        delete mensajesPendientes[numeroUsuario];
      } else if (mensajesPendientes[numeroUsuario] && mensajesPendientes[numeroUsuario].paso === 'esperaDNI' && !isNaN(mensaje)) {
        const usuarioPorDni = await obtenerInfoUsuarioPorDNI(mensaje);
        if (usuarioPorDni) {
          await client.sendText(numeroUsuario, `Hola, buen día, bienvenido a nuestro bot de respuestas automáticas, ${usuarioPorDni.nombre_usuario}.`);
          delete mensajesPendientes[numeroUsuario];
        } else {
          await client.sendText(numeroUsuario, 'No hay ningún usuario registrado con esa identificación.');
        }
      } else {
        await client.sendText(numeroUsuario, 'No entiendo tu mensaje. Por favor, escribe "Hola" o "Menú" para ver las opciones.');
        await client.sendText(numeroUsuario, respuestaInicial);
      }
    }
  } else {
    await client.sendText(numeroUsuario, 'No entiendo tu mensaje. Por favor, elige una opción válida o escribe "Hola" o "Menú" para ver las opciones.');
    await client.sendText(numeroUsuario, respuestaInicial);
  }
};

const obtenerInfoUsuario = async (numeroUsuario) => {
  const sql = `SELECT id_usuario, nombre_usuario, correo, dni, telefono FROM tbl_usuarios WHERE telefono = $1`;
  try {
    const numeroFormateado = numeroUsuario.replace('@c.us', '').replace('504', '');
    const result = await db.query(sql, [numeroFormateado]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    return null;
  }
};

const obtenerInfoUsuarioPorDNI = async (dni) => {
  const sql = `SELECT id_usuario, nombre_usuario, correo, dni, telefono FROM tbl_usuarios WHERE dni = $1`;
  try {
    const result = await db.query(sql, [dni]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    return null;
  }
};

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
    console.error('Error al obtener el historial de reservaciones:', error);
    return [];
  }
};

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
    const result = await db.query(sql, [idUsuario]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error al obtener la última reservación:', error);
    return null;
  }
};

export { manejarMensaje };
