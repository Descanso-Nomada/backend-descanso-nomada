CREATE TRIGGER trg_insert_reservacion_detalle
AFTER INSERT ON TBL_RESERVACIONES
FOR EACH ROW
EXECUTE FUNCTION fn_insert_reservacion_detalle();