

import axios from "axios";

import {
  FETCH_LEARNERSCORE_REQUEST,
  fetchlearnerscoreSuccess,
  fetchlearnerscoreFailure,
} from "../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";

const baseUrl = "http://localhost:5199";
const LearnerScorePageApi =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type === FETCH_LEARNERSCORE_REQUEST) {
      // debugger;
      const learnerattemptid = action.payload;
      try {
        const API_URL = `${baseUrl}/api/QuizEngine/attempts/${learnerattemptid}/result`;
        console.log("learnerscore", API_URL);
        const response = await axios.get(API_URL);
        console.log("learner score", response.data);
        dispatch(fetchlearnerscoreSuccess(response.data));
      } catch (error) {
        console.error(
          "API ERROR",
          error.response ? error.response.data.data : error.message
        );
        dispatch(fetchlearnerscoreFailure(error.message));
      }
    }
    return next(action);
  };




export default LearnerScorePageApi