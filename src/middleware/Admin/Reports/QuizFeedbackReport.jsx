import axios from 'axios';
import { FETCH_QUIZFEEDBACKREPORT_REQUEST, FetchQuizFeedbackReportFailure, FetchQuizFeedbackReportSuccess } from '../../../actions/Admin/QuizFeedbackReportAction';
const QuizFeedbackReport = ({ dispatch }) => (next) => async (action) => {
    next(action);
    if (action.type === FETCH_QUIZFEEDBACKREPORT_REQUEST) {
        try {
            const response = await axios.get(`http://localhost:5199/api/FeedbackResponseDetails/quiz`);
            if (response.status === 200 && response.data.length > 0) {
                dispatch(FetchQuizFeedbackReportSuccess(response.data));
            }
            else {
                console.error("No data received from API");
            }
        } catch (error) {
            dispatch(FetchQuizFeedbackReportFailure(error.message));
        }
    }
};

export default QuizFeedbackReport;
