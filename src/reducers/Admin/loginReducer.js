
import { LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS_ADMIN, LOGIN_SUCCESS_USER, LOGIN_PASSWORD_MESSAGE, LOGIN_EMAIL_MESSAGE, SUCCESS_DATA } from "../../actions/Admin/loginAction";
const initialState = {
  user: null,
  loading: false,
  error: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case SUCCESS_DATA:
      // console.log("successdata",action.payload);
      return { ...state, loading: false, user: action.payload, error: null };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;