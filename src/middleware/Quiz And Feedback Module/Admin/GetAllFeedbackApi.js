import axios from "axios";
export const GetAllFeedbackApi = async (quizId) => {
  try {
    const response = await axios.get(`http://localhost:5199/api/QuizFeedback/GetFeedbackQuestionsByQuizId/${quizId}`);
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.message);
  }
}

