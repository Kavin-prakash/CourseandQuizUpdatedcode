export const FETCH_QUIZFEEDBACKREPORT_REQUEST = 'FETCH_QUIZFEEDBACKREPORT_REQUEST';
export const FETCH_QUIZFEEDBACKREPORT_SUCCESS = 'FETCH_QUIZFEEDBACKREPORT_SUCCESS';
export const FETCH_QUIZFEEDBACKREPORT_FAILURE = 'FETCH_QUIZFEEDBACKREPORT_FAILURE';

export const FetchQuizFeedbackReportRequest = () => ({
    type: FETCH_QUIZFEEDBACKREPORT_REQUEST,
});
export const FetchQuizFeedbackReportSuccess = (quizfeedbackreports) => ({
    type: FETCH_QUIZFEEDBACKREPORT_SUCCESS,
    payload: quizfeedbackreports,
});
export const FetchQuizFeedbackReportFailure = (error) => ({
    type: FETCH_QUIZFEEDBACKREPORT_FAILURE,
    payload: error,
})