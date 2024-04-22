-- Active: 1710177975794@@localhost@5432@descanso_nomada
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



CREATE OR REPLACE FUNCTION registrar_habitacion(
    _id_hotel INT,
    _publicacion_activa BOOLEAN,
    _id_tipo_habitacion INT,
    _capacidad INT,
    _descripcion TEXT,
    _rentada BOOLEAN,
    _caracteristicas TEXT,
    _precio_noche DECIMAL
)
RETURNS INT AS
$$
DECLARE
    _id_habitacion INT;
BEGIN
    INSERT INTO TBL_HABITACIONES (
        ID_HOTEL,
        PUBLICACION_ACTIVA,
        ID_TIPO_HABITACION,
        CAPACIDAD,
        DESCRIPCION,
        RENTADA,
        CARACTERISTICAS,
        PRECIO_NOCHE
    )
    VALUES (
        _id_hotel,
        _publicacion_activa,
        _id_tipo_habitacion,
        _capacidad,
        _descripcion,
        _rentada,
        _caracteristicas,
        _precio_noche
    )
    RETURNING ID_HABITACION INTO _id_habitacion;
    
    RETURN _id_habitacion;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_registrar_hotel(
    ID_DIRECCION_param INTEGER,
    REFERENCIA_LOCAL_param VARCHAR(100),
    NOMBRE_param VARCHAR(100),
    RTN_param VARCHAR(100),
    NO_TELEFONO_param INTEGER,
    NO_WHATSAPP_param INTEGER,
    CORREO_param VARCHAR(100),
    CONTRASENIA_param VARCHAR(100)
)
RETURNS INTEGER AS $$
DECLARE
    nuevo_id_hotel INTEGER;
BEGIN
    INSERT INTO tbl_hoteles (
        ID_DIRECCION,
        REFERENCIA_LOCAL,
        NOMBRE,
        RTN,
        NO_TELEFONO,
        NO_WHATSAPP,
        CORREO,
        CONTRASENIA,
        AUTENTICADO
    )
    VALUES (
        ID_DIRECCION_param,
        REFERENCIA_LOCAL_param,
        NOMBRE_param,
        RTN_param,
        NO_TELEFONO_param,
        NO_WHATSAPP_param,
        CORREO_param,
        CONTRASENIA_param,
        false 
    )
     RETURNING ID_HOTEL, ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, CONTRASENIA, AUTENTICADO INTO ID_HOTEL, ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, CONTRASENIA, AUTENTICADO;

    RETURN QUERY SELECT ID_HOTEL, ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, CONTRASENIA, AUTENTICADO;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END; $$
LANGUAGE plpgsql;
