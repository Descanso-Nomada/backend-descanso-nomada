# Documentación de la Base de Datos y Librerías Utilizadas

## Índice

1. [Librerías Utilizadas](#librerías-utilizadas)
2. [Conexión a la Base de Datos](#conexión-a-la-base-de-datos)
3. [Esquema de la Base de Datos](#esquema-de-la-base-de-datos)
    - [Tablas](#tablas)
    - [Procedimientos y Funciones](#procedimientos-y-funciones)
    - [Triggers](#triggers)

## Librerías Utilizadas

### `pg-promise`

- **Descripción**: `pg-promise` es una librería de Node.js que proporciona una interfaz de promesa para la interacción con bases de datos PostgreSQL.
- **Uso**: Se utiliza para configurar y manejar la conexión con la base de datos PostgreSQL.

### `dotenv`

- **Descripción**: `dotenv` es una librería de Node.js que carga variables de entorno desde un archivo `.env` a `process.env`.
- **Uso**: Se utiliza para cargar las credenciales de la base de datos y otras configuraciones sensibles desde un archivo `.env`.

## Conexión a la Base de Datos

La conexión a la base de datos se realiza utilizando `pg-promise` y `dotenv` para gestionar las credenciales de manera segura.

## Esquema de la Base de Datos

### Tablas

1. **TBL_DEPARTAMENTOS**: Almacena los departamentos.
2. **TBL_MUNICIPIOS**: Almacena los municipios.
3. **TBL_CIUDADES**: Almacena las ciudades.
4. **TBL_COLONIAS**: Almacena las colonias.
5. **TBL_HOTELES**: Almacena los hoteles.
6. **TBL_ROL**: Almacena los roles de usuario.
7. **TBL_USUARIOS**: Almacena los usuarios.
8. **TBL_TIPOS_HABITACION**: Almacena los tipos de habitación.
9. **TBL_HABITACIONES**: Almacena las habitaciones.
10. **TBL_RESERVACIONES**: Almacena las reservaciones.
11. **TBL_COMENTARIOS_HABITACION**: Almacena los comentarios de las habitaciones.
12. **TBL_IMAGENES_HABITACIONES**: Almacena las imágenes de las habitaciones.
13. **TBL_IMAGENES_HOTELES**: Almacena las imágenes de los hoteles.
14. **TBL_FAVORITOS**: Almacena los favoritos de los usuarios.
15. **TBL_REDES_SOCIALES**: Almacena las redes sociales.
16. **TBL_ENLACES_REDES_SOCIALES**: Almacena los enlaces a redes sociales de los hoteles.
17. **TBL_RESERVACIONES_DETALLE**: Almacena el historial de las reservaciones de los usuarios.
18. **TBL_CALIFICAR_HOTEL**: Almacena las calificaciones de los hoteles.
19. **TBL_HISTORIAL_RESERVACIONES**: Almacena el historial de reservaciones de los usuarios.

### Procedimientos y Funciones

1. **cambiarEstadoHotel**: Cambia el estado de autenticación de un hotel.
2. **registrar_habitacion**: Registra una nueva habitación en la base de datos.
3. **sp_registrar_usuario**: Procedimiento almacenado para registrar un nuevo usuario.
4. **sp_registrar_hotel**: Procedimiento almacenado para registrar un nuevo hotel.
5. **sp_borrar_hotel**: Procedimiento almacenado para borrar un hotel existente.
6. **fn_insert_reservacion_detalle**: Función que inserta detalles de una reservación.

### Triggers

1. **trg_insert_reservacion_detalle**: Trigger que se ejecuta después de insertar una nueva reservación, llamando a la función `fn_insert_reservacion_detalle`.
