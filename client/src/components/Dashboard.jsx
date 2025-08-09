import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../slice/authSlice'
import { API } from '../utils/constants'
import Schedule from './Schedule'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate =useNavigate()
  const [visits, setVisits ] = useState([])
  const [patients,setPatients] = useState([{id : 1, name:'Suresh'}])
  const user = useSelector(state=>state?.auth)


  const fetchVisits = async()=>{
    const res = await axios.get(API+'/visits', {params : user?.ref_id,headers: {Authorization : `Bearer ${user?.token}`,'Content-Type':'application/json'}})
   
    if([200,201].includes(res?.status)){
      setVisits(res?.data)
    }
   }
  useEffect(()=>{ 
     fetchVisits()
  },[])


  useEffect(()=>{
    const fetchPatients = async()=>{
     const res = await axios.get(API+'/patients', {headers: {Authorization : `Bearer ${user?.token}`,'Content-Type':'application/json'}})
     if([200,201].includes(res?.status)){
       setPatients(res?.data)
     }
    }
    fetchPatients()
 },[])

  return (
    <section className='w-full'>
      <nav className='shadow-2 p-2 flex items-center justify-between border-b border-b-gray-300 '>
        <div className='flex gap-2 items-center font-extrabold text-2xl'>
          <img src='woundtech.jpeg' width={40} />
          Wound Tech
        </div>
        <div className='flex gap-2 items-center'>
        <p>Suneel</p>
        <img src='avatar.jpg' width={40} />
        <button className='text-blue-400' onClick={()=>{dispatch(logout()); navigate('/login')}}>Logout</button>
        </div>
      </nav>
      <div className='border-t-amber-200 '>
      <Schedule  user={user} visits={visits}  patients={patients} fetchVisits={fetchVisits} />
      </div>
    </section>
  )
}

export default Dashboard
