import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_SCORE_THRESHOLD = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

export async function POST(request) {
    const { email, phone, name, service, message, recaptchaToken } = await request.json();

    // Verifica reCAPTCHA
    if (!recaptchaToken) {
        return Response.json(
            { error: 'reCAPTCHA token required' },
            { status: 400 }
        );
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return Response.json(
            { 
                error: 'reCAPTCHA verification failed',
                score: recaptchaData.score 
            },
            { status: 400 }
        );
    }

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
        return NextResponse.json(
            { 
                success: true,
                message: 'Email sent successfully',
                score: recaptchaData.score 
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
