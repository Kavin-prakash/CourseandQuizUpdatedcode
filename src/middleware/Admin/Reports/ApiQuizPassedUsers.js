import axios from "axios";
import { FETCH_QUIZ_REQUEST_USERS, fetchquizpassedusersSuccess, fetchquizpassedusersFailure } from "../../../actions/Admin/QuizPassedUserAction";

const ApiQuizPassedUsers = ({ dispatch }) => (next) => async (action) => {
    next(action);

    if (action.type === FETCH_QUIZ_REQUEST_USERS) {

        // Assuming quizid is part of the action's payload

        const quizid = action.payload;
        // debugger

        console.log("API-Quizpassedusers", quizid);

        try {
            const response = await axios.get(`http://localhost:5199/api/QuizReport/QuizReport/passedlearnersReport/${quizid.quizId}!`);

            console.log("QuizPassedUserAction", response.data);

            // debugger
            if (response.status === 200 && response.data.data.length > 0) {

                console.log("FetchQuizPassedUsers", response.data.data);
                dispatch(fetchquizpassedusersSuccess(response.data.data));
            }
            else {
                console.error("No data received from API");
            }
        } catch (error) {
            dispatch(fetchquizpassedusersFailure(error.message));
        }
    }
};

export default ApiQuizPassedUsers;
