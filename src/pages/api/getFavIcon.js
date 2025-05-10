// import axios from '../../req/axios-url';
import { NextResponse } from 'next/server';

// import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler (req , res) {
    const {domain} = req.query
    try {

      const response = await fetch(`https://${domain}/favicon.ico`);
      const data = await response.json()
      res.status(200).json(data)
    } catch (ex) {
      console.error('Error fetching data:', ex);
      res.status(500).json({message: `Error Fetching from api: ${ex}`})

    }

}