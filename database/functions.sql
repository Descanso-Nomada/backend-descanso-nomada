CREATE OR REPLACE FUNCTION cambiarEstadoHotel(id INT)
RETURNS TABLE (ID_HOTEL INT, AUTENTICADO BOOLEAN) AS
$$
BEGIN
    UPDATE TBL_HOTELES
    SET AUTENTICADO = NOT AUTENTICADO
    WHERE ID_HOTEL = id;
    RETURN QUERY SELECT ID_HOTEL, AUTENTICADO FROM TBL_HOTELES WHERE ID_HOTEL = id;
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


