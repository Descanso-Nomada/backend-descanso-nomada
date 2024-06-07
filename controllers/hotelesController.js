import bcrypt from "bcrypt";
import { db } from "../database/conn.js";
import { enviarCorreoConfirmarHotel } from "../helpers/sendEmail.js";

const registrarHotel = async (req, res) => {
  const {
    ID_DIRECCION,
    REFERENCIA_LOCAL,
    NOMBRE,
    RTN,
    NO_TELEFONO,
    NO_WHATSAPP,
    CORREO,
    CONTRASENIA,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(15);
    const contraseniaHash = await bcrypt.hash(CONTRASENIA, salt);
    const sql = `
        INSERT INTO TBL_HOTELES
            (ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, CONTRASENIA, AUTENTICADO)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *
        `;
    const values = [
      ID_DIRECCION,
      REFERENCIA_LOCAL,
      NOMBRE,
      RTN,
      NO_TELEFONO,
      NO_WHATSAPP,
      CORREO,
      contraseniaHash,
      false,
    ];
    const result = await db.query(sql, values);
    const id_hotel = result[0].id_hotel;
    console.log(result);
    console.log("ESTE ES EL ID DEL HOTEL:", id_hotel);
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      const dataImagen = [id_hotel, buffer, originalname, mimetype];
      const sqlImagen = `INSERT INTO TBL_IMAGENES_HOTELES (ID_HOTEL, IMAGEN_HOTEL, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                               VALUES ($1, $2, $3, $4)`;
      await db.query(sqlImagen, dataImagen);
    }
    res.json({ message: "Hotel e imagen registrados con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      msg: "Error al registrar el Hotel y la imagen del hotel",
    });
  }
};

const borrarHotel = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("CALL sp_borrar_hotel($1)", [id]);

    res.json({ message: "Hotel borrado exitosamente" });
  } catch (error) {
    console.error("Error al borrar el hotel:", error);
    res.status(500).json({ error: "Error al borrar el hotel" });
  }
};

const hotelesInactivos = async (req, res) => {
  try {
    const sql = `SELECT * FROM TBL_HOTELES WHERE AUTENTICADO = FALSE`;
    const result = await db.query(sql);
    res.json(result);
  } catch (error) {
    console.error("Error al listar los hoteles:", error);
    res.status(500).json({ error: "Error al listar los hoteles" });
  }
};

const cambiarEstadoHotel = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `UPDATE TBL_HOTELES
    SET AUTENTICADO = TRUE
    WHERE ID_HOTEL = $1;
    `;
    const result = await db.query(sql, id);

    const sql2 = ` SELECT id_hotel,
              nombre,
              correo
        FROM tbl_hoteles
        WHERE id_hotel = $1;`;
    const result2 = await db.query(sql2, id);
    
    enviarCorreoConfirmarHotel(result2[0].correo, result2[0].nombre);

    res.json(result);
  } catch (error) {
    console.error(
      "Error al cambiar el estado de autenticado del hotel: ",
      error
    );
    res.status(500).send({ mensaje: "Error al procesar la solicitud." });
  }
};

