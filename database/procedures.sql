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
$$ LANGUAGE plpgsql;

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


