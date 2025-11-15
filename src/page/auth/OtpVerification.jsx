

import { Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MuiOtpInput } from 'mui-one-time-password-input'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import { baseApi } from '../../utils/baseUrl'

function OtpVerification() {
      const [otp, setOtp] = useState('');
      const [ email , setEmail ] = useState("")

  const handleChange = (newValue) => {
    setOtp(newValue)
  }
  

  const handleSubmit =async (e)=>{

    console.log(" otp " , otp);


    if(otp.length==0 || otp.length<3)
    {
      toast("Please Enter Valid otp");
      return;  
    }

    // call verify otp

    const data ={
      email:email,
      otp:otp
    }

    try {

        const res = await baseApi.post('/auth/user/forgot-password/verify-otp/', data);
        const resData = res.data;
        console.log(resData)
        

        if(resData.success)
        {
          toast('Verify successfully');
        }
        
    } catch (error) {

        console.log(error);
        
    }


  }


  return (
    <div>
        <Toaster/>

        <Typography variant='h4'>Verify your otp</Typography>

        <TextField onChange={(e)=> setEmail(e.target.value)} variant='outlined' placeholder='Enter your email'/>


          <MuiOtpInput length={6}  value={otp} onChange={handleChange} className='text-2xl font-bold' />

          <Button color='primary' variant='contained'  onClick={handleSubmit}>Submit Otp</Button>
      
    </div>
  )
}

export default OtpVerification
