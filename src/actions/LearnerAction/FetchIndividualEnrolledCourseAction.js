export const GET_INDIVIDUAL_ENROLL_COURSE_REQUEST = 'GET_INDIVIDUAL_ENROLL_COURSE_REQUEST';
export const GET_INDIVIDUAL_ENROLL_COURSE_SUCCESS = 'GET_INDIVIDUAL_ENROLL_COURSE_SUCCESS';
export const GET_INDIVIDUAL_ENROLL_COURSE_FAILURE = 'GET_INDIVIDUAL_ENROLL_COURSE_FAILURE';
 
export const getIndividualEnrollCourseRequest = (courseId) => ({
  type: GET_INDIVIDUAL_ENROLL_COURSE_REQUEST,
  payload:courseId,
});
 
export const getIndividualEnrollCourseSuccess = (courses) => ({
  type: GET_INDIVIDUAL_ENROLL_COURSE_SUCCESS,
  payload: courses,
});
 
export const getIndividualEnrollCourseFailure = (error) => ({
  type: GET_INDIVIDUAL_ENROLL_COURSE_FAILURE,
  payload: error,
});

// export const setTopicsStatus = (isRequesting) => ({
//   type: SET_TOPICS_STATUS,
//   payload: isRequesting,
// });