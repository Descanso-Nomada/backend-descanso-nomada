import Express from 'express';
const apiImagenes = Express();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage:storage});
import { insertImgHabitacion,insertImgHotel,imagenesHotel,imagenesHabitacion,eliminarImgHabitacion,eliminarImgHotel } from '../controllers/imgController.js';

apiImagenes.post('/habitacion', upload.single('image'),insertImgHabitacion);
apiImagenes.get('/habitacion',imagenesHabitacion);
apiImagenes.delete('/habitaciones/:id',eliminarImgHabitacion)

apiImagenes.post('/hoteles', upload.single('image'),insertImgHotel);
apiImagenes.get('/hotels',imagenesHotel);
apiImagenes.delete('/hoteles/:id',eliminarImgHotel);

export{
    apiImagenes
}