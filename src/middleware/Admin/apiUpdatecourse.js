import axios from 'axios';
import {
  UPDATE_COURSES_REQUEST,
  updateCoursesSuccess,
  updateCoursesFailure
} from '../../actions/Admin/Updatecourse';

const UpdateCourseMiddleware = ({ dispatch }) => (next) => async (action) => {
  if (action.type === UPDATE_COURSES_REQUEST) {
    const { courseId, formData } = action.payload; // Destructure the courseId and formData from the payload

    if (!courseId) {
      console.error('API Error: courseId is undefined');
      dispatch(updateCoursesFailure('Course ID is undefined.'));
      return next(action);
    }

    const API_URL = `http://localhost:5199/api/Course/lxp/courseupdate`;

    try {
      console.log("l" + formData);
      console.log(formData);
      const response = await axios.put(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200)
       {
        dispatch(updateCoursesSuccess(response.data.message));
        console.log("updatecourseapiresponse", response.data);
      }
      else {
        console.error('No data received from API');
      }

    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      dispatch(updateCoursesFailure(error.message));
    }
  }
  return next(action);
};

export default UpdateCourseMiddleware;
