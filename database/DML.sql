-- Active: 1709789023717@@127.0.0.1@5432@descanso_nomada@public
-- Insertar datos en la tabla de roles
INSERT INTO TBL_ROL (ROL) VALUES
('ADMIN'),
('CLIENTE');

-- Insertar datos en la tabla de departamentos
INSERT INTO TBL_DEPARTAMENTOS (NOMBRE_DEPTO) VALUES
('Atlántida'),
('Colón'),
('Comayagua'),
('Copán'),
('Cortés'),
('Choluteca'),
('El Paraíso'),
('Francisco Morazán'),
('Gracias a Dios'),
('Intibucá'),
('Islas de la Bahía'),
('La Paz'),
('Lempira'),
('Ocotepeque'),
('Olancho'),
('Santa Bárbara'),
('Valle'),
('Yoro');

-- Insertar datos en la tabla de municipios
INSERT INTO TBL_MUNICIPIOS (ID_DEPTO, NOMBRE_MUNICIPIO) VALUES
(1, 'La Ceiba'),
(1, 'Tela'),
(1, 'Jutiapa'),
(1, 'El Porvenir'),
(2, 'Trujillo'),
(2, 'Tocoa'),
(2, 'Sonaguera'),
(2, 'Iriona'),
(3, 'Comayagua'),
(3, 'Siguatepeque'),
(3, 'La Libertad'),
(4, 'Santa Rosa de Copán'),
(4, 'Gracias'),
(4, 'La Entrada'),
(5, 'San Pedro Sula'),
(5, 'Choloma'),
(5, 'La Lima'),
(5, 'Puerto Cortés'),
(6, 'Choluteca'),
(6, 'Pespire'),
(6, 'San Marcos de Colón'),
(7, 'Yuscarán'),
(7, 'Danlí'),
(7, 'Guinope'),
(8, 'Tegucigalpa'),
(8, 'Comayagüela'),
(8, 'Valle de Ángeles'),
(8, 'Santa Lucía'),
(9, 'Puerto Lempira'),
(9, 'Brus Laguna'),
(9, 'Ahúas'),
(10, 'La Esperanza'),
(10, 'Intibucá'),
(10, 'San Juan'),
(11, 'Roatán'),
(11, 'Utila'),
(11, 'Guanaja'),
(12, 'La Paz'),
(12, 'Marcala'),
(12, 'Santa Elena'),
(13, 'Gracias'),
(13, 'La Iguala'),
(13, 'Candelaria'),
(14, 'Nueva Ocotepeque'),
(14, 'San Marcos'),
(14, 'Dolores'),
(15, 'Juticalpa'),
(15, 'Catacamas'),
(15, 'Salamá'),
(16, 'Santa Bárbara'),
(16, 'San Pedro Zacapa'),
(16, 'Macuelizo'),
(17, 'Nacaome'),
(17, 'Langue'),
(17, 'San Francisco de Coray'),
(18, 'Yoro'),
(18, 'El Progreso'),
(18, 'Morazán');

-- Insertar datos en la tabla de ciudades
INSERT INTO TBL_CIUDADES (ID_MUNICIPIO, NOMBRE_CIUDAD) VALUES
(1, 'La Ceiba'),
(2, 'Tela'),
(3, 'Jutiapa'),
(4, 'El Porvenir'),
(5, 'Trujillo'),
(6, 'Tocoa'),
(7, 'Sonaguera'),
(8, 'Iriona'),
(9, 'Comayagua'),
(10, 'Siguatepeque'),
(11, 'La Libertad'),
(12, 'Santa Rosa de Copán'),
(13, 'Gracias'),
(14, 'La Entrada'),
(15, 'San Pedro Sula'),
(16, 'Choloma'),
(17, 'La Lima'),
(18, 'Puerto Cortés'),
(19, 'Choluteca'),
(20, 'Pespire'),
(21, 'San Marcos de Colón'),
(22, 'Yuscarán'),
(23, 'Danlí'),
(24, 'Guinope'),
(25, 'Tegucigalpa'),
(26, 'Comayagüela'),
(27, 'Valle de Ángeles'),
(28, 'Santa Lucía'),
(29, 'Puerto Lempira'),
(30, 'Brus Laguna'),
(31, 'Ahúas'),
(32, 'La Esperanza'),
(33, 'Intibucá'),
(34, 'San Juan'),
(35, 'Roatán'),
(36, 'Utila'),
(37, 'Guanaja'),
(38, 'La Paz'),
(39, 'Marcala'),
(40, 'Santa Elena'),
(41, 'Gracias'),
(42, 'La Iguala'),
(43, 'Candelaria'),
(44, 'Nueva Ocotepeque'),
(45, 'San Marcos'),
(46, 'Dolores'),
(47, 'Juticalpa'),
(48, 'Catacamas'),
(49, 'Salamá'),
(50, 'Santa Bárbara'),
(51, 'San Pedro Zacapa'),
(52, 'Macuelizo'),
(53, 'Nacaome'),
(54, 'Langue'),
(55, 'San Francisco de Coray'),
(56, 'Yoro'),
(57, 'El Progreso'),
(58, 'Morazán');

