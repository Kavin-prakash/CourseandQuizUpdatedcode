import {
  SET_QUIZ_DETAILS_REQUEST,
  setQuizDetailsSuccess,
  setQuizDetailsFailure,
} from "../../../actions/Quiz And Feedback Module/Admin/CreateQuizAction";
import axios from "axios";

const API_URL = "http://localhost:5199/api/Quiz";

export const CreateQuizApi =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type === SET_QUIZ_DETAILS_REQUEST) {
      try {
        console.log("Creating", action.payload);
        const response = await axios.post(API_URL, action.payload);
        console.log("feed Post API Response:", response.data);
        dispatch(setQuizDetailsSuccess(response.data.data));
      } catch (error) {
        console.error("API Error:", error.message);
        dispatch(setQuizDetailsFailure(error.message));
        throw error; // Throw the error for better error handling
      }
    }
    return next(action);
  };

export default CreateQuizApi;
