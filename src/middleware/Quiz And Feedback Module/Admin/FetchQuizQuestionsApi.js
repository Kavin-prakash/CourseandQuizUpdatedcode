
import { FETCH_ALL_QUIZ_QUESTION_REQUEST, fetchAllQuizQuestionSuccess, fetchAllQuizQuestionFailure } from '../../../actions/Quiz And Feedback Module/Admin/FetchQuizQuestionsAction';
import axios from 'axios';
export const FetchQuizQuestionsApi = async (action) => {
        try {
            // console.log("sending quizId", action.payload);
            const response = await axios.get(`http://localhost:5199/api/QuizQuestions/GetAllQuestionsByQuizId?quizId=${action}`);
            // console.log("api questions:",response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching question: ", error.message);
        }

}