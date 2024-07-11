# Documentación de Helpers y Middlewares

## Índice

1. [Librerías Utilizadas](#librerías-utilizadas)
2. [Helpers](#helpers)
    - [enviarCodigo](#enviarcodigo)
    - [enviarCorreoReservación](#enviarcorreoreservación)
    - [enviarCorreoConfirmarHotel](#enviarcorreoconfirmarhotel)
    - [enviarFactura](#enviarfactura)
3. [Middlewares](#middlewares)
    - [validarCookie](#validarcookie)
    - [validarCookieHotel](#validarcookiehotel)
    - [validarCookieCombinado](#validarcookiecombinado)
    - [validateResult](#validateresult)

## Librerías Utilizadas

### `nodemailer`

- **Descripción**: `nodemailer` es una librería de Node.js que permite enviar correos electrónicos utilizando servicios SMTP.
- **Uso**: Configuración del servicio de correo electrónico y envío de correos en las funciones de helpers.

### `dotenv`

- **Descripción**: `dotenv` es una librería de Node.js que carga variables de entorno desde un archivo `.env` a `process.env`.
- **Uso**: Cargar credenciales de correo electrónico y otras configuraciones sensibles desde un archivo `.env`.

### `jsonwebtoken`

- **Descripción**: `jsonwebtoken` es una librería que permite crear, firmar y verificar tokens JWT (JSON Web Tokens).
- **Uso**: Verificación de tokens JWT en los middlewares para autenticación de usuarios y hoteles.

### `express-validator`

- **Descripción**: `express-validator` es un conjunto de middlewares para validación de datos en aplicaciones Express.
- **Uso**: Validación de datos en las solicitudes HTTP y manejo de errores de validación.

## Helpers

### enviarCodigo

**Descripción**: Envía un código de seguridad al correo del usuario.

**Detalles**:
- **Configuración del transportador de Nodemailer**:
  - Utiliza `nodemailer.createTransport` para configurar el servicio de correo electrónico con SMTP de Gmail.
  - Usa las credenciales almacenadas en las variables de entorno (`process.env.SEND_MAIL` y `process.env.KEY_MAIL`).

- **Envío del correo**:
  - La función `main` envía el correo electrónico utilizando `transporter.sendMail`.
  - El correo incluye el asunto personalizado con el nombre del usuario y un cuerpo HTML con el código de seguridad.
  - Si ocurre un error, se captura y se imprime en la consola.

```js
  function enviarCodigo (correo,usuario,codigo) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo,
        subject: `Hola ${usuario}`,
        text: "Código de seguridad!",
        html: `
        <div style=
        "background-color: rgb(113 223 239 / 37%);
        padding: 15px;
        border-radius: 5px;
        ">
        <h2 style="
            text-align: center;
            font-family: system-ui;
            color: white;
            text-shadow: 1px 2px 5px black;
            background-color: rgba(0, 140, 255, 0.795);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 1px 4px 8px 0px #00000070;
            ">Código de seguridad
        </h2>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Hola ${usuario}, este es tu código de seguridad, no es necesario que lo guardes, copia y pégalo en la ventana de confirmación para recuperar tu cuenta.</p>
        <h3 style="text-align: center;"><strong style="
            background-color: rgba(238, 150, 87, 0.685);
            padding: 10px;
            font-family: system-ui;
            ">${codigo}
            </strong>
        </h3>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Gracias por usar nuestros servicios, <strong>DESCANSO NÓMADA 2024</strong>
        </p>
    </div>
    `,
    });
    }
    main().catch(console.error);

  ```

### enviarCorreoReservación

**Descripción**: Envía un correo de confirmación de reservación al usuario.

**Detalles**:
- **Configuración del transportador de Nodemailer**:
  - Utiliza `nodemailer.createTransport` para configurar el servicio de correo electrónico con SMTP de Gmail.
  - Usa las credenciales almacenadas en las variables de entorno (`process.env.SEND_MAIL` y `process.env.KEY_MAIL`).

- **Envío del correo**:
  - La función `main` envía el correo electrónico utilizando `transporter.sendMail`.
  - El correo incluye el asunto personalizado con el nombre del usuario y un cuerpo HTML con los detalles de la reservación y el hotel.
  - Si ocurre un error, se captura y se imprime en la consola.

```js
  function enviarCorreoReservación (correo,usuario, hotel, objetoHabitación) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo, 
        subject: `Hola ${usuario}`, 
        text: "Reservación Aceptada!", 
        html: `
        <div style=
        "background-color: rgb(113 223 239 / 37%);
        padding: 15px;
        border-radius: 5px;
        ">
        <h2 style="
            text-align: center;
            font-family: system-ui;
            color: white;
            text-shadow: 1px 2px 5px black;
            background-color: rgba(0, 140, 255, 0.795);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 1px 4px 8px 0px #00000070;
            ">Reservación aceptada
        </h2>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Hola ${usuario}, se informa que el hotel {Aquí debe de ir el nombre del hotel} a realizado la reserva de su habitación</p>
        <h3 style="text-align: center;"><strong style="
            padding: 10px;
            font-family: system-ui;
            ">Aquí deben de ir los detalles de la habitación....
            </strong>
        </h3>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Gracias por usar nuestros servicios, <strong>DESCANSO NÓMADA 2024</strong>
        </p>
    </div>
    `,
    });
    }
    main().catch(console.error);
}
```

### enviarCorreoConfirmarHotel

**Descripción**: Envía un correo de confirmación de registro a un hotel.

**Detalles**:
- **Configuración del transportador de Nodemailer**:
  - Utiliza `nodemailer.createTransport` para configurar el servicio de correo electrónico con SMTP de Gmail.
  - Usa las credenciales almacenadas en las variables de entorno (`process.env.SEND_MAIL` y `process.env.KEY_MAIL`).

- **Envío del correo**:
  - La función `main` envía el correo electrónico utilizando `transporter.sendMail`.
  - El correo incluye el asunto personalizado con el nombre del hotel y un cuerpo HTML con un mensaje de bienvenida y confirmación de registro.
  - Si ocurre un error, se captura y se imprime en la consola.

```js
function enviarCorreoConfirmarHotel (correo, usuario) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo, 
        subject: `Hola ${usuario}`, 
        text: "Solicitud Aceptada!", 
        html: `
        <div style=
        "background-color: rgb(113 223 239 / 37%);
        padding: 15px;
        border-radius: 5px;
        ">
        <h2 style="
            text-align: center;
            font-family: system-ui;
            color: white;
            text-shadow: 1px 2px 5px black;
            background-color: rgba(0, 140, 255, 0.795);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 1px 4px 8px 0px #00000070;
            ">Cuenta registrada con éxito
        </h2>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Hola ${usuario}, se informa que la cuenta fue creada, ya puede ingresar a nuestra plataforma y compartir información.</p>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Gracias por usar nuestros servicios, <strong>DESCANSO NÓMADA 2024</strong>
        </p>
    </div>
    `,
    });
    }
    main().catch(console.error);
}
  
```
### enviarFactura

**Descripción**: Envía una factura al correo del usuario.

**Detalles**:
- **Obtención de la fecha y hora actual**:
  - La función obtiene la fecha y hora actual y las formatea en un formato legible (`dd-mm-yyyy` para la fecha y `hh:mm:ss` para la hora).

- **Cálculo del ISV (Impuesto sobre Ventas)**:
  - Calcula el ISV como el 15% del total de la factura.

- **Configuración del transportador de Nodemailer**:
  - Utiliza `nodemailer.createTransport` para configurar el servicio de correo electrónico con SMTP de Gmail.
  - Usa las credenciales almacenadas en las variables de entorno (`process.env.SEND_MAIL` y `process.env.KEY_MAIL`).

- **Envío del correo**:
  - La función `main` envía el correo electrónico utilizando `transporter.sendMail`.
  - El correo incluye el asunto personalizado con el nombre del usuario y un cuerpo HTML con los detalles de la factura, como tipo de habitación, descripción, precio, cantidad de noches, subtotal, ISV, y el total.
  - Si ocurre un error, se captura y se imprime en la consola.

```js
function enviarFactura(correo, usuario, tipo_habitacion, descripcion, precio, cantidad, total) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    let isv = total*(15/100);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo, 
        subject: `Hola ${usuario}`, 
        text: "Factura", 
        html: `
        <div style="
            font-family: system-ui;
            padding: 20px;
            max-width: 600px;
            margin: auto;
            background-color: #f7f7f7;
            border-radius: 10px;">
            <h2 style="
                text-align: center;
                color: white;
                background-color: rgba(0, 140, 255, 0.795);
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 20px;">
                Detalle de la factura
            </h2>
            <p style="font-size: 15px; color: #333; margin-bottom: 20px;">
                Hola ${usuario}, a continuación se muestra el detalle de tu factura:
            </p>
            <h3 style="
                background-color: #c0caca;
                color: black;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;">
                Fecha: ${formattedDate} Hora: ${formattedTime}
            </h3>
            <div style="
                border-radius: 5px;
                background-color: #eeeeee;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>Habitación:</strong>
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        ${tipo_habitacion}
                    </p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>Precio:</strong>
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        L. ${precio}
                    </p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>Descripción:</strong> 
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        ${descripcion}
                    </p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>No. Noches:</strong> 
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        ${cantidad}
                    </p>
                </div>
                <div style="padding: 15px; border-top: 2px solid #ddd; margin-top: 20px;">
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 15px; color: #333; margin: 0;">
                            <strong>Subtotal:</strong>
                        </p>
                        <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                            L. ${total}
                        </p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 15px; color: #333; margin: 0;">
                            <strong>ISV (15%):</strong>
                        </p>
                        <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                            L. ${isv}
                        </p>
                    </div>
                    <hr style="color:#ddd"></hr>
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 15px; color: #333; margin: 0;">
                            <strong>Total:</strong>
                        </p>
                        <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                            L. ${total + isv}
                        </p>
                    </div>
                </div>
            </div>
            <p style="font-size: 15px; color: #333; text-align: center;">
                Gracias por usar nuestros servicios
            </p>
            <p style="font-size: 15px; color: #333; text-align: center;">
                <strong>DESCANSO NÓMADA 2024</strong>
            </p>
        </div>
    `,
    });
    }
    main().catch(console.error);
}
```

## Middlewares

### validarCookie

**Descripción**: Middleware para validar el token del usuario.

**Detalles**:
- **Verificación del token**:
  - Usa `jwt.verify` para verificar el token en las cookies del request.
  - Si el token es válido, se añade `userid` al request y se llama a `next()`.
  - Si el token ha expirado, responde con un estado 401 y un mensaje de error.
  - Si el token es inválido, responde con un estado 403 y un mensaje de error.

### validarCookieHotel

**Descripción**: Middleware para validar el token del hotel.

**Detalles**:
- **Verificación del token**:
  - Usa `jwt.verify` para verificar el token en las cookies del request.
  - Si el token es válido, se añade `idHotel` al request y se llama a `next()`.
  - Si el token ha expirado, responde con un estado 401 y un mensaje de error.
  - Si el token es inválido, responde con un estado 403 y un mensaje de error.
  
```js
const validarCookie = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  };
  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.userid = payload.userid;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired', carga: info.payload });
    } else {
      res.status(403).json({ message: 'Invalid token', carga: info.payload });
    }
  }
};
```

### validarCookieCombinado

**Descripción**: Middleware para validar el token tanto de usuario como de hotel.

**Detalles**:
- **Verificación del token**:
  - Usa `jwt.verify` para verificar el token en las cookies del request.
  - Si el token es válido, se añade `user` o `hotel` al request según corresponda y se llama a `next()`.
  - Si no se proporciona un token, responde con un estado 403 y un mensaje de error.
  - Si el token ha expirado, responde con un estado 401 y un mensaje de error.
  - Si el token es inválido, responde con un estado 403 y un mensaje de error.

```js
const validarCookieCombinado = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, 'secret');
    if (payload.userid) {
      req.user = payload;
    } else if (payload.idHotel) {
      req.hotel = payload;
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
};
```

### validateResult

**Descripción**: Middleware para validar los resultados de las validaciones de express-validator.

**Detalles**:
- **Validación de resultados**:
  - Usa `validationResult` de `express-validator` para obtener los errores de validación de la solicitud.
  - Si hay errores, responde con un estado 400 y un JSON que contiene solo el primer error de cada campo.
  - Si no hay errores, llama a `next()` para pasar al siguiente middleware o controlador.

```js
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array({ onlyFirstError: true })
        });
    }
    next();
};
```
