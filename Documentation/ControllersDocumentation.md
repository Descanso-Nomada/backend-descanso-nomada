# Documentación de Funciones

## Índice

1. [Funciones de Usuarios](#funciones-de-usuarios)
    - [registrarUsuario](#registrarusuario)
    - [mostrarUsuarios](#mostrarusuarios)
    - [eliminarUsuario](#eliminarusuario)
    - [actualizarContrasenia](#actualizarcontrasenia)
2. [Funciones de Reservaciones](#funciones-de-reservaciones)
    - [crearReservacion](#crearreservacion)
    - [obtenerReservaciones](#obtenerreservaciones)
    - [reservacionesUsuario](#reservacionesusuario)
    - [actualizarReservacion](#actualizarreservacion)
    - [eliminarReservacion](#eliminarreservacion)
3. [Funciones de Seguridad](#funciones-de-seguridad)
    - [sendCode](#sendcode)
    - [changePass](#changepass)
4. [Funciones de Habitaciones](#funciones-de-habitaciones)
    - [registrarHabitacion](#registrarhabitacion)
    - [listarHabitaciones](#listarhabitaciones)
    - [eliminarHabitacion](#eliminarhabitacion)
    - [tipoHabitaciones](#tipohabitaciones)
    - [cambiarEstadoHabitacion](#cambiarestadohabitacion)
    - [listarHabitacionId](#listarhabitacionid)
    - [actualizarHabitacion](#actualizarhabitacion)
    - [mostrarComentariosHabitacion](#mostrarcomentarioshabitacion)
    - [guardarComentario](#guardarcomentario)
5. [Funciones de Hoteles](#funciones-de-hoteles)
    - [registrarHotel](#registrarhotel)
    - [borrarHotel](#borrarhotel)
    - [mostrarHoteles](#mostrarhoteles)
    - [mostrarHotel](#mostrarhotel)
    - [hotelesInactivos](#hotelesinactivos)
    - [cambiarEstadoHotel](#cambiarestadohotel)
    - [actualizarContraseniaHotel](#actualizarcontraseniahotel)
    - [mostrarCalificacionHotel](#mostrarcalificacionhotel)
    - [guardarCalificacionHotel](#guardarcalificacionhotel)
6. [Funciones de Imágenes](#funciones-de-imágenes)
    - [insertImgHotel](#insertimghotel)
    - [insertImgHabitacion](#insertimghabitacion)
    - [imagenesHotel](#imagenesHotel)
    - [imagenesHabitacion](#imagenesHabitacion)
    - [eliminarImgHabitacion](#eliminarimghabitacion)
    - [eliminarImgHotel](#eliminarimghotel)
7. [Funciones de Localización](#funciones-de-localización)
    - [obtenerDepartamentos](#obtenerdepartamentos)
    - [municipiosPorDepartamento](#municipiospordepartamento)
    - [obtenerMunicipios](#obtenermunicipios)
    - [ciudadesPorMunicipios](#ciudadespormunicipios)
    - [coloniasporCiudad](#coloniasporciudad)
8. [Funciones de Historial](#funciones-de-historial)
    - [obtenerHistorial](#obtenerhistorial)
9. [Funciones de Estadísticas](#funciones-de-estadísticas)
    - [habitaciones_rentadaXnorentada](#habitaciones_rentadaxnorentada)
    - [usuarios_registradosXcategoria](#usuarios_registradosxcategoria)
    - [hotelesMasValorados](#hotelesmasvalorados)

## Funciones de Usuarios

### registrarUsuario

**Descripción**: Registra un nuevo usuario en la base de datos.

**Detalles**:
- Recibe los datos del usuario, incluyendo la imagen.
- Hashea la contraseña del usuario.
- Llama a un procedimiento almacenado para registrar el usuario.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### mostrarUsuarios

**Descripción**: Muestra todos los usuarios con el rol de cliente.

**Detalles**:
- Selecciona todos los usuarios donde `ID_ROL` es igual a 2.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### eliminarUsuario

**Descripción**: Elimina un usuario de la base de datos por su ID.

**Detalles**:
- Elimina el usuario de la tabla `TBL_USUARIOS` y devuelve el registro eliminado.
- Devuelve un mensaje de éxito en formato JSON si el usuario es eliminado.
- Si el usuario no existe, devuelve un mensaje de error.
- En caso de error, devuelve un mensaje de error con el estado 500.

### actualizarContrasenia

**Descripción**: Actualiza la contraseña de un usuario.

**Detalles**:
- Verifica la contraseña actual del usuario.
- Hashea la nueva contraseña y la actualiza en la base de datos.
- Si se proporciona una nueva imagen, también la actualiza.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Reservaciones

### crearReservacion

**Descripción**: Crea una nueva reservación para una habitación.

**Detalles**:
- Verifica el precio de la habitación y calcula el total.
- Obtiene la información del usuario y la habitación.
- Inserta la nueva reservación en la base de datos.
- Envía una factura por correo electrónico al usuario.
- Envía una notificación por WhatsApp al usuario y al hotel.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### obtenerReservaciones

**Descripción**: Obtiene todas las reservaciones para un hotel específico.

**Detalles**:
- Realiza una consulta SQL para obtener todas las reservaciones del hotel especificado.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### reservacionesUsuario

**Descripción**: Obtiene todas las reservaciones de un usuario específico.

**Detalles**:
- Realiza una consulta SQL para obtener todas las reservaciones del usuario especificado.
- Devuelve los resultados en formato JSON.
- En caso de que no haya reservaciones, devuelve un mensaje indicando que no tiene reservaciones.
- En caso de error, devuelve un mensaje de error con el estado 500.

### actualizarReservacion

**Descripción**: Actualiza el estado de una reservación específica.

**Detalles**:
- Actualiza el estado de la reservación en la base de datos.
- Envía una notificación por WhatsApp al usuario informándole sobre el estado de la reservación.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de que no se encuentre la reservación, devuelve un mensaje indicando que no se encontró.
- En caso de error, devuelve un mensaje de error con el estado 500.

### eliminarReservacion

**Descripción**: Elimina una reservación específica que no ha sido revisada.

**Detalles**:
- Elimina la reservación de la base de datos si su estado es "NO REVISADO".
- Devuelve un mensaje de éxito en formato JSON.
- En caso de que no se encuentre la reservación, devuelve un mensaje indicando que no hay reservaciones no revisadas.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Seguridad

### sendCode

**Descripción**: Envía un código de seguridad al correo del usuario.

**Detalles**:
- Verifica si el correo electrónico existe en la base de datos.
- Genera un código de seguridad de 6 dígitos.
- Envía el código de seguridad al correo del usuario.
- Devuelve un mensaje indicando si el correo fue enviado o no.
- En caso de error, devuelve un mensaje de error con el estado 500.

### changePass

**Descripción**: Cambia la contraseña del usuario utilizando el código de seguridad.

**Detalles**:
- Verifica si el correo electrónico y el código de seguridad son correctos.
- Hashea la nueva contraseña.
- Actualiza la contraseña del usuario en la base de datos.
- Devuelve un mensaje indicando si la contraseña fue actualizada exitosamente.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Habitaciones

### registrarHabitacion

**Descripción**: Registra una nueva habitación y guarda sus imágenes.

**Detalles**:
- Inserta los datos de la habitación en la base de datos utilizando una función almacenada.
- Verifica que se suban exactamente 5 imágenes y las guarda en la base de datos.
- Devuelve un mensaje de éxito y el ID de la habitación registrada.
- En caso de error, devuelve un mensaje de error con el estado 500.

### listarHabitaciones

**Descripción**: Lista todas las habitaciones de un hotel.

**Detalles**:
- Selecciona las habitaciones del hotel junto con su tipo e imagen más reciente.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### eliminarHabitacion

**Descripción**: Elimina una habitación por su ID.

**Detalles**:
- Elimina la habitación de la base de datos.
- Devuelve un mensaje de éxito.
- En caso de error, devuelve un mensaje de error con el estado 500.

### tipoHabitaciones

**Descripción**: Obtiene todos los tipos de habitaciones.

**Detalles**:
- Selecciona todos los tipos de habitaciones de la base de datos.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### cambiarEstadoHabitacion

**Descripción**: Cambia el estado de una habitación.

**Detalles**:
- Actualiza el estado de una habitación en la base de datos.
- Devuelve un mensaje de éxito.
- En caso de error, devuelve un mensaje de error con el estado 500.

### listarHabitacionId

**Descripción**: Lista los detalles de una habitación por su ID.

**Detalles**:
- Selecciona los detalles de la habitación junto con su tipo y todas sus imágenes.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### actualizarHabitacion

**Descripción**: Actualiza los datos de una habitación existente.

**Detalles**:
- Actualiza los datos de la habitación en la base de datos.
- Elimina las imágenes existentes de la habitación y guarda las nuevas imágenes si se proporcionan.
- Devuelve un mensaje de éxito y el ID de la habitación actualizada.
- En caso de error, devuelve un mensaje de error con el estado 500.

### mostrarComentariosHabitacion

**Descripción**: Muestra los comentarios de una habitación por su ID.

**Detalles**:
- Selecciona los comentarios de la habitación junto con los detalles del usuario que realizó el comentario.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### guardarComentario

**Descripción**: Guarda un comentario para una habitación.

**Detalles**:
- Inserta el comentario en la base de datos.
- Devuelve un mensaje de éxito.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Hoteles

### registrarHotel

**Descripción**: Registra un nuevo hotel en la base de datos y guarda la imagen del hotel si se proporciona.

**Detalles**:
- Hashea la contraseña del hotel.
- Inserta los datos del hotel en la tabla `TBL_HOTELES`.
- Guarda la imagen del hotel en la tabla `TBL_IMAGENES_HOTELES` si se proporciona.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### borrarHotel

**Descripción**: Borra un hotel de la base de datos.

**Detalles**:
- Llama al procedimiento almacenado `sp_borrar_hotel` para eliminar el hotel.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### mostrarHoteles

**Descripción**: Muestra todos los hoteles autenticados junto con sus detalles y la imagen más reciente.

**Detalles**:
- Selecciona los detalles de los hoteles y sus imágenes más recientes.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### mostrarHotel

**Descripción**: Muestra los detalles de un hotel específico por ID.

**Detalles**:
- Selecciona los detalles del hotel y su imagen más reciente.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### hotelesInactivos

**Descripción**: Obtiene todos los hoteles inactivos (no autenticados).

**Detalles**:
- Selecciona los hoteles donde `AUTENTICADO` es `FALSE`.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### cambiarEstadoHotel

**Descripción**: Cambia el estado de autenticación de un hotel a `TRUE`.

**Detalles**:
- Actualiza el estado de autenticación del hotel en la tabla `TBL_HOTELES`.
- Envía un correo electrónico de confirmación al hotel.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### actualizarContraseniaHotel

**Descripción**: Actualiza la contraseña de un hotel.

**Detalles**:
- Verifica la contraseña actual del hotel.
- Hashea la nueva contraseña y la actualiza en la base de datos.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### mostrarCalificacionHotel

**Descripción**: Muestra la calificación de un hotel por ID.

**Detalles**:
- Selecciona el conteo y la sumatoria de calificaciones del hotel.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### guardarCalificacionHotel

**Descripción**: Guarda la calificación de un hotel.

**Detalles**:
- Inserta la calificación del hotel en la base de datos.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Imágenes

### insertImgHotel

**Descripción**: Inserta una imagen para un hotel en la base de datos.

**Detalles**:
- Recibe los datos de la imagen (buffer, nombre original, tipo MIME) y el ID del hotel.
- Inserta la imagen en la tabla `TBL_IMAGENES_HOTELES`.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### insertImgHabitacion

**Descripción**: Inserta una imagen para una habitación en la base de datos.

**Detalles**:
- Recibe los datos de la imagen (buffer, nombre original, tipo MIME) y el ID de la habitación.
- Inserta la imagen en la tabla `TBL_IMAGENES_HABITACIONES`.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### imagenesHotel

**Descripción**: Obtiene las imágenes de un hotel por su ID.

**Detalles**:
- Selecciona las imágenes de la tabla `TBL_IMAGENES_HOTELES` para el hotel con el ID proporcionado.
- Devuelve las imágenes en formato base64 y los detalles en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### imagenesHabitacion

**Descripción**: Obtiene las imágenes de una habitación por su ID.

**Detalles**:
- Selecciona las imágenes de la tabla `TBL_IMAGENES_HABITACIONES` para la habitación con el ID proporcionado.
- Devuelve las imágenes en formato base64 y los detalles en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### eliminarImgHabitacion

**Descripción**: Elimina una imagen de una habitación por su ID.

**Detalles**:
- Elimina la imagen de la tabla `TBL_IMAGENES_HABITACIONES` para la habitación con el ID proporcionado.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### eliminarImgHotel

**Descripción**: Elimina una imagen de un hotel por su ID.

**Detalles**:
- Elimina la imagen de la tabla `TBL_IMAGENES_HOTELES` para el hotel con el ID proporcionado.
- Devuelve un mensaje de éxito en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Localización

### obtenerDepartamentos

**Descripción**: Obtiene todos los departamentos de la base de datos.

**Detalles**:
- Realiza una consulta SQL que selecciona todos los registros de la tabla `TBL_DEPARTAMENTOS`.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### municipiosPorDepartamento

**Descripción**: Obtiene los municipios asociados a un departamento específico por su ID.

**Detalles**:
- Realiza una consulta SQL que selecciona todos los municipios de la tabla `TBL_MUNICIPIOS` donde `ID_DEPTO` es igual al ID del departamento proporcionado.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### obtenerMunicipios

**Descripción**: Obtiene todos los municipios de la base de datos.

**Detalles**:
- Realiza una consulta SQL que selecciona todos los registros de la tabla `TBL_MUNICIPIOS`.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### ciudadesPorMunicipios

**Descripción**: Obtiene las ciudades asociadas a un municipio específico por su ID.

**Detalles**:
- Realiza una consulta SQL que selecciona todas las ciudades de la tabla `TBL_CIUDADES` donde `ID_MUNICIPIO` es igual al ID del municipio proporcionado.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### coloniasporCiudad

**Descripción**: Obtiene las colonias asociadas a una ciudad específica por su ID.

**Detalles**:
- Realiza una consulta SQL que selecciona todas las colonias de la tabla `TBL_COLONIAS` donde `ID_CIUDAD` es igual al ID de la ciudad proporcionada.
- Devuelve los resultados en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Historial

### obtenerHistorial

**Descripción**: Obtiene el historial de reservaciones de un usuario.

**Detalles**:
- Realiza una consulta SQL que selecciona todas las reservaciones detalladas de la tabla `TBL_RESERVACIONES_DETALLE` para el usuario con el ID proporcionado (`ID_USUARIO`).
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

## Funciones de Estadísticas

### habitaciones_rentadaXnorentada

**Descripción**: Obtiene la cantidad de habitaciones rentadas y no rentadas.

**Detalles**:
- Realiza una consulta SQL que cuenta las habitaciones rentadas y no rentadas.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### usuarios_registradosXcategoria

**Descripción**: Obtiene la cantidad de usuarios registrados por categoría (administradores, usuarios, hoteles).

**Detalles**:
- Realiza una consulta SQL que cuenta los usuarios por cada categoría.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.

### hotelesMasValorados

**Descripción**: Obtiene la cantidad de hoteles por cada calificación promedio.

**Detalles**:
- Realiza una consulta SQL que agrupa los hoteles por su calificación promedio.
- Devuelve los datos en formato JSON.
- En caso de error, devuelve un mensaje de error con el estado 500.
