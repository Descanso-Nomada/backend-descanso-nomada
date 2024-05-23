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
    console.log(payload.idHotel);
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired'});
    } else {
      res.status(403).json({ message: 'Invalid token'});
    }
  }
}

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
  }