import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import '../../../../Styles/Quiz And Feedback Module/Learner/FeedbackResponse.css';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { topicfeedbackresponserequest } from '../../../../actions/Quiz And Feedback Module/Learner/TopicFeedbackResponseAction';
import { fetchtopicfeedbackquestionrequest } from '../../../../actions/Quiz And Feedback Module/Learner/FetchTopicFeedbackQuestionAction';
 
 
const TopicFeedbackquestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topicfeedbackquestionfetch = useSelector(
    (state) => state.fetchtopicfeedbackquestion.topicfeedbackquestions
  );
  console.log("selector", topicfeedbackquestionfetch);

   const learnerId = sessionStorage.getItem("UserSessionID");
  //  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
  //  console.log(getlearners);

  //  console.log("Learner ID :", learnerId);

//   const [desc, setDesc] = useState("");
//   const [quiztext, setQuiztext] = useState("")
  // Initialize answers state as an array of objects
  const [answers, setAnswers] = useState(
    topicfeedbackquestionfetch.map((question) => ({
      topicFeedbackQuestionId: question.topicFeedbackQuestionId,
      topicId: question.topicId,
      learnerId:learnerId,
      response: "",
      optionText: "",
    }))
  );
  console.log("uestate", answers);
 
  // Handle change for both MCQ and text responses
  const onhandleChange = (questionId, optionType, optionValue) => {
    setAnswers(answers.map(answer =>
      answer.topicFeedbackQuestionId === questionId ?
        { ...answer, [optionType]: optionValue } :
        answer
    ));
  };
  const onhandleResponse = (questionId, optionType) => (e) => {
    const { value } = e.target;
    setAnswers(answers.map(answer =>
      answer.topicFeedbackQuestionId === questionId ?
        { ...answer, [optionType]: value } :
        answer
    ));
  };
  // Submit all answers
  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your actual submit logic
    console.log("Submitting answers:", answers);
    dispatch(topicfeedbackresponserequest(answers))
  };
 
  const handleNavigate = () => {
    sessionStorage.removeItem("topicId");
    navigate("/quizengine");
  };
 
   const divStyle = {
     boxShadow: "0px 4px 8px #23275c",
     backgroundColor: "#F9F5F6",
  };
  
    const allAnswered = answers.every(
      (answer) => answer.optionText || answer.response
    );

const topicId=sessionStorage.getItem("topicId")

  useEffect(() => {
dispatch(fetchtopicfeedbackquestionrequest(topicId))

  },[dispatch])
 
  return (
    <div>
      <div className="question template container" id="fq">
        <div>
          <button
            class="btn btn-light"
            style={{
              marginLeft: "100%",
              marginTop: "8%",
              backgroundColor: "#365486",
              color: "white",
              width: "50",
            }}
            onClick={() => {
             navigate("/ViewTopics");
            }}
          >
            Back
          </button>
        </div>
       
        <h4 className="card-title">Topic Feedback</h4>
        <div>
          <Container fluid style={divStyle}>
            {topicfeedbackquestionfetch &&
              topicfeedbackquestionfetch.map(
                (topicfeedbackquestions, index) => (
                  <div className="cont mt-2">
                    <div className="card mt-5" key={index}>
                      <div className="card-body">
                        <h6 className="card-title">
                          Question {topicfeedbackquestions.questionNo}
                        </h6>
                        <input
                          value={topicfeedbackquestions.question}
                          className="form-control"
                          readOnly
                        />
                        <div className="card-body">
                          <div className="form-group">
                            <h6 className="card-title">Options:</h6>
                            {topicfeedbackquestions.questionType === "MCQ" ? (
                              topicfeedbackquestions.options.map(
                                (option, optionIndex) => (
                                  <div key={optionIndex}>
                                    <input
                                      id="feedbackradiobtn"
                                      type="radio"
                                      onChange={() =>
                                        onhandleChange(
                                          topicfeedbackquestions.topicFeedbackQuestionId,
                                          "optionText",
                                          option.optionText
                                        )
                                      }
                                      value={option.optionText}
                                      name={`option_${topicfeedbackquestions.topicFeedbackQuestionId}`} // Unique name for each question
                                    />
                                    <label>{option.optionText}</label>
                                  </div>
                                )
                              )
                            ) : (
                              <textarea
                                onChange={onhandleResponse(
                                  topicfeedbackquestions.topicFeedbackQuestionId,
                                  "response"
                                )}
                                value={
                                  answers.find(
                                    (answer) =>
                                      answer.topicFeedbackQuestionId ===
                                      topicfeedbackquestions.topicFeedbackQuestionId
                                  )?.response
                                }
                                name="response"
                                className="form-control"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            {/* <Button onClick={handleSubmit}>Submit</Button> */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-light mt-3 mb-5 float-right"
              style={{
                backgroundColor: "#365486",
                color: "white",
                marginLeft: "45%",
              }}
              disabled={
                !answers.every((answer) => answer.optionText || answer.response)
              }
            >
              Submit
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
};
 
export default TopicFeedbackquestion;
 
 