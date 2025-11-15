import { useForm } from "react-hook-form";

import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";


function Register() {

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYzMDQ5NDk0LCJpYXQiOjE3NjI0NDQ2OTQsImp0aSI6Ijg1NjYwMzE2YTg3ZDQ2YWQ5MjM2MTdlYTM2OThmNzU4IiwidXNlcm5hbWUiOiJhZG1pbjEifQ.TU_DPXMB7xnA2XazlDNHmGkc32XOqjw1R--dBiZ3ohA'
  //   {
  //     "username":"admin",
  //     "first_name": "Nur mamun",
  //     "password":"123",
  //     "email":"anmamun0@gmail.com"
  // }

  const pushToNextRoute = useNavigate();

  //  use navigation check state 

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();
  const onSubmit =async (data) => {
    console.log(data);





    try {
      const res =await baseApi.post('/auth/users/register/', data);

    const responseData = await res.data;
    console.log(responseData);


    localStorage.setItem("token" , responseData?.access);
    


    // send email varifaction

    const send_otp_Email = data?.email;

    const emailResponse = await baseApi.post('/auth/me/email/request-verify/', {email: send_otp_Email } , {
       
    headers: {
      'Authorization': `Bearer ${responseData?.access}`,
      'Content-Type': 'application/json'
    }
  
    });
    const emailData = await emailResponse.data;
    console.log(emailData);

    
    toast("Send OTP to your email please verify");



    pushToNextRoute('/auth/otp-verify')



      
    } catch (error) {
      console.log(error);

      toast(`Error is ${error.name + error.message}`)

      
    }



  }

  return (
    <div>

      <Toaster position="top-left "  reverseOrder={false}/>
      <form onSubmit={handleSubmit(onSubmit)} className="flex  flex-col gap-y-5 ">

        <div className="flex  text-center mx-auto">
          <Typography variant="h4" className="text-3xl">Confirm your Registation</Typography>
        </div>
        <TextField
        fullWidth
          type="text"
          label="user name"
        placeholder="Enter your user name"
          {...register("username")}
          variant="outlined"
          margin="none"
        />

        <TextField fullWidth label="First Name" margin="none" variant="outlined" type="text" {...register("firstname", { required: true })} placeholder="Enter your first name" />

        <TextField
        fullWidth
        variant="outlined"
        margin="none"
        label="password"
          type="password"
          {...register("password", { required: true })}
        />
        <TextField fullWidth variant="outlined" margin="none" label="email" type="text" {...register("email", { required: true })} /> 

        {errors.exampleRequired && <span>This field is required</span>}

        
        <div className="flex  mx-auto">

          <Button  className="md:w-50 w-40 h-10  text-2xl font-bold"  variant="contained" color="primary" type="submit">
          Submit
        </Button>
        </div>
        
      </form>
    </div>
  );
}

export default Register;
