import axios from 'axios';
import { CREATE_COURSES_REQUEST, createCoursesSuccess, createCoursesFailure, createcontent, createCoursesExists, SET_COURSE_STATUS } from '../../../actions/Course/Course/AddCourseAction'


const API_URL = 'http://localhost:5199/lxp/course';

const addCourse = ({ dispatch, getState }) => (next) => async (action) => {
  if (action.type === CREATE_COURSES_REQUEST) {
    const ReducerData = getState().addcourse;

    if (!ReducerData.isRequesting) {
      dispatch({ type: SET_COURSE_STATUS, payload: true });
      try {
        const response = await axios.post(API_URL, action.payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('API Response:', response.data);

        if (response.data.statusCode === 412) {

          dispatch(createCoursesExists());
        } else {
          dispatch(createCoursesSuccess(response.data.data.courseId));
        }
      } catch (error) {
        console.error('API Error:', error.message);
        dispatch(createCoursesFailure(error.message));
      } finally {
        dispatch({ type: SET_COURSE_STATUS, payload: false });
      }
    }
  }
  return next(action);
};

export default addCourse;