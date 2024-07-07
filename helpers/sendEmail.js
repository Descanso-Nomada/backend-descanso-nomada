import nodemailer  from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Función para enviar el código de seguridad al correo del usuario
function enviarCodigo (correo,usuario,codigo) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo,
        subject: `Hola ${usuario}`,
        text: "Código de seguridad!",
        html: `
        <div style=
        "background-color: rgb(113 223 239 / 37%);
        padding: 15px;
        border-radius: 5px;
        ">
        <h2 style="
            text-align: center;
            font-family: system-ui;
            color: white;
            text-shadow: 1px 2px 5px black;
            background-color: rgba(0, 140, 255, 0.795);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 1px 4px 8px 0px #00000070;
            ">Código de seguridad
        </h2>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Hola ${usuario}, este es tu código de seguridad, no es necesario que lo guardes, copia y pégalo en la ventana de confirmación para recuperar tu cuenta.</p>
        <h3 style="text-align: center;"><strong style="
            background-color: rgba(238, 150, 87, 0.685);
            padding: 10px;
            font-family: system-ui;
            ">${codigo}
            </strong>
        </h3>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Gracias por usar nuestros servicios, <strong>DESCANSO NÓMADA 2024</strong>
        </p>
    </div>
    `,
    });
    }
    main().catch(console.error);
}

// Función para enviar un correo de confirmación de reservación al usuario
function enviarCorreoReservación (correo,usuario, hotel, objetoHabitación) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo, 
        subject: `Hola ${usuario}`, 
        text: "Reservación Aceptada!", 
        html: `
        <div style=
        "background-color: rgb(113 223 239 / 37%);
        padding: 15px;
        border-radius: 5px;
        ">
        <h2 style="
            text-align: center;
            font-family: system-ui;
            color: white;
            text-shadow: 1px 2px 5px black;
            background-color: rgba(0, 140, 255, 0.795);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 1px 4px 8px 0px #00000070;
            ">Reservación aceptada
        </h2>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Hola ${usuario}, se informa que el hotel {Aquí debe de ir el nombre del hotel} a realizado la reserva de su habitación</p>
        <h3 style="text-align: center;"><strong style="
            padding: 10px;
            font-family: system-ui;
            ">Aquí deben de ir los detalles de la habitación....
            </strong>
        </h3>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Gracias por usar nuestros servicios, <strong>DESCANSO NÓMADA 2024</strong>
        </p>
    </div>
    `,
    });
    }
    main().catch(console.error);
}

// Función para enviar un correo de confirmación de registro a un hotel
function enviarCorreoConfirmarHotel (correo, usuario) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo, 
        subject: `Hola ${usuario}`, 
        text: "Solicitud Aceptada!", 
        html: `
        <div style=
        "background-color: rgb(113 223 239 / 37%);
        padding: 15px;
        border-radius: 5px;
        ">
        <h2 style="
            text-align: center;
            font-family: system-ui;
            color: white;
            text-shadow: 1px 2px 5px black;
            background-color: rgba(0, 140, 255, 0.795);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 1px 4px 8px 0px #00000070;
            ">Cuenta registrada con éxito
        </h2>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Hola ${usuario}, se informa que la cuenta fue creada, ya puede ingresar a nuestra plataforma y compartir información.</p>
        <p style="
            font-size: 15px;
            font-family: system-ui;
            ">Gracias por usar nuestros servicios, <strong>DESCANSO NÓMADA 2024</strong>
        </p>
    </div>
    `,
    });
    }
    main().catch(console.error);
}

// Función para enviar una factura al correo del usuario
function enviarFactura(correo, usuario, tipo_habitacion, descripcion, precio, cantidad, total) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    let isv = total*(15/100);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.KEY_MAIL
        }
    });

    async function main() {
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com',
        to: correo, 
        subject: `Hola ${usuario}`, 
        text: "Factura", 
        html: `
        <div style="
            font-family: system-ui;
            padding: 20px;
            max-width: 600px;
            margin: auto;
            background-color: #f7f7f7;
            border-radius: 10px;">
            <h2 style="
                text-align: center;
                color: white;
                background-color: rgba(0, 140, 255, 0.795);
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 20px;">
                Detalle de la factura
            </h2>
            <p style="font-size: 15px; color: #333; margin-bottom: 20px;">
                Hola ${usuario}, a continuación se muestra el detalle de tu factura:
            </p>
            <h3 style="
                background-color: #c0caca;
                color: black;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;">
                Fecha: ${formattedDate} Hora: ${formattedTime}
            </h3>
            <div style="
                border-radius: 5px;
                background-color: #eeeeee;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>Habitación:</strong>
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        ${tipo_habitacion}
                    </p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>Precio:</strong>
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        L. ${precio}
                    </p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>Descripción:</strong> 
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        ${descripcion}
                    </p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="font-size: 15px; color: #333; margin: 0;">
                        <strong>No. Noches:</strong> 
                    </p>
                    <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                        ${cantidad}
                    </p>
                </div>
                <div style="padding: 15px; border-top: 2px solid #ddd; margin-top: 20px;">
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 15px; color: #333; margin: 0;">
                            <strong>Subtotal:</strong>
                        </p>
                        <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                            L. ${total}
                        </p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 15px; color: #333; margin: 0;">
                            <strong>ISV (15%):</strong>
                        </p>
                        <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                            L. ${isv}
                        </p>
                    </div>
                    <hr style="color:#ddd"></hr>
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 15px; color: #333; margin: 0;">
                            <strong>Total:</strong>
                        </p>
                        <p style="font-size: 15px; color: #333; margin: 2; text-align: right;">
                            L. ${total + isv}
                        </p>
                    </div>
                </div>
            </div>
            <p style="font-size: 15px; color: #333; text-align: center;">
                Gracias por usar nuestros servicios
            </p>
            <p style="font-size: 15px; color: #333; text-align: center;">
                <strong>DESCANSO NÓMADA 2024</strong>
            </p>
        </div>
    `,
    });
    }
    main().catch(console.error);
}



export { enviarCodigo, enviarCorreoReservación, enviarCorreoConfirmarHotel, enviarFactura }