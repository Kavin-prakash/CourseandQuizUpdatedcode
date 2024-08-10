import { LOGIN_REQUEST, successdata, loginSuccessadmin, loginSuccessuser, loginError, loginPasswordMessage, loginEmaildMessage } from '../../actions/Admin/loginAction';
import axios from "axios";
import { baseUrl } from "./api";
const LoginUser = ({ dispatch }) => (next) => async (action) => {

  if (action.type === LOGIN_REQUEST) {
    try {
      const response = await axios.post(`${baseUrl}/api/Login/LoginLearner`, action.payload);  // email and password
      console.log('API Response:', response.data); // Log the response data
      dispatch(successdata(response.data));
    } catch (error) {
      console.error('API Error:', error.message);
      dispatch(loginError(error.message));
    }
  }
  return next(action)
};


export default LoginUser;
