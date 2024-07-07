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

### validarCookieCombinado

**Descripción**: Middleware para validar el token tanto de usuario como de hotel.

**Detalles**:
- **Verificación del token**:
  - Usa `jwt.verify` para verificar el token en las cookies del request.
  - Si el token es válido, se añade `user` o `hotel` al request según corresponda y se llama a `next()`.
  - Si no se proporciona un token, responde con un estado 403 y un mensaje de error.
  - Si el token ha expirado, responde con un estado 401 y un mensaje de error.
  - Si el token es inválido, responde con un estado 403 y un mensaje de error.

### validateResult

**Descripción**: Middleware para validar los resultados de las validaciones de express-validator.

**Detalles**:
- **Validación de resultados**:
  - Usa `validationResult` de `express-validator` para obtener los errores de validación de la solicitud.
  - Si hay errores, responde con un estado 400 y un JSON que contiene solo el primer error de cada campo.
  - Si no hay errores, llama a `next()` para pasar al siguiente middleware o controlador.
