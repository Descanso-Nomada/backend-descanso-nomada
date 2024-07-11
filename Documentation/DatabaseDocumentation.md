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

```js
import pg from 'pg-promise';
const pgp =pg();
```

### `dotenv`

- **Descripción**: `dotenv` es una librería de Node.js que carga variables de entorno desde un archivo `.env` a `process.env`.
- **Uso**: Se utiliza para cargar las credenciales de la base de datos y otras configuraciones sensibles desde un archivo `.env`.

```js
import dotenv from 'dotenv';
dotenv.config();
```

## Conexión a la Base de Datos

La conexión a la base de datos se realiza utilizando `pg-promise` y `dotenv` para gestionar las credenciales de manera segura.

Definicion de constantes utilizadas para almacenar los datos de la base de datos extraida desde el archivo .env

```js
const user = process.env.DB_USER;
const pass =  process.env.DB_PASSWORD;
const host =  process.env.DB_HOST;
const database =  process.env.DB_DATABASE;
const encodedPassword = encodeURIComponent(pass);
const conectionString = `postgres://${user}:${encodedPassword}@${host}:5432/${database}`
```

Creacion de la constante db la cual es utilizada para la conexion a la base de datos
```js
const db = pgp(conectionString);
db.connect()
    .then( ()=>{
        console.log("Conexion Exitosa");
    })
    .catch( (err)=>{
        console.log(`Error de Conexión ${err}`);
    })

```



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
```sql
CREATE OR REPLACE FUNCTION cambiarEstadoHotel(p_id INT)
RETURNS TABLE (ID_HOTEL INT, AUTENTICADO BOOLEAN) AS
$$
BEGIN
    UPDATE TBL_HOTELES
    SET AUTENTICADO = NOT AUTENTICADO
    WHERE ID_HOTEL = p_id; -- Usa el prefijo para evitar ambigüedad
    RETURN QUERY SELECT ID_HOTEL, AUTENTICADO FROM TBL_HOTELES WHERE ID_HOTEL = p_id; -- Usa el prefijo aquí también
END;
$$ LANGUAGE plpgsql;
```

2. **registrar_habitacion**: Registra una nueva habitación en la base de datos.
```sql
CREATE OR REPLACE FUNCTION cambiarEstadoHotel(p_id INT)
RETURNS TABLE (ID_HOTEL INT, AUTENTICADO BOOLEAN) AS
$$
BEGIN
    UPDATE TBL_HOTELES
    SET AUTENTICADO = NOT AUTENTICADO
    WHERE ID_HOTEL = p_id; -- Usa el prefijo para evitar ambigüedad
    RETURN QUERY SELECT ID_HOTEL, AUTENTICADO FROM TBL_HOTELES WHERE ID_HOTEL = p_id; -- Usa el prefijo aquí también
END;
$$ LANGUAGE plpgsql;
```

3. **sp_registrar_usuario**: Procedimiento almacenado para registrar un nuevo usuario.
```sql
CREATE OR REPLACE PROCEDURE sp_registrar_usuario(
    nombre_usuario_param VARCHAR(255),
    id_rol_param INT,
    dni_param VARCHAR(255),
    correo_param VARCHAR(255),
    telefono_param VARCHAR(255),
    fecha_nacimiento_param DATE,
    contrasenia_param VARCHAR(255)
)
AS $$
BEGIN
    INSERT INTO tbl_usuarios (nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contrasenia)
    VALUES (nombre_usuario_param, id_rol_param, dni_param, correo_param, telefono_param, fecha_nacimiento_param, contrasenia_param);
END;
$$ LANGUAGE plpgsql;CREATE OR REPLACE PROCEDURE sp_registrar_usuario(
    nombre_usuario_param VARCHAR(255),
    id_rol_param INT,
    dni_param VARCHAR(255),
    correo_param VARCHAR(255),
    telefono_param VARCHAR(255),
    fecha_nacimiento_param DATE,
    contrasenia_param VARCHAR(255),
    imagen_usuario_param BYTEA,
    nombre_archivo_param VARCHAR(250),
    extension_archivo_param VARCHAR(20)
)
AS $$
BEGIN
    INSERT INTO tbl_usuarios (nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contrasenia, imagen_usuario, nombre_archivo, extension_archivo)
    VALUES (nombre_usuario_param, id_rol_param, dni_param, correo_param, telefono_param, fecha_nacimiento_param, contrasenia_param, imagen_usuario_param, nombre_archivo_param, extension_archivo_param);
