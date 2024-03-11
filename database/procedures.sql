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