-- Ejemplos de colonias para Atlántida
INSERT INTO TBL_COLONIAS (ID_CIUDAD, NOMBRE_COLONIA, LATITUD, LONGITUD) VALUES
(7, 'Colonia El Porvenir', 15.7539, -87.4539),
(7, 'Residencial Puerto Escondido', 15.8012, -87.4603),
(7, 'Barrio El Porvenir', 15.7634, -87.4598),
(7, 'Colonia La Ceiba', 15.7991, -87.4515),
(7, 'Barrio La Masica', 15.6078, -87.2205),
(7, 'Colonia La Masica', 15.6086, -87.2191),
(7, 'Barrio La Ceiba', 15.7654, -87.4522);

-- Ejemplos de colonias para Comayagua
INSERT INTO TBL_COLONIAS (ID_CIUDAD, NOMBRE_COLONIA, LATITUD, LONGITUD) VALUES
(12, 'Residencial Valle de Ángeles', 14.3167, -87.6833),
(12, 'Colonia El Naranjal', 14.4506, -87.6499),
(12, 'Barrio El Centro', 14.4582, -87.6419),
(12, 'Colonia San Antonio', 14.4615, -87.6443),
(12, 'Barrio El Hospital', 14.4513, -87.6415),
(12, 'Colonia El Hato', 14.4321, -87.6364),
(12, 'Residencial Las Flores', 14.4537, -87.6456);

-- Ejemplos de colonias para Copán
INSERT INTO TBL_COLONIAS (ID_CIUDAD, NOMBRE_COLONIA, LATITUD, LONGITUD) VALUES
(11, 'Barrio Copán Ruinas', 14.8409, -89.1414),
(11, 'Colonia La Fortuna', 14.8343, -89.1572),
(11, 'Residencial Las Lomas', 14.8436, -89.1512),
(11, 'Colonia Santa Rita', 14.8472, -89.1438),
(11, 'Barrio El Centro', 14.8392, -89.1418),
(11, 'Colonia Las Brisas', 14.8387, -89.1395),
(11, 'Residencial San Rafael', 14.8361, -89.1367);

-- Ejemplos de colonias para Cortés
INSERT INTO TBL_COLONIAS (ID_CIUDAD, NOMBRE_COLONIA, LATITUD, LONGITUD) VALUES
(8, 'Residencial Los Alpes', 15.5121, -88.0285),
(8, 'Colonia Villanueva', 15.5123, -88.0296),
(8, 'Barrio Guamilito', 15.4979, -88.0297),
(8, 'Colonia Suyapa', 15.5048, -88.0402),
(8, 'Barrio El Centro', 15.4947, -88.0286),
(8, 'Colonia Cerrito Lindo', 15.5031, -88.0235),
(8, 'Residencial Brisas del Valle', 15.4907, -88.0279);

-- Ejemplos de colonias para Choluteca
INSERT INTO TBL_COLONIAS (ID_CIUDAD, NOMBRE_COLONIA, LATITUD, LONGITUD) VALUES
(5, 'Residencial Los Laureles', 13.2985, -87.1876),
(5, 'Colonia Suyapa', 13.2981, -87.1779),
(5, 'Barrio El Centro', 13.3001, -87.1871),
(5, 'Colonia San Marcos', 13.2923, -87.1793),
(5, 'Barrio La Isleta', 13.3022, -87.1822),
(5, 'Colonia Los Pinos', 13.3035, -87.1905),
(5, 'Residencial Brisas del Sur', 13.2987, -87.1964);

