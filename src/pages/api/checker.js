


    export default async function handler(req, res) {
      const {link} = req.query

      try {
        const resp =  await fetch(link, {
          method: 'GET'
        })
        const data = await resp.json()

        console.log('data: ', data)
        res.status(200).json(data)
      } catch (ex) {
        console.error('Error fetching data:', ex);
        // return NextResponse.json({ message: `Error Fetching from API: ${ex}` }, { status: 500 });
        res.status(500).json({message: `Error Fetching from api: ${ex}`})
      }
    }