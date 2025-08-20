import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../slice/authSlice';
import { API } from '../utils/constants';

const Auth = ({mode}) => {
   const location = useLocation()
   const navigate = useNavigate()
   const path =location.pathname?.slice(1)
   const dispatch =useDispatch()
    const [data,setData] = useState({
        username:'',
        password : '',
        mode : path || mode,
        role :'clinician'
    })
 
    const handleData = (e)=>{
let name = e.target.name;
let value = e.target.value 
   setData({...data, [name]:value})
    }

    const handleDisable=()=>{
        if(data?.mode ==='register')  
        return !data?.name || !data?.password || !data?.username 
    else if(data?.mode ==='login'){
    return !data?.username || !data?.password}
    else return false
    }
   
    const handleSubmit=async(e)=>{
e.preventDefault();
        if(data?.mode ==='register'){
            let payload = {name : data?.name,username : data?.username,password : data?.password,role : data?.role}
            payload.role ==='patient' ? payload.date_of_birth= data?.dob : payload.speciality = data?.speciality
            const res =await axios.post(API+'/register',payload,         
            )         
        }
        else{
            let payload = {username : data?.username,password : data?.password,role : data?.role}
            const res =await axios.post(API+'/login',payload)          
            dispatch(loginSuccess(res?.data))          
            navigate('/')
        }
    }

    useEffect(()=>{
       setData({...data,mode :path})
    },[path])
  return (
    <main className='flex justify-center items-center h-screen bg-violet-300 rounded-2xl'>
<section>
     <form className=' h-auto w-[400px] rounded-2xl p-6 mb-4' onSubmit={handleSubmit}>
       <div className=' flex items-center justify-center'>
       <img src='woundtech.jpeg' width={100}  />
       </div>
       {data?.mode ==='login' ? (
        <>
       <div className='py-4 px-5 flex flex-col gap-3 '>
       <label className='text-left'> Username</label>
       <input name='username' className='outline-none border-gray-400 border text-white bg-black rounded-lg p-1 ' value={data?.username} onChange={handleData} />
       <label className='text-left mt-2'> Password</label>
       <input type='password' name='password' className='text-white bg-black outline-none   rounded-lg p-1' value={data?.password} onChange={handleData} />
       </div>
        
       <div className='pt-1 flex items-center justify-center gap-10'>
         <label >
       <input type="radio" name="role" className='me-2' value='patient' checked={data.role === 'patient'} onChange={handleData}
 />Patient</label>
 <label>
 <input type="radio" name="role" className='me-2' value='clinician' checked={data.role === 'clinician'} onChange={handleData}
 />Clinician</label>
   </div>
   <span className='text-end flex justify-end mt-2'><NavLink to='/register' className='mt-2 underline text-end  text-black'>Want to register?</NavLink>
   </span>
       </>) :(
        <>   
       <div className='py-4 px-5 flex flex-col gap-3 '>
       <label className='text-left'> Name</label>
       <input name='name' autoComplete='off' className='outline-none border-gray-400 border text-white bg-black rounded-lg p-1 ' value={data?.name} onChange={handleData} />
     
       <label className='text-left'> Username</label>
       <input name='username' className='outline-none border-gray-400 border text-white bg-black rounded-lg p-1 ' value={data?.username} onChange={handleData} />
       <label className='text-left mt-2'> Password</label>
       <input type='password'  value={data?.password} onChange={handleData} name='password' className='text-white bg-black outline-none   rounded-lg p-1' />
     
      {data?.role==='clinician' && 
      <> <label className='text-left mt-2'> Speciality</label>
       <input name='speciality' className='text-white bg-black outline-none   rounded-lg p-1' /></>}
       
       {data?.role==='patient' &&<>
       <label className='text-left'> Date of Birth</label>
       <input type='date' className='outline-none border-gray-400 border text-white bg-black rounded-lg p-1 ' name='dob' value={data?.dob} onChange={handleData} />
       </>}
       </div>
       
    
       <div className='pt-1 flex items-center justify-center gap-10'>
         <label >
       <input type="radio" name="role" className='me-2' value='patient' checked={data.role === 'patient'} onChange={handleData}
 />Patient</label>
 <label>
 <input type="radio" name="role" className='me-2' value='clinician' checked={data.role === 'clinician'} onChange={handleData}
 />Clinician</label>
   </div>
   <span className='text-end flex justify-end mt-2'><NavLink to='/login' className='mt-2 underline text-end  text-black'>Want to Login?</NavLink>
   </span> 
        </>
       )}
        
         <button className='p-4 w-full mt-4 hover:scale-105 disabled:opacity-50' disabled={handleDisable()}>{data?.mode}</button>
   
      </form>
</section>
</main>
  )
}

export default Auth
