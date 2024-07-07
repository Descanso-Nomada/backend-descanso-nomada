import jwt from 'jsonwebtoken';

// Middleware para validar el token del usuario
const validarCookie = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  };
  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.userid = payload.userid;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired', carga: info.payload });
    } else {
      res.status(403).json({ message: 'Invalid token', carga: info.payload });
    }
  }
};

// Middleware para validar el token del hotel
const validarCookieHotel = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  };
  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.idHotel = payload.idHotel;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired' });
    } else {
      res.status(403).json({ message: 'Invalid token' });
    }
  }
};

// Middleware para validar el token tanto de usuario como de hotel
const validarCookieCombinado = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, 'secret');
    if (payload.userid) {
      req.user = payload;
    } else if (payload.idHotel) {
      req.hotel = payload;
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
};

export {
  validarCookie,
  validarCookieHotel,
  validarCookieCombinado
};
