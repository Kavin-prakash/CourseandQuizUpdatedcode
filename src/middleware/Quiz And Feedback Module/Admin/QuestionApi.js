import axios from 'axios';
import { DELETE_QUIZ_QUESTION_REQUEST, deleteQuizQuestionSuccess, deleteQuizQuestionFailure } from '../../../actions/Quiz And Feedback Module/Admin/DeleteQuizQuestionAction';
import { UPDATE_QUIZ_QUESTION_REQUEST, updateQuizQuestionSuccess, updateQuizQuestionFailure } from '../../../actions/Quiz And Feedback Module/Admin/UpdateQuizQuestionAction';

export const BulkUploadQuestion = async (files, quizId) => {
  console.log("api file",files, quizId);
  if (files) {
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:5199/api/ExcelToJson/ConvertExcelToJson?quizId=${quizId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("BulkUploadQuestion", response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  } else {
    console.log("no file")
  }
};

export const GetOpenEditQuestionModal = async (quizQuestionId) => {
  try {
    const response = await axios.get(`http://localhost:5199/api/QuizQuestions/GetQuestionById?quizQuestionId=${quizQuestionId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error.message;
  }
}

export const DeleteQuizQuestionsApi = ({ dispatch }) => (next) => async (action) => {
  if (action.type === DELETE_QUIZ_QUESTION_REQUEST) {
    try {
      console.log("deleting questionId", action.payload);
      const response = await axios.delete(`http://localhost:5199/api/QuizQuestions/DeleteQuestion?quizQuestionId=${action.payload}`);
      console.log("api questions:", response.data);
      dispatch(deleteQuizQuestionSuccess(response.data));
    } catch (error) {
      console.log("Error fetching question: ", error.message);
      dispatch(deleteQuizQuestionFailure(error.message));
    }
  }
  return next(action);
}



export const UpdateQuizQuestionsApi = async (action) => {

  try {
    console.log("updatingting questionId", action);
    const response = await axios.put(`http://localhost:5199/api/QuizQuestions/UpdateQuestion?quizQuestionId=${action.quizQuestionId}`, action);
    console.log("update api questions:", response.data);
  } catch (error) {
    console.log("Error fetching question: ", error.message);
  }

}


export const PostSingleQuestion = async (requestBody) => {
  console.log("single question: ", requestBody)
  try {
    const response = await axios.post('http://localhost:5199/api/QuizQuestions/AddQuestion', requestBody);
    console.log("single question response: ", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error.message;
  }
}