const mostrarHoteles = async (req, res) => {
  try {
    const query = `
    SELECT
        H.ID_HOTEL, 
        H.ID_DIRECCION AS ID_CIUDAD,
        CONCAT(
            COALESCE(CIU.NOMBRE_CIUDAD, 'N/A'), ', ', 
            COALESCE(MUN.NOMBRE_MUNICIPIO, 'N/A'), ', ', 
            COALESCE(DEP.NOMBRE_DEPTO, 'N/A')
        ) AS DIRECCION_COMPLETA,
        H.REFERENCIA_LOCAL,
        DEP.ID_DEPTO,
        CIU.ID_CIUDAD,
        H.NOMBRE, 
        H.RTN, 
        H.NO_TELEFONO, 
        H.NO_WHATSAPP, 
        H.CORREO,
        LATEST_IMG.ID_IMG_HOTEL,
        encode(LATEST_IMG.IMAGEN_HOTEL, 'base64') AS IMAGEN_HOTEL,
        LATEST_IMG.NOMBRE_ARCHIVO,
        LATEST_IMG.EXTENSION_ARCHIVO,
        COALESCE(HABITACIONES_DISPONIBLES.CANTIDAD_DISPONIBLES, 0) AS CANTIDAD_HABITACIONES_DISPONIBLES
    FROM TBL_HOTELES AS H
    LEFT JOIN TBL_CIUDADES AS CIU ON H.ID_DIRECCION = CIU.ID_CIUDAD
    LEFT JOIN TBL_MUNICIPIOS AS MUN ON MUN.ID_MUNICIPIO = CIU.ID_MUNICIPIO
    LEFT JOIN TBL_DEPARTAMENTOS AS DEP ON DEP.ID_DEPTO = MUN.ID_DEPTO
    LEFT JOIN (
        SELECT
            IH.ID_HOTEL,
            IH.ID_IMG_HOTEL,
            IH.IMAGEN_HOTEL,
            IH.NOMBRE_ARCHIVO,
            IH.EXTENSION_ARCHIVO
        FROM TBL_IMAGENES_HOTELES IH
        INNER JOIN (
            SELECT ID_HOTEL, MAX(ID_IMG_HOTEL) AS MAX_ID_IMG_HOTEL
            FROM TBL_IMAGENES_HOTELES
            GROUP BY ID_HOTEL
        ) AS MAX_IMG ON IH.ID_HOTEL = MAX_IMG.ID_HOTEL AND IH.ID_IMG_HOTEL = MAX_IMG.MAX_ID_IMG_HOTEL
    ) AS LATEST_IMG ON H.ID_HOTEL = LATEST_IMG.ID_HOTEL
    LEFT JOIN (
        SELECT
            ID_HOTEL,
            COUNT(*) AS CANTIDAD_DISPONIBLES
        FROM TBL_HABITACIONES
        WHERE PUBLICACION_ACTIVA = TRUE AND RENTADA = FALSE
        GROUP BY ID_HOTEL
    ) AS HABITACIONES_DISPONIBLES ON H.ID_HOTEL = HABITACIONES_DISPONIBLES.ID_HOTEL
    WHERE H.AUTENTICADO = TRUE;
        `;
    const result = await db.query(query);

    const data = result;

    res.json(data);
  } catch (error) {
    console.error("Error al mostrar hoteles con imágenes:", error);
    res.status(500).json({ error: "Error al mostrar hoteles con imágenes" });
  }
};

