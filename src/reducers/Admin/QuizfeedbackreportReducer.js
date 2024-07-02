import { FETCH_QUIZFEEDBACKREPORT_FAILURE, FETCH_QUIZFEEDBACKREPORT_REQUEST, FETCH_QUIZFEEDBACKREPORT_SUCCESS } from "../../actions/Admin/QuizFeedbackReportAction"

const initialState = {
    quizfeedbackreports: [],
    loading: false,
    error: null,
}

const QuizfeedbackreportReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_QUIZFEEDBACKREPORT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_QUIZFEEDBACKREPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                quizfeedbackreports: action.payload,
                error: null,
            };
        case FETCH_QUIZFEEDBACKREPORT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
export default QuizfeedbackreportReducer;