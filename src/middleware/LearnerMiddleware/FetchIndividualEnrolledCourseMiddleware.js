import axios from 'axios';
import { GET_INDIVIDUAL_ENROLL_COURSE_REQUEST,getIndividualEnrollCourseSuccess,getIndividualEnrollCourseFailure  } from '../../actions/LearnerAction/FetchIndividualEnrolledCourseAction';
 
const IndividualEnrollCourseApi = ({ dispatch }) => (next) => async (action) => {
  next(action);
  // console.log("coursegetapi", action)
  const API_URL = `http://localhost:5199/lxp/enroll/${sessionStorage.getItem("UserSessionID")}/course/${action.payload}/topic`;
 
  if (action.type === GET_INDIVIDUAL_ENROLL_COURSE_REQUEST) {
    try {
      console.log("learnerapicomponent:", action);
      const response = await axios.get(`${API_URL}`);
      // console.log(`${API_URL}${action.payload}`);
      console.log('API  mycourse Response:', response.data); // Log the response data
 
      if (response.data.statusCode == 200 && response.data.data) {
        const courses = response.data.data; // Extract the courses array
        console.log(courses);
        dispatch(getIndividualEnrollCourseSuccess(courses));
      } else {
        console.error('No valid data received from API');
        dispatch(getIndividualEnrollCourseFailure('No valid data received from API'));
      }
    } catch (error) {
      console.error('API Error:', error.message);
      dispatch(getIndividualEnrollCourseFailure(error.message));
    }
  }
};
export default IndividualEnrollCourseApi;