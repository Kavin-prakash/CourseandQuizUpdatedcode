import React from "react";
import { Provider } from "react-redux";
import store from "../../Store/Store";
import ReviewQuestions from "../../components/Quiz And Feedback Module/QuizComponents/ReviewQuestions";

function ReviewQuestionsView() {
  return (
    <div>
      <Provider store={store}>
        <ReviewQuestions/>
      </Provider>
    </div>
  )
}

export default ReviewQuestionsView