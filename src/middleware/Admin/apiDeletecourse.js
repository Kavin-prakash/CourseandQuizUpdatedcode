
import axios from 'axios';
import {
  DELETE_COURSES_REQUEST,
  deleteCoursesSuccess,
  deleteCoursesFailure,
  delteCoursesFailureMessage
} from '../../actions/Admin/DeletecourseAction';

// Ensure the API_URL ends with a forward slash
const API_URL = 'http://localhost:5199/lxp/coursedelete/';

const apiDeletecourse = ({ dispatch }) => (next) => async (action) => {
  next(action);

  if (action.type === DELETE_COURSES_REQUEST) {
    console.log("deleteapi",action.payload) // The ID should be part of the action payload
    const deleteEndpoint = `${API_URL}${action.payload}`; // Append the courseId to the endpoint

    try {
      const response = await axios.delete(deleteEndpoint);

      console.log('API for delete Response:', response.data); // Log the response data 
      console.log("Api message",response.data.message);

      if (response.status === 200) {
        dispatch(deleteCoursesSuccess(response.data.message));
      }
       if(response.status === 405)
      {
        dispatch(delteCoursesFailureMessage(response.data.message));
      }  
      else {
        // If the API response is not successful, dispatch a failure action
        dispatch(deleteCoursesFailure(response.data));
      }
    } catch (error) {
      console.error('API Error:', error.message);
      dispatch(deleteCoursesFailure(error.message));
    }
  }
  return next(action)
};

export default apiDeletecourse;
