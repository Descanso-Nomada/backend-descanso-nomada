# Validaciones del Servidor

## Índice

1. [Validación de Reservaciones](#validación-de-reservaciones)
2. [Validación de Registro de Usuario](#validación-de-registro-de-usuario)
3. [Validación de Registro de Hotel](#validación-de-registro-de-hotel)
4. [Validación de Autenticación](#validación-de-autenticación)

## Librerías Utilizadas

### `express-validator`

- **Descripción**: `express-validator` es un conjunto de middlewares de validación y sanitización para `express`.
- **Uso**: Se utiliza para validar y sanitizar los datos de las solicitudes antes de procesarlas.

### `validateResult`

- **Descripción**: `validateResult` es una función personalizada que maneja los resultados de la validación y devuelve errores si los hay.
- **Uso**: Se utiliza en conjunto con `express-validator` para manejar los errores de validación.

## Validación de Reservaciones

Este código define la validación para las reservaciones, asegurándose de que los campos id_habitacion, cant_noches, fecha_entrada, y fecha_salida cumplan con los criterios especificados.

id_habitacion: Verifica que el campo id_habitacion esté presente, no sea vacío y sea un número entero. Este campo es obligatorio ya que identifica la habitación específica que se está reservando.

cant_noches: Verifica que el campo cant_noches esté presente, no sea vacío y sea un número entero. Este campo es esencial para determinar la duración de la estancia del usuario.

fecha_entrada: Verifica que el campo fecha_entrada esté presente, no sea vacío y sea una fecha válida en el formato ISO8601 (YYYY-MM-DD). Esta validación asegura que se proporciona una fecha de entrada correcta para la reserva.

fecha_salida: Verifica que el campo fecha_salida esté presente, no sea vacío y sea una fecha válida en el formato ISO8601 (YYYY-MM-DD). Asegura que la fecha de salida de la reserva es valida.

```javascript
import { check } from 'express-validator';
import { validateResult } from '../helpers/validateHelper.js';

const validateReservacion = [
    check('id_habitacion')
        .exists({ checkFalsy: true }).withMessage('El id de la habitacion es obligatorio.')
        .isInt().withMessage('La id debe ser un número entero.'),

    check('cant_noches')
        .exists({ checkFalsy: true }).withMessage('La cantidad de noches es obligatorio.')
        .isInt().withMessage('La cantidad de noches debe ser un número entero.'),

    check('fecha_entrada')
        .exists({ checkFalsy: true }).withMessage('La fecha de entrada es obligatoria.')
        .isISO8601().withMessage('La fecha de entrada debe ser una fecha válida en formato YYYY-MM-DD.'),

    check('fecha_salida')
        .exists({ checkFalsy: true }).withMessage('La fecha de salida es obligatoria.')
        .isISO8601().withMessage('La fecha de salida debe ser una fecha válida en formato YYYY-MM-DD.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

export {
    validateReservacion
};
```

## Validación de Registro de Hotel

Este código define la validación para el registro de hoteles, asegurándose de que los campos ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP, CORREO, y CONTRASENIA cumplan con los criterios especificados.

nombre_usuario: Verifica que el campo nombre_usuario esté presente, no sea vacío y no exceda los 300 caracteres. Este campo es obligatorio y se utiliza para identificar al usuario en la plataforma.

correo: Verifica que el campo correo esté presente, no sea vacío, sea un correo electrónico válido y no exceda los 120 caracteres. Este campo es obligatorio para las comunicaciones y recuperación de cuenta.

contrasenia: Verifica que el campo contrasenia esté presente, no sea vacío y tenga entre 6 y 200 caracteres. La contraseña es obligatoria para asegurar la cuenta del usuario.

id_rol: Verifica que el campo id_rol esté presente, no sea vacío y sea un número entero. Este campo determina el rol del usuario en la plataforma (por ejemplo, administrador, usuario regular).

dni: Verifica que el campo dni esté presente, no sea vacío, no exceda los 18 caracteres y contenga solo caracteres alfanuméricos. Este campo es obligatorio para la identificación del usuario.

telefono: Verifica que el campo telefono esté presente, no sea vacío, no exceda los 9 dígitos, contenga solo números y siga un formato específico. Este campo es necesario para la comunicación directa con el usuario.

fecha_nacimiento: Verifica que el campo fecha_nacimiento esté presente, no sea vacío y sea una fecha válida en el formato ISO8601 (YYYY-MM-DD). Esta fecha es necesaria para identificar la edad del usuario.

```javascript
import { check } from 'express-validator';
import { validateResult } from '../helpers/validateHelper.js';

const validateRegistroHotel = [
    check('ID_DIRECCION')
        .exists({ checkFalsy: true }).withMessage('El ID de dirección es obligatorio.')
        .isInt().withMessage('El ID de dirección debe ser un número entero.'),

    check('REFERENCIA_LOCAL')
        .exists({ checkFalsy: true }).withMessage('La referencia local es obligatoria.')
        .isLength({ max: 500 }).withMessage('La referencia local no debe exceder los 500 caracteres.'),

    check('NOMBRE')
        .exists({ checkFalsy: true }).withMessage('El nombre es obligatorio.')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder los 100 caracteres.'),

    check('RTN')
        .exists({ checkFalsy: true }).withMessage('El RTN es obligatorio.')
        .isLength({ max: 18 }).withMessage('El RTN no debe exceder los 18 caracteres.')
        .isAlphanumeric().withMessage('El RTN debe contener solo caracteres alfanuméricos.'),

    check('NO_TELEFONO')
        .exists({ checkFalsy: true }).withMessage('El número de teléfono es obligatorio.')
        .isNumeric().withMessage('El número de teléfono debe ser numérico.')
        .isLength({ max: 9 }).withMessage('El número de teléfono no debe tener más de 9 dígitos.'),

    check('NO_WHATSAPP')
        .exists({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('El número de WhatsApp debe ser numérico.')
        .isLength({ max: 9 }).withMessage('El número de WhatsApp no debe tener más de 9 dígitos.'),

    check('CORREO')
        .exists({ checkFalsy: true }).withMessage('El correo es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
        .isLength({ max: 100 }).withMessage('El correo no debe exceder los 100 caracteres.'),

    check('CONTRASENIA')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6, max: 200 }).withMessage('La contraseña debe tener entre 6 y 200 caracteres.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

export {
    validateRegistroHotel
};
```


## Validación de Autenticación

Este código define la validación para la autenticación, asegurándose de que los campos correo y contrasenia cumplan con los criterios especificados.

correo: Verifica que el campo correo esté presente, no sea vacío, y sea un correo electrónico válido. Este campo es obligatorio para iniciar sesión.

contrasenia: Verifica que el campo contrasenia esté presente y no sea vacío. La contraseña es obligatoria para verificar la identidad del usuario al iniciar sesión.

```javascript
import { check } from 'express-validator';
import { validateResult } from '../helpers/validateHelper.js';

const validateAuth = [
    check('correo')
        .exists({ checkFalsy: true }).withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido'),

    check('contrasenia')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria')
        .not().isEmpty().withMessage('La contraseña no puede estar vacía'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

export {
    validateAuth
};

```
