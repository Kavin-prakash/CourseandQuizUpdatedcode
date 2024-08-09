import axios from 'axios';
import { CREATE_EMAIL_REQUEST, userEmailSuccess, userEmailFailure, SET_IS_REQUESTING_OTP } from '..//../actions/LearnerAction/Fetchemail';

const API = 'http://localhost:5199/api/Email/EmailVerification';
const fetchEmailApi = async (action) => {

  try {
    console.log("otp request", action);
    const response = await axios.post(API, JSON.stringify(action), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('API otp Response:', response.data.otp);
    return response.data.otp;
  } catch (error) {
    console.log("errpr");
  } 

};

export default fetchEmailApi;