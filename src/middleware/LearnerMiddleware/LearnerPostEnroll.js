import { enrollRequest, enrollSuccess, enrollFailure ,ENROLL_REQUEST,SET_IS_ENROLL_COURSE} from '..//../actions/LearnerAction/LearnerPostEnrollAction';
 
export default function LearnerPostEnroll({ dispatch, getState }) {
    return (next) => (action) => {
        next(action);
 
        if (action.type === enrollRequest().type) {
            const { courseId } = action;
            const learnerId = sessionStorage.getItem('UserSessionID'); // Retrieve learner ID from session storage
            const enrollmentEndpoint = "http://localhost:5199/lxp/enroll";
            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: courseId,
                    learnerId: learnerId,
                    enrollmentDate: new Date().toISOString(),
                    enrollStatus: true,
                    enrollRequestStatus: true,
                }),
            };
 
            fetch(enrollmentEndpoint, request)
                .then((response) => {
                    if (response.ok) {
                        return response.json().then((data) => {
                            console.log("enroll success");
                            dispatch(enrollSuccess(courseId, learnerId)); // Include learnerId
                            return data;
                        });
                    } else {
                        return response.text().then((errorText) => {
                            console.error("Server Error Response:", errorText); // Log the error response text
                            throw new Error(errorText || "Enrollment failed. Please try again later.");
                        });
                    }
                })
                .catch((error) => {
                    console.error("Enrollment Error:", error);
                    dispatch(enrollFailure(error));
                });
        }
    };
}









// import  { useState } from 'react';
// import axios from 'axios';
// import { ENROLL_REQUEST,enrollSuccess,enrollFailure,SET_IS_ENROLL_COURSE,setIsEnrollCourse } from '../../actions/LearnerAction/LearnerPostEnrollAction';

// const API = 'http://localhost:5199/lxp/enroll';
 
// const LearnerPostEnroll = ({ dispatch, getState }) => (next) => async (action) => {
//   if (action.type === ENROLL_REQUEST) {
//     const { isRequestingenrolledCourse } = getState().enrolledCourses;
//     if (!isRequestingenrolledCourse) {
//       dispatch({ type: SET_IS_ENROLL_COURSE, payload: true });
//       try {
//         console.log("request payload", action.payload);
//         const response = await axios.post(API,action.payload, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
 
//         console.log('API Response:', response.data);
//         dispatch(enrollSuccess(response.data));
//       } catch (error) {
//         dispatch(enrollFailure(error));
//       } finally {
//         dispatch({ type: SET_IS_ENROLL_COURSE, payload: false });
//       }
//     }
//   }
//   return next(action);
// };
 
// export default LearnerPostEnroll;