-- Insertar datos en la tabla TBL_USUARIOS
INSERT INTO TBL_USUARIOS (NOMBRE_USUARIO, ID_ROL, DNI, CORREO, TELEFONO, FECHA_NACIMIENTO, CONTRASENIA)
VALUES
    ('Juan Pérez', 1, '0801199600123', 'juanperez@example.com', '50499991234', '1996-01-08', 'contraseña1'),
    ('María Gómez', 2, '0910199312345', 'mariagomez@example.com', '50499991235', '1993-10-09', 'contraseña2'),
    ('Carlos López', 1, '1011198712345', 'carloslopez@example.com', '50499991236', '1987-11-10', 'contraseña3'),
    ('Ana Martínez', 2, '1122198912345', 'anamartinez@example.com', '50499991237', '1989-11-22', 'contraseña4'),
    ('Pedro Hernández', 2, '1225199512345', 'pedrohernandez@example.com', '50499991238', '1995-12-25', 'contraseña5'),
    ('Luisa Rodríguez', 1, '0203198812345', 'luisarodriguez@example.com', '50499991239', '1988-03-02', 'contraseña6'),
    ('Ricardo Flores', 2, '0304199412345', 'ricardoflores@example.com', '50499991240', '1994-04-03', 'contraseña7'),
    ('Marta Sánchez', 1, '0405199012345', 'martasanchez@example.com', '50499991241', '1990-05-04', 'contraseña8'),
    ('Javier Ramírez', 2, '0506198912345', 'javierramirez@example.com', '50499991242', '1989-06-05', 'contraseña9'),
    ('Elena González', 2, '0607199212345', 'elenagonzalez@example.com', '50499991243', '1992-07-06', 'contraseña10');

INSERT INTO TBL_HOTELES (ID_HOTEL, ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, CONTRASENIA, AUTENTICADO)
VALUES
    (1, 1, 'Referencia Local 1', 'Hotel Honduras Maya', 'RTN12345678901234', 22345678, 99991234, 'hotel1@example.com', 'contraseña1', false),
    (6, 2, 'Referencia Local 2', 'Hotel Real Intercontinental', 'RTN23456789012345', 22345679, 99991235, 'hotel2@example.com', 'contraseña2', false),
    (3, 3, 'Referencia Local 3', 'Hotel Marriott Tegucigalpa', 'RTN34567890123456', 22345680, 99991236, 'hotel3@example.com', 'contraseña3', false),
    (4, 4, 'Referencia Local 4', 'Hotel Clarion', 'RTN45678901234567', 22345681, 99991237, 'hotel4@example.com', 'contraseña4', false),
    (5, 5, 'Referencia Local 5', 'Hotel Plaza Juan Carlos', 'RTN56789012345678', 22345682, 99991238, 'hotel5@example.com', 'contraseña5', false);




   INSERT INTO TBL_TIPOS_HABITACION (NOMBRE_TIPO)
    VALUES
    ('Habitacion Estandar'),
    ('Habitacion Superior'),
    ('Habitacion Deluxe'),
    ('Habitacion Familiar'),
    ('Suite Junior'),
    ('Suite'),
    ('Suite Ejecutiva'),
    ('Suite Presidencial'),
    ('Habitacion Doble'),
    ('Habitacion Triple'),
    ('Habitacion con Vista al Mar'),
    ('Habitacion con Vista a la Ciudad'),
    ('Habitacion Accesible'),
    ('Habitacion Penthouse');

INSERT INTO TBL_RESERVACIONES (ID_HABITACION,ID_USUARIO, CANT_NOCHES,  TOTAL, FECHA_ENTRADA, FECHA_SALIDA)
VALUES (7, 1, 3, 450.00, '2024-05-14', '2024-05-17');

-- POBLAR TABLA CALIFICACIONES
INSERT INTO TBL_CALIFICAR_HOTEL (ID_HOTEL, ID_USUARIO, CALIFICACION)
SELECT
    (ARRAY[14,16,17,18,13,19,20,21,22,12,24,15])[floor(random() * 12 + 1)],
    (ARRAY[43, 42, 39, 44, 45])[floor(random() * 5 + 1)],
    floor(random() * 5 + 1)
FROM generate_series(1, 1000);
