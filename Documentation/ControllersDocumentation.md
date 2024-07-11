# Documentación de Funciones

## Índice

1. [Funciones de Usuarios](#funciones-de-usuarios)
    - [registrarUsuario](#registrarusuario)
    - [mostrarUsuarios](#mostrarusuarios)
    - [eliminarUsuario](#eliminarusuario)
    - [actualizarContrasenia](#actualizarcontrasenia)
2. [Funciones de Reservaciones](#funciones-de-reservaciones)
    - [crearReservacion](#crearreservacion)
    - [obtenerReservaciones](#obtenerreservaciones)
    - [reservacionesUsuario](#reservacionesusuario)
    - [actualizarReservacion](#actualizarreservacion)
    - [eliminarReservacion](#eliminarreservacion)
3. [Funciones de Seguridad](#funciones-de-seguridad)
    - [sendCode](#sendcode)
    - [changePass](#changepass)
4. [Funciones de Habitaciones](#funciones-de-habitaciones)
    - [registrarHabitacion](#registrarhabitacion)
    - [listarHabitaciones](#listarhabitaciones)
    - [eliminarHabitacion](#eliminarhabitacion)
    - [tipoHabitaciones](#tipohabitaciones)
    - [cambiarEstadoHabitacion](#cambiarestadohabitacion)
    - [listarHabitacionId](#listarhabitacionid)
    - [actualizarHabitacion](#actualizarhabitacion)
    - [mostrarComentariosHabitacion](#mostrarcomentarioshabitacion)
    - [guardarComentario](#guardarcomentario)
5. [Funciones de Hoteles](#funciones-de-hoteles)
    - [registrarHotel](#registrarhotel)
    - [borrarHotel](#borrarhotel)
    - [mostrarHoteles](#mostrarhoteles)
    - [mostrarHotel](#mostrarhotel)
    - [hotelesInactivos](#hotelesinactivos)
    - [cambiarEstadoHotel](#cambiarestadohotel)
    - [actualizarContraseniaHotel](#actualizarcontraseniahotel)
    - [mostrarCalificacionHotel](#mostrarcalificacionhotel)
    - [guardarCalificacionHotel](#guardarcalificacionhotel)
6. [Funciones de Imágenes](#funciones-de-imágenes)
    - [insertImgHotel](#insertimghotel)
    - [insertImgHabitacion](#insertimghabitacion)
    - [imagenesHotel](#imagenesHotel)
    - [imagenesHabitacion](#imagenesHabitacion)
    - [eliminarImgHabitacion](#eliminarimghabitacion)
    - [eliminarImgHotel](#eliminarimghotel)
7. [Funciones de Localización](#funciones-de-localización)
    - [obtenerDepartamentos](#obtenerdepartamentos)
    - [municipiosPorDepartamento](#municipiospordepartamento)
    - [obtenerMunicipios](#obtenermunicipios)
    - [ciudadesPorMunicipios](#ciudadespormunicipios)
    - [coloniasporCiudad](#coloniasporciudad)
8. [Funciones de Historial](#funciones-de-historial)
    - [obtenerHistorial](#obtenerhistorial)
9. [Funciones de Estadísticas](#funciones-de-estadísticas)
    - [habitaciones_rentadaXnorentada](#habitaciones_rentadaxnorentada)
    - [usuarios_registradosXcategoria](#usuarios_registradosxcategoria)
    - [hotelesMasValorados](#hotelesmasvalorados)

## Funciones de Usuarios

### registrarUsuario

**Descripción**: Registra un nuevo usuario en la base de datos.

**Detalles**:
- Recibe los datos del usuario, incluyendo la imagen.
- Hashea la contraseña del usuario.
- Llama a un procedimiento almacenado para registrar el usuario.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const registrarUsuario = async (req, res) => {
    const { nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento,contrasenia }= req.body;
    const imagen_usuario = req.file.buffer;
    const nombre_archivo = req.file.originalname;
    const extension_archivo = req.file.mimetype;
    try {
        const salt = await bcrypt.genSalt(15);
        const contraseniaHash = await bcrypt.hash(contrasenia, salt);
        const sql = `CALL sp_registrar_usuario($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const values = [nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contraseniaHash, imagen_usuario, nombre_archivo, extension_archivo];
        await db.query(sql, values);
        res.json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar el usuario', error });
    }
}
```

### mostrarUsuarios

**Descripción**: Muestra todos los usuarios con el rol de cliente.

**Detalles**:
- Selecciona todos los usuarios donde `ID_ROL` es igual a 2.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const mostrarUsuarios = async (req, res) => {
    try {
        const query = `
        SELECT 
            ID_USUARIO, 
            NOMBRE_USUARIO, 
            DNI, 
            CORREO, 
            TELEFONO,
            IMAGEN_USUARIO,
            NOMBRE_ARCHIVO,
            EXTENSION_ARCHIVO 
        FROM TBL_USUARIOS 
        WHERE ID_ROL = 2;
        `;
        const result = await db.query(query);

        const data = result.map(row => ({
            ...row,
            imagen_usuario: row.imagen_usuario ? Buffer.from(row.imagen_usuario).toString('base64') : null,
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar usuarios' });
    }
};
```

### eliminarUsuario

**Descripción**: Elimina un usuario de la base de datos por su ID.

**Detalles**:
- Elimina el usuario de la tabla `TBL_USUARIOS` y devuelve el registro eliminado.
- Devuelve un mensaje de éxito en formato JSON si el usuario es eliminado.
- Si el usuario no existe, devuelve un mensaje de error.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const eliminarUsuario = async (req, res) => {
    const values = [req.params.id];
    try {
        const sql = 'DELETE FROM TBL_USUARIOS WHERE ID_USUARIO = $1 RETURNING *';
        const result = await db.query(sql, values);

        if (result.length == 0) {
            res.json({ error: 'El usuario no existe' });
        } else {
            res.json({
                message: 'Usuario eliminado con éxito',
                data: result[0]
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};
```

### actualizarContrasenia

**Descripción**: Actualiza la contraseña de un usuario.

**Detalles**:
- Verifica la contraseña actual del usuario.
- Hashea la nueva contraseña y la actualiza en la base de datos.
- Si se proporciona una nueva imagen, también la actualiza.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const actualizarContrasenia = async (req, res) => {
    const { correo, contrasenia, nueva_contrasenia } = req.body;
    const params = [req.userid, correo, contrasenia, nueva_contrasenia];
    try {
        const sql = 'SELECT CONTRASENIA FROM TBL_USUARIOS WHERE ID_USUARIO = $1';
        const getPass = await db.query(sql, [params[0]]);
        const passwordCorrect = await bcrypt.compare(params[2], getPass[0].contrasenia);
        if (!passwordCorrect) {
            res.status(201).json({ msg: 'Contraseña Incorrecta' });
            return;
        } else {
            const salt = await bcrypt.genSalt(15);
            const contraseniaHash = await bcrypt.hash(params[3], salt);
            const sql2 = 'UPDATE TBL_USUARIOS SET CONTRASENIA = $2 WHERE ID_USUARIO = $1';
            const values = [params[0], contraseniaHash];
            await db.query(sql2, values);

            if (req.file) {
                const { buffer, originalname, mimetype } = req.file;
                const imageSql = 'UPDATE TBL_USUARIOS SET IMAGEN_USUARIO = $2, NOMBRE_ARCHIVO = $3, EXTENSION_ARCHIVO = $4 WHERE ID_USUARIO = $1';
                const imageValues = [params[0], buffer, originalname, mimetype];
                await db.query(imageSql, imageValues);
            }

            res.json({ msg: 'Contraseña e imagen actualizadas correctamente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
}
```

## Funciones de Reservaciones

### crearReservacion

**Descripción**: Crea una nueva reservación para una habitación.

**Detalles**:
- Verifica el precio de la habitación y calcula el total.
- Obtiene la información del usuario y la habitación.
- Inserta la nueva reservación en la base de datos.
- Envía una factura por correo electrónico al usuario.
- Envía una notificación por WhatsApp al usuario y al hotel.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const crearReservacion = async (req, res) => {
  try {
    const precioHabitacionQuery = `SELECT PRECIO_NOCHE FROM TBL_HABITACIONES WHERE ID_HABITACION = $1`;
    const precioHabitacionResult = await db.query(precioHabitacionQuery, [
      req.body.id_habitacion,
    ]);
    if (precioHabitacionResult.length === 0) {
      return res.status(404).json({ msg: "Habitación no encontrada" });
    }

    const precioNoche = precioHabitacionResult[0].precio_noche;
    const total = precioNoche * req.body.cant_noches;
    const usuarioQuery = `SELECT CORREO, NOMBRE_USUARIO, TELEFONO FROM TBL_USUARIOS WHERE ID_USUARIO = $1`;
    const usuarioResult = await db.query(usuarioQuery, [req.userid]);

    if (usuarioResult.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Obtener la información de la habitación
    const habitacionQuery = `
        SELECT 
          A.ID_HABITACION,
          B.NOMBRE_TIPO,
          A.DESCRIPCION,
          C.NOMBRE AS nombre_hotel,
          C.NO_WHATSAPP AS whatsapp_hotel
        FROM TBL_HABITACIONES A
        INNER JOIN TBL_TIPOS_HABITACION B ON A.ID_TIPO_HABITACION = B.ID_TIPO_HABITACION
        INNER JOIN TBL_HOTELES C ON A.ID_HOTEL = C.ID_HOTEL
        WHERE A.ID_HABITACION = $1
      `;
    const habitacionResult = await db.query(habitacionQuery, [
      req.body.id_habitacion,
    ]);

    if (habitacionResult.length === 0) {
      return res.status(404).json({ msg: "Habitación no encontrada" });
    }

    const habitacionDescripcion = habitacionResult[0].descripcion;
    const habitacionNombre_tipo = habitacionResult[0].nombre_tipo;

    // Insertar la reservación en la base de datos
    const params = [
      req.body.id_habitacion,
      req.userid,
      req.body.cant_noches,
      total,
      req.body.fecha_entrada,
      req.body.fecha_salida,
    ];
    const sql = `
            INSERT INTO TBL_RESERVACIONES
            (ID_HABITACION, ID_USUARIO, CANT_NOCHES, TOTAL, FECHA_ENTRADA, FECHA_SALIDA)
            VALUES($1, $2, $3, $4, $5, $6)
        `;
    await db.query(sql, params);

    // Enviar la factura
    enviarFactura(
      usuarioResult[0].correo,
      usuarioResult[0].nombre_usuario,
      habitacionNombre_tipo,
      habitacionDescripcion,
      precioNoche,
      req.body.cant_noches,
      total
    );

    // Enviar notificación por WhatsApp
    const message = `Hola ${usuarioResult[0].nombre_usuario}, departe del equipo de descanso nómada te informamos que tu solicitud de reservación para la fecha ${req.body.fecha_entrada} con fecha de salida ${req.body.fecha_salida} en ${habitacionResult[0].nombre_hotel} ha sido generada exitosamente, cuando esta lista la respuesta del hotel se le enviará otra notificación como esta.`;
    const messageHotel = `Hola ${habitacionResult[0].nombre_hotel}, le informamos que tiene una solicitud de reserva, por favor revise su área de solicitudes lo más pronto posible.`;
    sendMessage(`${usuarioResult[0].telefono}`, message);
    //sendMessage(`${habitacionResult[0].whatsapp_hotel}`, messageHotel);

    // Enviar la respuesta
    res.json({
      message: "Solicitud de reserva creada exitosamente",
      message2: "Espere unos minutos mientras el hotel gestiona su solicitud",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      msg: "Error al registrar la reservación",
    });
  }
};
```

### obtenerReservaciones

**Descripción**: Obtiene todas las reservaciones para un hotel específico.

**Detalles**:
- Realiza una consulta SQL para obtener todas las reservaciones del hotel especificado.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const obtenerReservaciones = async (req, res) => {
  const idHotel = req.idHotel;
  try {
    const sql = `
        SELECT
        r.*,
        u.NOMBRE_USUARIO,
        u.CORREO,
        u.TELEFONO,
        h.ID_HABITACION,
        h.ID_HOTEL,
        h.PUBLICACION_ACTIVA,
        j.ID_TIPO_HABITACION,
        j.NOMBRE_TIPO,
        h.CAPACIDAD,
        h.DESCRIPCION,
        h.RENTADA,
        h.CARACTERISTICAS,
        h.PRECIO_NOCHE
        FROM
            TBL_RESERVACIONES AS r
        JOIN
            TBL_HABITACIONES AS h ON r.ID_HABITACION = h.ID_HABITACION
        JOIN
            TBL_HOTELES AS t ON h.ID_HOTEL = t.ID_HOTEL
        JOIN 
            TBL_TIPOS_HABITACION AS j ON j.ID_TIPO_HABITACION = h.ID_TIPO_HABITACION
        JOIN
            TBL_USUARIOS AS u ON u.ID_USUARIO = r.ID_USUARIO
        WHERE
            t.ID_HOTEL = $1;
        `;
    const result = await db.query(sql, [idHotel]);
    if (result.length >= 0) {
      res.json(result);
    } else {
      res.status(404).json({
        message: "No hay reservaciones no revisadas para este hotel.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### reservacionesUsuario

**Descripción**: Obtiene todas las reservaciones de un usuario específico.

**Detalles**:
- Realiza una consulta SQL para obtener todas las reservaciones del usuario especificado.
- Devuelve los resultados en formato JSON.
- En caso de que no haya reservaciones, devuelve un mensaje indicando que no tiene reservaciones.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const reservacionesUsuario = async (req, res) => {
  let userid = req.params.userid;
  const sql = `
        SELECT
        TBL_HOTELES.NOMBRE AS nombre_hotel,
        TBL_HABITACIONES.ID_HABITACION AS id_habitacion,
        TBL_HABITACIONES.CAPACIDAD AS capacidad_habitacion,
        TBL_HABITACIONES.DESCRIPCION AS descripcion_habitacion,
        TBL_HABITACIONES.PRECIO_NOCHE AS precio_noche,
        TBL_RESERVACIONES.ID_RESERVACION AS id_reservacion,
        TBL_RESERVACIONES.CANT_NOCHES AS cant_noches,
        TBL_RESERVACIONES.ESTADO AS estado_reservacion,
        TBL_RESERVACIONES.TOTAL AS total_reservacion,
        TBL_RESERVACIONES.FECHA_ENTRADA AS fecha_entrada,
        TBL_RESERVACIONES.FECHA_SALIDA AS fecha_salida
        FROM
            TBL_RESERVACIONES
        JOIN
            TBL_HABITACIONES ON TBL_RESERVACIONES.ID_HABITACION = TBL_HABITACIONES.ID_HABITACION
        JOIN
            TBL_HOTELES ON TBL_HABITACIONES.ID_HOTEL = TBL_HOTELES.ID_HOTEL
        WHERE
            TBL_RESERVACIONES.ID_USUARIO = $1;
    `;
  try {
    const result = await db.query(sql, [userid]);
    if (result.length === 0) {
      res.json({
        message: "Usted no tiene reservaciones",
      });
    } else {
      res.json({
        data: result,
        message: "Consulta exitosa",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### actualizarReservacion

**Descripción**: Actualiza el estado de una reservación específica.

**Detalles**:
- Actualiza el estado de la reservación en la base de datos.
- Envía una notificación por WhatsApp al usuario informándole sobre el estado de la reservación.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de que no se encuentre la reservación, devuelve un mensaje indicando que no se encontró.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const actualizarReservacion = async (req, res) => {
  let params = [req.body.estado, req.body.reservacionID];
  const sql = `
        UPDATE TBL_RESERVACIONES
        SET ESTADO = $1
        WHERE ID_RESERVACION = $2
        RETURNING *
    `;
  try {
    const result = await db.query(sql, params);
    if (result.length > 0) {
      const usuarioReservacionQuery = `
                SELECT 
                    R.ID_RESERVACION,
                    U.ID_USUARIO,
                    U.NOMBRE_USUARIO,
                    U.CORREO AS correo_usuario,
                    U.TELEFONO AS telefono_usuario,
                    H.NOMBRE AS nombre_hotel,
                    H.NO_TELEFONO AS telefono_hotel,
                    H.NO_WHATSAPP AS whatsapp_hotel,
                    T.NOMBRE_TIPO AS nombre_tipo_habitacion,
                    R.CANT_NOCHES,
                    LOWER(R.ESTADO) AS estado,
                    R.TOTAL,
                    R.FECHA_ENTRADA,
                    R.FECHA_SALIDA
                FROM TBL_RESERVACIONES R
                INNER JOIN TBL_USUARIOS U ON R.ID_USUARIO = U.ID_USUARIO
                INNER JOIN TBL_HABITACIONES A ON R.ID_HABITACION = A.ID_HABITACION
                INNER JOIN TBL_HOTELES H ON A.ID_HOTEL = H.ID_HOTEL
                INNER JOIN TBL_TIPOS_HABITACION T ON A.ID_TIPO_HABITACION = T.ID_TIPO_HABITACION
                WHERE R.ID_RESERVACION = $1
            `;
      const info = await db.query(usuarioReservacionQuery, [
        req.body.reservacionID,
      ]);
      const message = `Estimado ${info[0].nombre_usuario}, le informamos que su solicitud de reserva en ${info[0].nombre_hotel} en la ${info[0].nombre_tipo_habitacion} fue ${info[0].estado}. Si tiene alguna consulta, se puede comunicar con el hotel al siguiente número: ${info[0].telefono_hotel} o escribir al WhatsApp: ${info[0].whatsapp_hotel}`;
      await sendMessage(`${info[0].telefono_usuario}`, message);

      res.json({
        data: result[0],
        message: `Actualización exitosa: La reservación fue ${params[0]}`,
      });
    } else {
      res
        .status(404)
        .json({ message: "No se encontró la reservación para actualizar." });
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};
```

### eliminarReservacion

**Descripción**: Elimina una reservación específica que no ha sido revisada.

**Detalles**:
- Elimina la reservación de la base de datos si su estado es "NO REVISADO".
- Devuelve un mensaje de éxito en formato JSON.
- En caso de que no se encuentre la reservación, devuelve un mensaje indicando que no hay reservaciones no revisadas.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const eliminarReservacion = async (req, res) => {
  const reservacionID = req.params.id;
  const sql = `
        DELETE FROM TBL_RESERVACIONES 
        WHERE ID_RESERVACION = $1 
        AND ESTADO = 'NO REVISADO'
    `;
  try {
    const result = await db.query(sql, [reservacionID]);
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({
        message: "No hay reservaciones no revisadas para este hotel.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Funciones de Seguridad

### sendCode

**Descripción**: Envía un código de seguridad al correo del usuario.

**Detalles**:
- Verifica si el correo electrónico existe en la base de datos.
- Genera un código de seguridad de 6 dígitos.
- Envía el código de seguridad al correo del usuario.
- Devuelve un mensaje indicando si el correo fue enviado o no.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const sendCode = async (req, res) => {
    const { email } = req.body;

    try {
        const userQuery = `
            SELECT * FROM TBL_USUARIOS WHERE CORREO = $1
        `;
        const userResult = await db.any(userQuery, [email]);

        if (userResult.length === 0) {
            return res.status(200).json({
                res: false,
                message: 'El correo electrónico no es válido',
            });
        } else {
            const generateSecurityCode = () => {
                return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
            };
            codigoSeguridad = generateSecurityCode();
            enviarCodigo(email, userResult[0].nombre_usuario, codigoSeguridad);
            return res.status(200).json({
                res: true,
                message: 'Se envió el código de seguridad a: ' + email,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Error al verificar el correo electrónico',
        });
    }
};
```

### changePass

**Descripción**: Cambia la contraseña del usuario utilizando el código de seguridad.

**Detalles**:
- Verifica si el correo electrónico y el código de seguridad son correctos.
- Hashea la nueva contraseña.
- Actualiza la contraseña del usuario en la base de datos.
- Devuelve un mensaje indicando si la contraseña fue actualizada exitosamente.
- En caso de error, devuelve un mensaje de error con el estado 500.
```js
const changePass = async (req, res) => {
    const { email, securityCode, password } = req.body;
    
    try {
        const userQuery = `
            SELECT * FROM TBL_USUARIOS WHERE CORREO = $1
        `;
        const userResult = await db.query(userQuery, [email]);

        if (userResult.length === 0 || securityCode !== codigoSeguridad) {
            return res.status(400).json({
                res: false,
                message: 'Código de seguridad o correo electrónico incorrecto',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateQuery = `
            UPDATE TBL_USUARIOS SET CONTRASENIA = $1 WHERE CORREO = $2
        `;
        await db.query(updateQuery, [hashedPassword, email]);

        res.json({
            res: true,
            message: 'Contraseña actualizada exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Error al actualizar la contraseña',
        });
    }
};
```

## Funciones de Habitaciones

### registrarHabitacion

**Descripción**: Registra una nueva habitación y guarda sus imágenes.

**Detalles**:
- Inserta los datos de la habitación en la base de datos utilizando una función almacenada.
- Verifica que se suban exactamente 5 imágenes y las guarda en la base de datos.
- Devuelve un mensaje de éxito y el ID de la habitación registrada.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const registrarHabitacion = async (req, res) => {
    const { id_tipo_habitacion, capacidad, descripcion, caracteristicas, precio_noche } = req.body;
    const dataHabitacion = [req.idHotel, true, id_tipo_habitacion, capacidad, descripcion, false, caracteristicas, precio_noche];

    try {
        const sqlHabitacion = 'SELECT registrar_habitacion($1, $2, $3, $4, $5, $6, $7, $8) AS id_habitacion';
        const resultadoHabitacion = await db.query(sqlHabitacion, dataHabitacion);
        const id_habitacion = resultadoHabitacion[0].id_habitacion;

        if (req.files && req.files.length === 5) {
            for (let file of req.files) {
                const { buffer, originalname, mimetype } = file;
                const dataImagen = [id_habitacion, buffer, originalname, mimetype];
                const sqlImagen = `INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                                   VALUES ($1, $2, $3, $4)`;
                await db.query(sqlImagen, dataImagen);
            }
        } else {
            return res.status(400).json({ mensaje: "Debes subir exactamente 5 imágenes." });
        }

        res.status(200).json({
            mensaje: "Habitación registrada y imágenes guardadas exitosamente.",
            id_habitacion
        });
    } catch (error) {
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};
```

### listarHabitaciones

**Descripción**: Lista todas las habitaciones de un hotel.

**Detalles**:
- Selecciona las habitaciones del hotel junto con su tipo e imagen más reciente.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const listarHabitaciones = async (req, res) => {
    let id = req.idHotel || req.params.id;
    try {
        const sql = `
            SELECT h.*, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION, i.ID_IMG_HABITACION, i.NOMBRE_ARCHIVO, i.EXTENSION_ARCHIVO, encode(i.IMAGEN_HABITACION, 'base64') as IMAGEN_HABITACION
            FROM TBL_HABITACIONES h
            LEFT JOIN TBL_TIPOS_HABITACION th ON h.ID_TIPO_HABITACION = th.ID_TIPO_HABITACION
            LEFT JOIN LATERAL (
                SELECT ID_IMG_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO, IMAGEN_HABITACION
                FROM TBL_IMAGENES_HABITACIONES
                WHERE ID_HABITACION = h.ID_HABITACION
                ORDER BY ID_IMG_HABITACION DESC
                LIMIT 1
            ) i ON true
            WHERE h.ID_HOTEL = $1
        `;
        const result = await db.query(sql, [id]);
        res.json(result);
    } catch (error) {
        res.status(500).send({ mensaje: "Error al obtener las habitaciones con tipos e imágenes" });
    }
};
```

### eliminarHabitacion

**Descripción**: Elimina una habitación por su ID.

**Detalles**:
- Elimina la habitación de la base de datos.
- Devuelve un mensaje de éxito.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const eliminarHabitacion = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM TBL_HABITACIONES WHERE ID_HABITACION = $1";
        const result = await db.query(sql, [id]);
        res.json({
            message: 'Habitación eliminada con éxito',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la habitación' });
    }
};
```

### tipoHabitaciones

**Descripción**: Obtiene todos los tipos de habitaciones.

**Detalles**:
- Selecciona todos los tipos de habitaciones de la base de datos.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const tipoHabitaciones = async (req, res) => {
    const sql = `
        SELECT * FROM TBL_TIPOS_HABITACION
    `;
    try {
        const result = await db.query(sql);
        if (result.length === 0) {
            res.json({
                message: 'No se encontró ningún tipo de habitaciones'
            });
        } else {
            res.json({
                data: result,
                message: 'Éxito al obtener los tipos de habitaciones'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tipos de habitación' });
    }
};
```

### cambiarEstadoHabitacion

**Descripción**: Cambia el estado de una habitación.

**Detalles**:
- Actualiza el estado de una habitación en la base de datos.
- Devuelve un mensaje de éxito.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const cambiarEstadoHabitacion = async (req, res) => {
    const params = [req.params.id, req.body.estado];
    const sql = 'UPDATE TBL_HABITACIONES SET RENTADA = $2 WHERE ID_HABITACION = $1';
    try {
        const result = await db.query(sql, params);
        res.json({
            data: result,
            message: 'Estado actualizado exitosamente'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de la habitación' });
    }
};

```

### listarHabitacionId

**Descripción**: Lista los detalles de una habitación por su ID.

**Detalles**:
- Selecciona los detalles de la habitación junto con su tipo y todas sus imágenes.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const listarHabitacionId = async (req, res) => {
    const params = [req.params.id];
    try {
        const sql = `
        SELECT h.*, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION, 
        array_agg(json_build_object(
             'ID_IMG_HABITACION', i.ID_IMG_HABITACION,
             'NOMBRE_ARCHIVO', i.NOMBRE_ARCHIVO,
             'EXTENSION_ARCHIVO', i.EXTENSION_ARCHIVO,
             'IMAGEN_HABITACION', encode(i.IMAGEN_HABITACION, 'base64')
         )) AS IMAGENES_HABITACION
        FROM TBL_HABITACIONES h
        LEFT JOIN TBL_TIPOS_HABITACION th ON h.ID_TIPO_HABITACION = th.ID_TIPO_HABITACION
        LEFT JOIN TBL_IMAGENES_HABITACIONES i ON h.ID_HABITACION = i.ID_HABITACION
        WHERE h.ID_HABITACION = $1
        GROUP BY h.ID_HABITACION, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION;
        `;
        const result = await db.query(sql, params);
        res.json(result);
    } catch (error) {
        res.status(500).send({ mensaje: "Error al obtener la habitación con tipo e imagen." });
    }
};
```

### actualizarHabitacion

**Descripción**: Actualiza los datos de una habitación existente.

**Detalles**:
- Actualiza los datos de la habitación en la base de datos.
- Elimina las imágenes existentes de la habitación y guarda las nuevas imágenes si se proporcionan.
- Devuelve un mensaje de éxito y el ID de la habitación actualizada.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const actualizarHabitacion = async (req, res) => {
    const { id_habitacion } = req.params;
    const { id_tipo_habitacion, descripcion, rentada, precio_noche, caracteristicas, publicacion_activa } = req.body;

    const dataHabitacion = [id_tipo_habitacion, descripcion, rentada, precio_noche, caracteristicas, publicacion_activa, id_habitacion];
    const sqlHabitacion = `
        UPDATE TBL_HABITACIONES 
        SET 
            ID_TIPO_HABITACION = $1, 
            DESCRIPCION = $2, 
            RENTADA = $3, 
            PRECIO_NOCHE = $4, 
            CARACTERISTICAS = $5, 
            PUBLICACION_ACTIVA = $6
        WHERE 
            ID_HABITACION = $7
    `;

    try {
        await db.query(sqlHabitacion, dataHabitacion);

        if (req.files && req.files.length > 0) {
            const sqlDeleteImagenes = `
                DELETE FROM TBL_IMAGENES_HABITACIONES
                WHERE ID_HABITACION = $1
            `;
            await db.query(sqlDeleteImagenes, [id_habitacion]);

            const sqlInsertImagen = `
                INSERT INTO TBL_IMAGENES_HABITACIONES (IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO, ID_HABITACION)
                VALUES ($1, $2, $3, $4)
            `;

            const promises = req.files.slice(0, 5).map(file => {
                const { buffer, originalname, mimetype } = file;
                const dataImagen = [buffer, originalname, mimetype, id_habitacion];
                return db.query(sqlInsertImagen, dataImagen);
            });

            await Promise.all(promises);
        }

        res.status(200).json({
            mensaje: "Habitación actualizada exitosamente.",
            id_habitacion
        });
    } catch (error) {
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};
```

### mostrarComentariosHabitacion

**Descripción**: Muestra los comentarios de una habitación por su ID.

**Detalles**:
- Selecciona los comentarios de la habitación junto con los detalles del usuario que realizó el comentario.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const mostrarComentariosHabitacion = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT A.id_comentario,
            A.id_habitacion,
            A.id_usuario,
            B.nombre_usuario,
            B.imagen_usuario,
            B.nombre_archivo,
            B.extension_archivo,
            A.fecha_comentario,
            A.comentario,
            A.calificacion
        FROM tbl_comentarios_habitacion A
        INNER JOIN tbl_usuarios B
        ON B.id_usuario = A.id_usuario
        WHERE id_habitacion = $1
      `;
        const result = await db.query(query, [id]);

        const data = result.map(row => ({
            ...row,
            imagen_usuario: row.imagen_usuario ? Buffer.from(row.imagen_usuario).toString('base64') : null,
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al mostrar comentarios de la habitación" });
    }
};
```

### guardarComentario

**Descripción**: Guarda un comentario para una habitación.

**Detalles**:
- Inserta el comentario en la base de datos.
- Devuelve un mensaje de éxito.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const guardarComentario = async (req, res) => {
    const id_usuario = req.userid;
    const { id_habitacion, fecha_comentario, comentario, calificacion } = req.body;
    try {
        const query = `
        INSERT INTO TBL_COMENTARIOS_HABITACION (ID_HABITACION, ID_USUARIO, FECHA_COMENTARIO, COMENTARIO, CALIFICACION) VALUES
        ($1, $2, $3, $4, $5);
        `;
        const result = await db.query(query, [id_habitacion, id_usuario, fecha_comentario, comentario, calificacion]);
        res.json('Se agregó su comentario, Gracias por calificar nuestros servicios');
    } catch (error) {
        res.status(500).json({ error: "Error al guardar comentario" });
    }
};
```

## Funciones de Hoteles

### registrarHotel

**Descripción**: Registra un nuevo hotel en la base de datos y guarda la imagen del hotel si se proporciona.

**Detalles**:
- Hashea la contraseña del hotel.
- Inserta los datos del hotel en la tabla `TBL_HOTELES`.
- Guarda la imagen del hotel en la tabla `TBL_IMAGENES_HOTELES` si se proporciona.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const registrarHotel = async (req, res) => {
  const {
    ID_DIRECCION,
    REFERENCIA_LOCAL,
    NOMBRE,
    RTN,
    NO_TELEFONO,
    NO_WHATSAPP,
    CORREO,
    CONTRASENIA,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(15);
    const contraseniaHash = await bcrypt.hash(CONTRASENIA, salt);
    const sql = `
        INSERT INTO TBL_HOTELES
            (ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, CONTRASENIA, AUTENTICADO)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *
        `;
    const values = [
      ID_DIRECCION,
      REFERENCIA_LOCAL,
      NOMBRE,
      RTN,
      NO_TELEFONO,
      NO_WHATSAPP,
      CORREO,
      contraseniaHash,
      false,
    ];
    const result = await db.query(sql, values);
    const id_hotel = result[0].id_hotel;
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      const dataImagen = [id_hotel, buffer, originalname, mimetype];
      const sqlImagen = `INSERT INTO TBL_IMAGENES_HOTELES (ID_HOTEL, IMAGEN_HOTEL, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                               VALUES ($1, $2, $3, $4)`;
      await db.query(sqlImagen, dataImagen);
    }
    res.json({ message: "Hotel e imagen registrados con éxito" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      msg: "Error al registrar el Hotel y la imagen del hotel",
    });
  }
};
```

### borrarHotel

**Descripción**: Borra un hotel de la base de datos.

**Detalles**:
- Llama al procedimiento almacenado `sp_borrar_hotel` para eliminar el hotel.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const borrarHotel = async (req, res) => {
  const { id } = req.params;
  const sql ='DELETE FROM TBL_HOTELES WHERE ID_HOTEL = $1';
  try {
    await db.query(sql, [id]);
    res.json({ message: "Hotel borrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar el hotel" });
  }
};
```

### mostrarHoteles

**Descripción**: Muestra todos los hoteles autenticados junto con sus detalles y la imagen más reciente.

**Detalles**:
- Selecciona los detalles de los hoteles y sus imágenes más recientes.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const mostrarHoteles = async (req, res) => {
  try {
    const query = `
    SELECT
        H.ID_HOTEL, 
        H.ID_DIRECCION AS ID_CIUDAD,
        CONCAT(
            COALESCE(CIU.NOMBRE_CIUDAD, 'N/A'), ', ', 
            COALESCE(MUN.NOMBRE_MUNICIPIO, 'N/A'), ', ', 
            COALESCE(DEP.NOMBRE_DEPTO, 'N/A')
        ) AS DIRECCION_COMPLETA,
        H.REFERENCIA_LOCAL,
        DEP.ID_DEPTO,
        CIU.ID_CIUDAD,
        H.NOMBRE, 
        H.RTN, 
        H.NO_TELEFONO, 
        H.NO_WHATSAPP, 
        H.CORREO,
        LATEST_IMG.ID_IMG_HOTEL,
        encode(LATEST_IMG.IMAGEN_HOTEL, 'base64') AS IMAGEN_HOTEL,
        LATEST_IMG.NOMBRE_ARCHIVO,
        LATEST_IMG.EXTENSION_ARCHIVO,
        COALESCE(HABITACIONES_DISPONIBLES.CANTIDAD_DISPONIBLES, 0) AS CANTIDAD_HABITACIONES_DISPONIBLES
    FROM TBL_HOTELES AS H
    LEFT JOIN TBL_CIUDADES AS CIU ON H.ID_DIRECCION = CIU.ID_CIUDAD
    LEFT JOIN TBL_MUNICIPIOS AS MUN ON MUN.ID_MUNICIPIO = CIU.ID_MUNICIPIO
    LEFT JOIN TBL_DEPARTAMENTOS AS DEP ON DEP.ID_DEPTO = MUN.ID_DEPTO
    LEFT JOIN (
        SELECT
            IH.ID_HOTEL,
            IH.ID_IMG_HOTEL,
            IH.IMAGEN_HOTEL,
            IH.NOMBRE_ARCHIVO,
            IH.EXTENSION_ARCHIVO
        FROM TBL_IMAGENES_HOTELES IH
        INNER JOIN (
            SELECT ID_HOTEL, MAX(ID_IMG_HOTEL) AS MAX_ID_IMG_HOTEL
            FROM TBL_IMAGENES_HOTELES
            GROUP BY ID_HOTEL
        ) AS MAX_IMG ON IH.ID_HOTEL = MAX_IMG.ID_HOTEL AND IH.ID_IMG_HOTEL = MAX_IMG.MAX_ID_IMG_HOTEL
    ) AS LATEST_IMG ON H.ID_HOTEL = LATEST_IMG.ID_HOTEL
    LEFT JOIN (
        SELECT
            ID_HOTEL,
            COUNT(*) AS CANTIDAD_DISPONIBLES
        FROM TBL_HABITACIONES
        WHERE PUBLICACION_ACTIVA = TRUE AND RENTADA = FALSE
        GROUP BY ID_HOTEL
    ) AS HABITACIONES_DISPONIBLES ON H.ID_HOTEL = HABITACIONES_DISPONIBLES.ID_HOTEL
    WHERE H.AUTENTICADO = TRUE;
        `;
    const result = await db.query(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al mostrar hoteles con imágenes" });
  }
};
```

### mostrarHotel

**Descripción**: Muestra los detalles de un hotel específico por ID.

**Detalles**:
- Selecciona los detalles del hotel y su imagen más reciente.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const mostrarHotel = async (req, res) => {
  const hotelId = parseInt(req.params.id);
  try {
    const query = `
    SELECT  
    H.ID_HOTEL, 
    H.ID_DIRECCION AS ID_CIUDAD, 
    CONCAT(
        COALESCE(CIU.NOMBRE_CIUDAD, 'N/A'), ', ', 
        COALESCE(MUN.NOMBRE_MUNICIPIO, 'N/A'), ', ', 
        COALESCE(DEP.NOMBRE_DEPTO, 'N/A')
    ) AS DIRECCION_COMPLETA,
    H.REFERENCIA_LOCAL,
    H.NOMBRE, 
    H.RTN, 
    H.NO_TELEFONO, 
    H.NO_WHATSAPP, 
    H.CORREO,
    DEP.ID_DEPTO,
    LATEST_IMG.ID_IMG_HOTEL,
    encode(LATEST_IMG.IMAGEN_HOTEL, 'base64') AS IMAGEN_HOTEL,
    LATEST_IMG.NOMBRE_ARCHIVO,
    LATEST_IMG.EXTENSION_ARCHIVO,
    COALESCE(HABITACIONES_DISPONIBLES.CANTIDAD_DISPONIBLES, 0) AS CANTIDAD_HABITACIONES_DISPONIBLES
FROM TBL_HOTELES AS H
LEFT JOIN TBL_CIUDADES AS CIU ON H.ID_DIRECCION = CIU.ID_CIUDAD
LEFT JOIN TBL_MUNICIPIOS AS MUN ON MUN.ID_MUNICIPIO = CIU.ID_MUNICIPIO
LEFT JOIN TBL_DEPARTAMENTOS AS DEP ON DEP.ID_DEPTO = MUN.ID_DEPTO
LEFT JOIN (
    SELECT
        IH.ID_HOTEL,
        IH.ID_IMG_HOTEL,
        IH.IMAGEN_HOTEL,
        IH.NOMBRE_ARCHIVO,
        IH.EXTENSION_ARCHIVO
    FROM TBL_IMAGENES_HOTELES IH
    INNER JOIN (
        SELECT ID_HOTEL, MAX(ID_IMG_HOTEL) AS MAX_ID_IMG_HOTEL
        FROM TBL_IMAGENES_HOTELES
        GROUP BY ID_HOTEL
    ) AS MAX_IMG ON IH.ID_HOTEL = MAX_IMG.ID_HOTEL AND IH.ID_IMG_HOTEL = MAX_IMG.MAX_ID_IMG_HOTEL
) AS LATEST_IMG ON H.ID_HOTEL = LATEST_IMG.ID_HOTEL
LEFT JOIN (
    SELECT
        ID_HOTEL,
        COUNT(*) AS CANTIDAD_DISPONIBLES
    FROM TBL_HABITACIONES
    WHERE PUBLICACION_ACTIVA = TRUE AND RENTADA = FALSE
    GROUP BY ID_HOTEL
) AS HABITACIONES_DISPONIBLES ON H.ID_HOTEL = HABITACIONES_DISPONIBLES.ID_HOTEL
WHERE H.ID_HOTEL = $1 AND H.AUTENTICADO = TRUE;
    `;
    const result = await db.query(query, [hotelId]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al mostrar el hotel" });
  }
};
```

### hotelesInactivos

**Descripción**: Obtiene todos los hoteles inactivos (no autenticados).

**Detalles**:
- Selecciona los hoteles donde `AUTENTICADO` es `FALSE`.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const hotelesInactivos = async (req, res) => {
  try {
    const sql = `SELECT * FROM TBL_HOTELES WHERE AUTENTICADO = FALSE`;
    const result = await db.query(sql);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al listar los hoteles" });
  }
};
```

### cambiarEstadoHotel

**Descripción**: Cambia el estado de autenticación de un hotel a `TRUE`.

**Detalles**:
- Actualiza el estado de autenticación del hotel en la tabla `TBL_HOTELES`.
- Envía un correo electrónico de confirmación al hotel.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const cambiarEstadoHotel = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `UPDATE TBL_HOTELES
    SET AUTENTICADO = TRUE
    WHERE ID_HOTEL = $1;
    `;
    await db.query(sql, id);

    const sql2 = ` SELECT id_hotel,
              nombre,
              correo
        FROM tbl_hoteles
        WHERE id_hotel = $1;`;
    const result2 = await db.query(sql2, id);
    
    enviarCorreoConfirmarHotel(result2[0].correo, result2[0].nombre);

    res.json({ message: "Estado de autenticación actualizado" });
  } catch (error) {
    res.status(500).send({ mensaje: "Error al procesar la solicitud." });
  }
};
```

### actualizarContraseniaHotel

**Descripción**: Actualiza la contraseña de un hotel.

**Detalles**:
- Verifica la contraseña actual del hotel.
- Hashea la nueva contraseña y la actualiza en la base de datos.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const actualizarContrasenia = async (req, res) => {
  const params = [
    req.idHotel,
    req.body.correo,
    req.body.contrasenia,
    req.body.nueva_contrasenia,
  ];
  try {
    const sql = "SELECT CONTRASENIA FROM TBL_HOTELES WHERE ID_HOTEL =$1";
    const getPass = await db.query(sql, params[0]);
    const passwordCorrect = await bcrypt.compare(
      params[2],
      getPass[0].contrasenia
    );
    if (!passwordCorrect) {
      res.status(201).json({
        msg: "Contraseña Incorrecta",
      });
      return;
    } else {
      const salt = await bcrypt.genSalt(15);
      const contraseniaHash = await bcrypt.hash(params[3], salt);
      const sql2 =
        "UPDATE TBL_HOTELES SET CONTRASENIA = $2 WHERE ID_HOTEL = $1";
      const values = [params[0], contraseniaHash];
      await db.query(sql2, values);
      res.json({
        msg: "Contraseña actualizada correctamente",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
};
```

### mostrarCalificacionHotel

**Descripción**: Muestra la calificación de un hotel por ID.

**Detalles**:
- Selecciona el conteo y la sumatoria de calificaciones del hotel.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const mostrarCalificacionHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT COUNT(*) AS CANTIDAD,
        SUM(CALIFICACION) AS SUMATORIA
      FROM TBL_CALIFICAR_HOTEL
      WHERE id_hotel = $1
        `;
    const result = await db.query(query, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al mostrar calificación del hotel" });
  }
}
```

### guardarCalificacionHotel

**Descripción**: Guarda la calificación de un hotel.

**Detalles**:
- Inserta la calificación del hotel en la base de datos.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const guardarCalificacionHotel = async (req, res) => {
  const { id_hotel, id_usuario, calificacion } = req.body;
  try {
    const query = `
      INSERT INTO TBL_CALIFICAR_HOTEL (ID_HOTEL, ID_USUARIO, CALIFICACION)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(query, [id_hotel, id_usuario, calificacion]);
    res.json({ message: 'Calificación guardada', data: result });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la calificación" });
  }
}
```

## Funciones de Imágenes

### insertImgHotel

**Descripción**: Inserta una imagen para un hotel en la base de datos.

**Detalles**:
- Recibe los datos de la imagen (buffer, nombre original, tipo MIME) y el ID del hotel.
- Inserta la imagen en la tabla `TBL_IMAGENES_HOTELES`.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const insertImgHotel = async (req, res) => {
    const data = [req.body.id_hotel, req.file.buffer, req.file.originalname, req.file.mimetype];
    const sql = `INSERT INTO TBL_IMAGENES_HOTELES (ID_HOTEL, IMAGEN_HOTEL, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                VALUES ($1, $2, $3, $4)`;
    try {
        const result = await db.query(sql, data);
        res.status(200).json({
            msg: 'Imagen guardada con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};
```

### insertImgHabitacion

**Descripción**: Inserta una imagen para una habitación en la base de datos.

**Detalles**:
- Recibe los datos de la imagen (buffer, nombre original, tipo MIME) y el ID de la habitación.
- Inserta la imagen en la tabla `TBL_IMAGENES_HABITACIONES`.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const insertImgHabitacion = async (req, res) => {
    const data = [req.body.id_habitacion, req.file.buffer, req.file.originalname, req.file.mimetype];
    const sql = `INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                VALUES ($1, $2, $3, $4)`;
    try {
        const result = await db.query(sql, data);
        res.status(200).json({
            msg: 'Imagen guardada con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};
```

### imagenesHotel

**Descripción**: Obtiene las imágenes de un hotel por su ID.

**Detalles**:
- Selecciona las imágenes de la tabla `TBL_IMAGENES_HOTELES` para el hotel con el ID proporcionado.
- Devuelve las imágenes en formato base64 y los detalles en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js 
const imagenesHotel = async (req, res) => {
    const id = req.body.hotel_id;
    try {
        const sql = `SELECT ID_IMG_HOTEL, encode(IMAGEN_HOTEL, 'base64') IMAGEN_HOTEL, 
                    NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_IMAGENES_HOTELES WHERE ID_HOTEL = $1`;
        const result = await db.query(sql, [id]);
        res.status(200).json({
            msg: 'Imágenes obtenidas con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};
```

### imagenesHabitacion

**Descripción**: Obtiene las imágenes de una habitación por su ID.

**Detalles**:
- Selecciona las imágenes de la tabla `TBL_IMAGENES_HABITACIONES` para la habitación con el ID proporcionado.
- Devuelve las imágenes en formato base64 y los detalles en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const imagenesHabitacion = async (req, res) => {
    const id = req.body.hotel_id;
    try {
        const sql = `SELECT ID_IMG_HABITACION, encode(IMAGEN_HABITACION, 'base64') IMAGEN_HABITACION, 
                    NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_IMAGENES_HABITACIONES WHERE ID_HABITACION = $1`;
        const result = await db.query(sql, [id]);
        res.status(200).json({
            msg: 'Imágenes obtenidas con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};
```

### eliminarImgHabitacion

**Descripción**: Elimina una imagen de una habitación por su ID.

**Detalles**:
- Elimina la imagen de la tabla `TBL_IMAGENES_HABITACIONES` para la habitación con el ID proporcionado.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const eliminarImgHabitacion = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('DELETE FROM TBL_IMAGENES_HABITACIONES WHERE ID_HABITACION = $1', [id]);
        res.json({
            message: 'Imagen eliminada con éxito',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
};
```

### eliminarImgHotel

**Descripción**: Elimina una imagen de un hotel por su ID.

**Detalles**:
- Elimina la imagen de la tabla `TBL_IMAGENES_HOTELES` para el hotel con el ID proporcionado.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const eliminarImgHotel = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('DELETE FROM TBL_IMAGENES_HOTELES WHERE ID_HOTEL = $1', [id]);
        res.json({
            message: 'Imagen eliminada con éxito',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
};
```

## Funciones de Localización

### obtenerDepartamentos

**Descripción**: Obtiene todos los departamentos de la base de datos.

**Detalles**:
- Realiza una consulta SQL que selecciona todos los registros de la tabla `TBL_DEPARTAMENTOS`.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const obtenerDepartamentos = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM TBL_DEPARTAMENTOS');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};
```

### municipiosPorDepartamento

**Descripción**: Obtiene los municipios asociados a un departamento específico por su ID.

**Detalles**:
- Realiza una consulta SQL que selecciona todos los municipios de la tabla `TBL_MUNICIPIOS` donde `ID_DEPTO` es igual al ID del departamento proporcionado.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const municipiosPorDepartamento = async (req, res) => {
    const id_departamento = req.params.id;
    const sql = 'SELECT * FROM TBL_MUNICIPIOS WHERE ID_DEPTO = $1';
    try {
        const result = await db.query(sql, [id_departamento]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }
};
```

### obtenerMunicipios

**Descripción**: Obtiene todos los municipios de la base de datos.

**Detalles**:
- Realiza una consulta SQL que selecciona todos los registros de la tabla `TBL_MUNICIPIOS`.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const obtenerMunicipios = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM TBL_MUNICIPIOS');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }
};
```

### ciudadesPorMunicipios

**Descripción**: Obtiene las ciudades asociadas a un municipio específico por su ID.

**Detalles**:
- Realiza una consulta SQL que selecciona todas las ciudades de la tabla `TBL_CIUDADES` donde `ID_MUNICIPIO` es igual al ID del municipio proporcionado.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const ciudadesPorMunicipios = async (req, res) => {
    const id_municipio = req.params.id;
    const sql = 'SELECT * FROM TBL_CIUDADES WHERE ID_MUNICIPIO = $1';
    try {
        const result = await db.query(sql, id_municipio);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar ciudades' });
    }
}
```

### coloniasporCiudad

**Descripción**: Obtiene las colonias asociadas a una ciudad específica por su ID.

**Detalles**:
- Realiza una consulta SQL que selecciona todas las colonias de la tabla `TBL_COLONIAS` donde `ID_CIUDAD` es igual al ID de la ciudad proporcionada.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const coloniasporCiudad = async (req, res) => {
    const id_ciudad = req.params.id;
    const sql = `
        SELECT * FROM TBL_COLONIAS
        WHERE id_ciudad = $1
    `;
    try {
        const result = await db.query(sql, [id_ciudad]);
        res.json([{
            msg: `Colonias de la ciudad con id: ${id_ciudad}`,
            data: result
        }]);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar las colonias' });
    }
}
```

## Funciones de Historial

### obtenerHistorial

**Descripción**: Obtiene el historial de reservaciones de un usuario.

**Detalles**:
- Realiza una consulta SQL que selecciona todas las reservaciones detalladas de la tabla `TBL_RESERVACIONES_DETALLE` para el usuario con el ID proporcionado (`ID_USUARIO`).
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const obtenerHistorial = async (req, res) => {
    const userId = req.userid;
    const sql = 'SELECT * FROM TBL_RESERVACIONES_DETALLE WHERE ID_USUARIO = $1';
    try {
        const result = await db.query(sql, [userId]);
        if (result.length > 0) {
            res.json({
                data: result
            });
        } else {
            res.json({
                data: 'Usted no ha realizada ninguna reservación aún'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar la consulta' });
    }
}
```

## Funciones de Estadísticas

### habitaciones_rentadaXnorentada

**Descripción**: Obtiene la cantidad de habitaciones rentadas y no rentadas.

**Detalles**:
- Realiza una consulta SQL que cuenta las habitaciones rentadas y no rentadas.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const habitaciones_rentadaXnorentada = async (req, res) => {
    try {
        const query = `
            SELECT
                COUNT(*) FILTER (WHERE rentada = TRUE) AS habitaciones_rentadas,
                COUNT(*) FILTER (WHERE rentada = FALSE) AS habitaciones_no_rentadas
            FROM
                tbl_habitaciones;
        `;
        const result = await db.query(query);
        const data = result;
        const { habitaciones_rentadas, habitaciones_no_rentadas } = data[0];
        res.json({ habitaciones_rentadas, habitaciones_no_rentadas });
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};
```
### usuarios_registradosXcategoria

**Descripción**: Obtiene la cantidad de usuarios registrados por categoría (administradores, usuarios, hoteles).

**Detalles**:
- Realiza una consulta SQL que cuenta los usuarios por cada categoría.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const usuarios_registradosXcategoria = async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM TBL_USUARIOS WHERE id_rol = 1) AS administradores,
                (SELECT COUNT(*) FROM TBL_USUARIOS WHERE id_rol = 2) AS usuarios,
                (SELECT COUNT(*) FROM tbl_hoteles) AS hoteles;
        `;
        const result = await db.query(query);
        const data = result;
        const { administradores, usuarios, hoteles } = data[0];
        res.json({ administradores, usuarios, hoteles });
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};
```

### hotelesMasValorados

**Descripción**: Obtiene la cantidad de hoteles por cada calificación promedio.

**Detalles**:
- Realiza una consulta SQL que agrupa los hoteles por su calificación promedio.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

```js
const hotelesMasValorados = async (_req, res) => {
    try {
        const query = `
            WITH HotelRatings AS (
                SELECT 
                    A.ID_HOTEL,
                    A.NOMBRE,
                    ROUND(AVG(B.CALIFICACION)) AS CALIFICACION_PROMEDIO,
                    COUNT(B.ID_CALIFICACION_HOTEL) AS NUMERO_COMENTARIOS
                FROM 
                    TBL_HOTELES A
                LEFT JOIN 
                    TBL_CALIFICAR_HOTEL B ON A.ID_HOTEL = B.ID_HOTEL
                GROUP BY 
                    A.ID_HOTEL, A.NOMBRE
            )
            SELECT 
                CALIFICACION_PROMEDIO,
                COUNT(*) AS NUMERO_DE_HOTELES
            FROM 
                HotelRatings
            GROUP BY 
                CALIFICACION_PROMEDIO
            ORDER BY 
                CALIFICACION_PROMEDIO;
        `;
        const result = await db.query(query);
        const data = result;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};
```