END;
$$ LANGUAGE plpgsql;
```

4. **sp_registrar_hotel**: Procedimiento almacenado para registrar un nuevo hotel.
```sql
CREATE OR REPLACE PROCEDURE sp_registrar_hotel(
    ID_DIRECCION_param INTEGER,
    REFERENCIA_LOCAL_param VARCHAR(100),
    NOMBRE_param VARCHAR(100),
    RTN_param VARCHAR(100),
    NO_TELEFONO_param INTEGER,
    NO_WHATSAPP_param INTEGER,
    CORREO_param VARCHAR(100),
    CONTRASENIA_param VARCHAR(100)
)
AS $$
BEGIN
    INSERT INTO tbl_hoteles (ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP , CORREO, CONTRASENIA, AUTENTICADO)
    VALUES (ID_DIRECCION_param, REFERENCIA_LOCAL_param, NOMBRE_param, RTN_param, NO_TELEFONO_param, NO_WHATSAPP_param, CORREO_param, CONTRASENIA_param, false);
END;
$$ LANGUAGE plpgsql;
```

5. **sp_borrar_hotel**: Procedimiento almacenado para borrar un hotel existente.
```sql
CREATE OR REPLACE PROCEDURE sp_borrar_hotel(ID_HOTEL_param INTEGER)
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM tbl_hoteles WHERE ID_HOTEL = ID_HOTEL_param) THEN
        DELETE FROM tbl_hoteles WHERE ID_HOTEL = ID_HOTEL_param;
        RAISE NOTICE 'Hotel borrado exitosamente';
    ELSE
        RAISE EXCEPTION 'El hotel con ID % no existe', ID_HOTEL_param;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

6. **fn_insert_reservacion_detalle**: Función que inserta detalles de una reservación.
```sql
REATE OR REPLACE FUNCTION fn_insert_reservacion_detalle() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO TBL_RESERVACIONES_DETALLE (
        ID_RESERVACION, 
				ID_HABITACION, 
				ID_USUARIO, 
				CANT_NOCHES, 
				ESTADO, 
				TOTAL, 
				FECHA_ENTRADA, 
				FECHA_SALIDA,
        ID_HOTEL, 
				PUBLICACION_ACTIVA, 
				ID_TIPO_HABITACION, 
				NOMBRE_TIPO, 
				CAPACIDAD, 
				DESCRIPCION, 
				RENTADA, 
				CARACTERISTICAS, 			 
				PRECIO_NOCHE,
        REFERENCIA_LOCAL, 
				NOMBRE, 
				RTN, 
				NO_TELEFONO, 
				NO_WHATSAPP, 
				CORREO, 
				AUTENTICADO
    )
    SELECT
        NEW.ID_RESERVACION, 
				NEW.ID_HABITACION, 
				NEW.ID_USUARIO, 
				NEW.CANT_NOCHES, 
				NEW.ESTADO, 
				NEW.TOTAL, 
				NEW.FECHA_ENTRADA, 
				NEW.FECHA_SALIDA,
        h.ID_HOTEL, 
				h.PUBLICACION_ACTIVA, 
				h.ID_TIPO_HABITACION, 
				th.nombre_tipo, 
				h.CAPACIDAD, 
				h.DESCRIPCION, 
				h.RENTADA, 
				h.CARACTERISTICAS, 
				h.PRECIO_NOCHE,
        ht.REFERENCIA_LOCAL, 
				ht.NOMBRE, ht.RTN, 
				ht.NO_TELEFONO, 
				ht.NO_WHATSAPP, 
				ht.CORREO, 
				ht.AUTENTICADO
    FROM TBL_HABITACIONES h
    JOIN TBL_HOTELES ht ON h.ID_HOTEL = ht.ID_HOTEL
		JOIN TBL_TIPOS_HABITACION th ON h.id_tipo_habitacion = th.id_tipo_habitacion
    WHERE h.ID_HABITACION = NEW.ID_HABITACION;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Triggers

1. **trg_insert_reservacion_detalle**: Trigger que se ejecuta después de insertar una nueva reservación, llamando a la función `fn_insert_reservacion_detalle`.

```sql
CREATE TRIGGER trg_insert_reservacion_detalle
AFTER INSERT ON TBL_RESERVACIONES
FOR EACH ROW
EXECUTE FUNCTION fn_insert_reservacion_detalle();
```
