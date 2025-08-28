import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    const { email, phone, name, service, message } = await request.json();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "info.almastack@gmail.com",
            pass: "skhgyjjmvlizqowu",
        },
    });

    const mailOptions = {
        from: "info.almastack@gmail.com",
        to: "info.almastack@gmail.com",
        subject: `Richiesta di contatto da Landing Page Almastack`,
        html: `Name: ${name};<br />
        Email: <a href="mailto:${email}">${email}</a>;<br />
        Telefono: <a href="tel:${phone}">${phone}</a>;<br />
        Servizio: ${service};<br />
        Messaggio: <br />
        ${message}
        `,
    };

    const sendMailPromise = () =>
        new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (err) {
                if (!err) {
                    resolve('Email sent');
                } else {
                    reject(err.message);
                }
            });
        });

    try {
        await sendMailPromise();
        return NextResponse.json({ message: 'Email sent' });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
