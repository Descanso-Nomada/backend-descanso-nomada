import nodemailer  from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'descansonomada@gmail.com', // sender address
        to: correo, // list of receivers
        subject: `Hola ${usuario}`, // Subject line
        text: "Código de seguridad!", // plain text body
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
    `, // html body
    });
    }

    main().catch(console.error);
}

export { enviarCodigo }