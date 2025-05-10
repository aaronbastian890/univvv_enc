import { NextResponse } from 'next/server';

// export const runtime = 'edge';

export default  async function handler (req , res) {
  // 'use server'
  const domain = new URLSearchParams(req.nextUrl['domain'])
  console.log('domain: ', domain)
  // try {
  //   // let qs = `?start=1&limit=5000&convert=USD`
  //   const response = await fetch(`https://${domain}/favicon.ico`);
  //   const data = await response.json()
  //   console.log('data: ', data)
  //   return NextResponse.json(data)
  // } catch (ex) {
  //   console.log('er: ',ex);
  //   return NextResponse.json({ message: `Error Fetching from API: ${ex.message}` }, { status: 500 });
  // }
}