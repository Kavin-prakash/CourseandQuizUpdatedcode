import axios from 'axios';
const BASE_URL = 'http://localhost:5199/lxp/learner/registration';

const RegisterApi = async (action) => {
  try {
    console.log("asdads", action);
    const response = await axios.post(BASE_URL, action, {
      headers: {
        // Add CORS headers
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
    console.log('API Response:', response.data);
  } catch (error) {
    console.log("error post", error);
  }
}

export default RegisterApi;
