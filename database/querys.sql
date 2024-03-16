-- Active: 1709789023717@@127.0.0.1@5432@descanso_nomada
-- Tabla de Departamentos
SELECT * FROM TBL_DEPARTAMENTOS;

-- Tabla de Municipios
SELECT * FROM TBL_MUNICIPIOS;

-- Tabla de Ciudades
SELECT * FROM TBL_CIUDADES;

-- Tabla de Colonias
SELECT * FROM TBL_COLONIAS;

-- Tabla de Hoteles
SELECT * FROM TBL_HOTELES;

-- Tabla de Roles
SELECT * FROM TBL_ROL;

-- Tabla de Usuarios
SELECT * FROM TBL_USUARIOS;

-- Tabla de Tipos de Habitación
SELECT * FROM TBL_TIPOS_HABITACION;

-- Tabla de Habitaciones
SELECT * FROM TBL_HABITACIONES;

-- Tabla de Reservaciones
SELECT * FROM TBL_RESERVACIONES;

-- Tabla de Comentarios de Habitaciones
SELECT * FROM TBL_COMENTARIOS_HABITACION;

-- Tabla de Imágenes de Habitaciones
SELECT * FROM TBL_IMAGENES_HABITACIONES;

-- Tabla de Imágenes de Hoteles
SELECT * FROM TBL_IMAGENES_HOTELES;

-- Tabla de Favoritos
SELECT * FROM TBL_FAVORITOS;

-- Tabla de Redes Sociales
SELECT * FROM TBL_REDES_SOCIALES;

-- Tabla de Enlaces de Redes Sociales
SELECT * FROM TBL_ENLACES_REDES_SOCIALES;

DELETE FROM TBL_HOTELES WHERE id_hotel=3

CALL sp_borrar_hotel(4);

CALL sp_mostrar_hoteles()


SELECT ID_USUARIO, NOMBRE_USUARIO, DNI, CORREO, TELEFONO FROM TBL_USUARIOS WHERE ID_ROL = 2

SELECT ID_ROL, CORREO, NOMBRE_USUARIO, TELEFONO FROM TBL_USUARIOS WHERE ID_USUARIO = 13