// middleware/submitAttemptMiddleware.js
import axios from 'axios';
import { SUBMIT_ATTEMPT_REQUEST, submitAttemptSuccess, submitAttemptFailure } from '../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';

const submitAttemptMiddleware = ({ dispatch }) => (next) => (action) => {
    if (action.type === SUBMIT_ATTEMPT_REQUEST) {
        const { AttemptId } = action.payload;
        console.log("Middleware - Attempt ID:", AttemptId);

        if (AttemptId) {
            return axios.post(`http://localhost:5199/api/QuizEngine/attempt/submit?attemptId=${AttemptId}`)
                .then(response => {
                    console.log("API Response:", response.data);
                    dispatch(submitAttemptSuccess(response.data));
                })
                .catch(error => {
                    console.error("API Error:", error.message);
                    dispatch(submitAttemptFailure(error.message));
                });
        } else {
            console.error("Attempt ID is undefined in middleware");
            return Promise.reject("Attempt ID is undefined");
        }
    }

    return next(action);
};

export default submitAttemptMiddleware;