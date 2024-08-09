import axios from "axios";
export const DeleteQuizDetails = async (quizId) => {
  console.log("delete quiz: ", quizId);
  try {
    const response = await axios.delete(
      `http://localhost:5199/api/Quiz/${quizId}`
    );
    console.log("Quiz deleted successful", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    throw error.message;
  }
};

export default DeleteQuizDetails;