const mostrarHotel = async (req, res) => {
  const hotelId = parseInt(req.params.id);
  try {
    const query = `
    SELECT  
    H.ID_HOTEL, 
    H.ID_DIRECCION AS ID_CIUDAD, 
    CONCAT(
        COALESCE(CIU.NOMBRE_CIUDAD, 'N/A'), ', ', 
        COALESCE(MUN.NOMBRE_MUNICIPIO, 'N/A'), ', ', 
        COALESCE(DEP.NOMBRE_DEPTO, 'N/A')
    ) AS DIRECCION_COMPLETA,
    H.REFERENCIA_LOCAL,
    H.NOMBRE, 
    H.RTN, 
    H.NO_TELEFONO, 
    H.NO_WHATSAPP, 
    H.CORREO,
    DEP.ID_DEPTO,
    LATEST_IMG.ID_IMG_HOTEL,
    encode(LATEST_IMG.IMAGEN_HOTEL, 'base64') AS IMAGEN_HOTEL,
    LATEST_IMG.NOMBRE_ARCHIVO,
    LATEST_IMG.EXTENSION_ARCHIVO,
    COALESCE(HABITACIONES_DISPONIBLES.CANTIDAD_DISPONIBLES, 0) AS CANTIDAD_HABITACIONES_DISPONIBLES
FROM TBL_HOTELES AS H
LEFT JOIN TBL_CIUDADES AS CIU ON H.ID_DIRECCION = CIU.ID_CIUDAD
LEFT JOIN TBL_MUNICIPIOS AS MUN ON MUN.ID_MUNICIPIO = CIU.ID_MUNICIPIO
LEFT JOIN TBL_DEPARTAMENTOS AS DEP ON DEP.ID_DEPTO = MUN.ID_DEPTO
LEFT JOIN (
    SELECT
        IH.ID_HOTEL,
        IH.ID_IMG_HOTEL,
        IH.IMAGEN_HOTEL,
        IH.NOMBRE_ARCHIVO,
        IH.EXTENSION_ARCHIVO
    FROM TBL_IMAGENES_HOTELES IH
    INNER JOIN (
        SELECT ID_HOTEL, MAX(ID_IMG_HOTEL) AS MAX_ID_IMG_HOTEL
        FROM TBL_IMAGENES_HOTELES
        GROUP BY ID_HOTEL
    ) AS MAX_IMG ON IH.ID_HOTEL = MAX_IMG.ID_HOTEL AND IH.ID_IMG_HOTEL = MAX_IMG.MAX_ID_IMG_HOTEL
) AS LATEST_IMG ON H.ID_HOTEL = LATEST_IMG.ID_HOTEL
LEFT JOIN (
    SELECT
        ID_HOTEL,
        COUNT(*) AS CANTIDAD_DISPONIBLES
    FROM TBL_HABITACIONES
    WHERE PUBLICACION_ACTIVA = TRUE AND RENTADA = FALSE
    GROUP BY ID_HOTEL
) AS HABITACIONES_DISPONIBLES ON H.ID_HOTEL = HABITACIONES_DISPONIBLES.ID_HOTEL
WHERE H.ID_HOTEL = $1 AND H.AUTENTICADO = TRUE;
    `;
    const result = await db.query(query, [hotelId]);

    const data = result;
    res.json(data);
  } catch (error) {
    console.error("Error al mostrar el hotel:", error);
    res.status(500).json({ error: "Error al mostrar el hotel" });
  }
};

const actualizarContrasenia = async (req, res) => {
  const params = [
    req.idHotel,
    req.body.correo,
    req.body.contrasenia,
    req.body.nueva_contrasenia,
  ];
  try {
    const sql = "SELECT CONTRASENIA FROM TBL_HOTELES WHERE ID_HOTEL =$1";
    const getPass = await db.query(sql, params[0]);
    const passwordCorrect = await bcrypt.compare(
      params[2],
      getPass[0].contrasenia
    );
    if (!passwordCorrect) {
      res.status(201).json({
        msg: "Contraseña Incorrecta",
      });
      return;
    } else {
      const salt = await bcrypt.genSalt(15);
      const contraseniaHash = await bcrypt.hash(params[3], salt);
      const sql2 =
        "UPDATE TBL_HOTELES SET CONTRASENIA = $2 WHERE ID_HOTEL = $1";
      const values = [params[0], contraseniaHash];
      await db.query(sql2, values);
      res.json({
        msg: "Contraseña actualizada correctamente",
      });
    }
  } catch (error) {
    console.error("Error al actualizar la contraseña", error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
};

const mostrarCalificacionHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT COUNT(*) AS CANTIDAD,
        SUM(CALIFICACION) AS SUMATORIA
      FROM TBL_CALIFICAR_HOTEL
      WHERE id_hotel = $1
        `;
    const result = await db.query(query, id);

    const data = result;

    res.json(data);
  } catch (error) {
    console.error("Error al mostrar hoteles con imágenes:", error);
    res.status(500).json({ error: "Error al mostrar hoteles con imágenes" });
  }
}

export {
  registrarHotel,
  borrarHotel,
  mostrarHoteles,
  mostrarHotel,
  hotelesInactivos,
  cambiarEstadoHotel,
  actualizarContrasenia,
  mostrarCalificacionHotel,
};
