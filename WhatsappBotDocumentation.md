# Documentación del Servicio de WhatsApp

## Índice

1. [Librerías Utilizadas](#librerías-utilizadas)
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

## Librerías Utilizadas

### `venom-bot`

- **Descripción**: `venom-bot` es una librería para interactuar con la API de WhatsApp Web.
- **Uso**: Se utiliza para crear una instancia del cliente de WhatsApp, enviar y recibir mensajes, y manejar llamadas entrantes.

### `pg-promise`

- **Descripción**: `pg-promise` es una librería de Node.js que proporciona una interfaz de promesa para la interacción con bases de datos PostgreSQL.
- **Uso**: Se utiliza para configurar y manejar la conexión con la base de datos PostgreSQL.

## Funciones Principales

### manejarMensaje

- **Descripción**: Función principal para manejar mensajes entrantes. Almacena los mensajes en un objeto `mensajesPendientes` y los procesa después de un tiempo.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `message`: El mensaje recibido.
- **Funcionamiento**: 
  - Almacena el mensaje en `mensajesPendientes`.
  - Procesa el mensaje después de 1 segundo, verificando si el usuario está registrado y enviando una respuesta inicial.

### formatearFecha

- **Descripción**: Formatea una fecha en un formato legible en español.
- **Parámetros**:
  - `fecha`: La fecha a formatear.
- **Funcionamiento**: Devuelve la fecha formateada en un formato legible.

### procesarMensaje

- **Descripción**: Procesa el mensaje del usuario y envía la respuesta correspondiente.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `message`: El mensaje recibido.
  - `usuario`: Información del usuario.
- **Funcionamiento**: 
  - Envía un saludo inicial si el mensaje es un saludo.
  - Maneja las opciones del menú si el usuario está registrado.

### esMensajeInicial

- **Descripción**: Verifica si el mensaje es un saludo inicial.
- **Parámetros**:
  - `mensaje`: El mensaje recibido.
- **Funcionamiento**: Devuelve `true` si el mensaje es un saludo inicial.

### saludarUsuario

- **Descripción**: Envía un saludo al usuario.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `numeroUsuario`: El número de teléfono del usuario.
  - `usuario`: Información del usuario.
- **Funcionamiento**: Envía un mensaje de saludo al usuario.

### manejarOpcionesMenu

- **Descripción**: Maneja las opciones del menú enviadas por el usuario.
- **Parámetros**:
  - `client`: El cliente de WhatsApp.
  - `mensaje`: El mensaje recibido.
  - `usuario`: Información del usuario.
  - `numeroUsuario`: El número de teléfono del usuario.
- **Funcionamiento**: Envía una respuesta basada en la opción seleccionada por el usuario.

### obtenerInfoUsuario

- **Descripción**: Obtiene la información del usuario desde la base de datos.
- **Parámetros**:
  - `numeroUsuario`: El número de teléfono del usuario.
- **Funcionamiento**: Devuelve la información del usuario si está registrado.

### obtenerHistorialReservaciones

- **Descripción**: Obtiene el historial de reservaciones del usuario.
- **Parámetros**:
  - `idUsuario`: El ID del usuario.
- **Funcionamiento**: Devuelve el historial de reservaciones del usuario.

### obtenerUltimaReservacion

- **Descripción**: Obtiene la última reservación del usuario.
- **Parámetros**:
  - `idUsuario`: El ID del usuario.
- **Funcionamiento**: Devuelve la última reservación del usuario.

## Configuración del Cliente de WhatsApp

### startClient

- **Descripción**: Función para iniciar el cliente de WhatsApp utilizando `venom-bot`.
- **Funcionamiento**:
  - Crea una instancia del cliente de WhatsApp.
  - Muestra el código QR en la consola para escanearlo.
  - Maneja el estado de la sesión.
  - Configura el cliente para manejar mensajes y llamadas entrantes.

### sendMessage

- **Descripción**: Función para enviar mensajes a través del cliente de WhatsApp.
- **Parámetros**:
  - `numero`: El número de teléfono del destinatario.
  - `mensaje`: El mensaje a enviar.
- **Funcionamiento**: 
  - Formatea el número de teléfono.
  - Envía el mensaje utilizando el cliente de WhatsApp.
  - Maneja errores si el cliente no está inicializado o si ocurre un error al enviar el mensaje.

## Ejemplo de Uso

```javascript
import { startClient, sendMessage } from './whatsappService';

// Iniciar el cliente de WhatsApp
startClient();

// Enviar un mensaje
sendMessage('1234567890', 'Hola, este es un mensaje de prueba.');
