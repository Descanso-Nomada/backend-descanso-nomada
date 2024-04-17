import jwt from 'jsonwebtoken';

const validarCookie = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  }

  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.userid = payload.userid;
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired',
    carga:payload });
    } else {
      res.status(403).json({ message: 'Invalid token',
      carga:payload });
    }
  }
}


const validarCookieHotel = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  }
  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.idHotel = payload.idHotel; 
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired'});
    } else {
      res.status(403).json({ message: 'Invalid token'});
    }
  }
}

export {
    validarCookie,
    validarCookieHotel
  }