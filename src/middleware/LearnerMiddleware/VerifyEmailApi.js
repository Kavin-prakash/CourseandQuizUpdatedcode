import  { useState } from 'react';
import axios from 'axios';
import { CREATE_OTP_REQUEST,userOTPSuccess,userOTPFailure } from '..//..//actions/LearnerAction/OTPAction';
const VerifyEmailApi = ({dispatch})=> (next) =>async(action)=>{
    if(action.type === CREATE_OTP_REQUEST)
    {
        console.log("api email",action.payload.email);
        console.log("api otp",action.payload.otp);
        console.log("check otp");
        try{
            const response= await axios.post(`http://localhost:5199/api/Email/VerifyOTP`,action.payload);
            console.log('Api Response:',response.data)
            dispatch(userOTPSuccess(response.data.otp))
            console.log("lev",action.payload)
        }
        catch(error){
            dispatch(userOTPFailure(error))
        }
    }
    return next(action)
};

export default VerifyEmailApi;