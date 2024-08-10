import axios from 'axios';
// import { CREATE_QUIZFEEDBACK_REQUEST, createquizfeedbackSuccess, createquizfeedbackFailure, createquizfeedbackRequest, CREATE_QUIZFEEDBACK_SUCCESS } from '../../actions/Quiz And Feedback Module/QuizFeedbackAction';

const API_URL = 'http://localhost:5199/api/QuizFeedback/AddFeedbackQuestion';

export const QuizFeedbackApi = async (action) => {

  try {
    console.log("post quiz", action);
    const response = await axios.post(API_URL, action);
    console.log('feed Post API Response:', response.data); // Log the response data
  } catch (error) {
    console.error('API Error:', error.message);
  }

};