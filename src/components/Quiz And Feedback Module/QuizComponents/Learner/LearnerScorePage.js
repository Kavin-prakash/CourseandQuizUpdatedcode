import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Container } from "react-bootstrap";
import Divider from "@mui/joy/Divider";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
import "../../../../Styles/Quiz And Feedback Module/Learner/LearnerScorePage.css";
import { fetchQuizIdRequest } from "../../../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";
import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
import { QuizContext } from "./QuizContext";
 
 
function roundScore(score) {
  if (score > 95) {
      return 100;
  } else if (score <= 5) {
      return 0;
  } else {
      return Math.round(score / 10) * 10;
  }
}
 
export const LearnerScorePage = () => {
  const {setIsReattempt}=React.useContext(QuizContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccess = useSelector((state)=>state.fetchquizinstruction.isSubmitted);
  const [navigateAway, setNavigateAway] = useState(false);
 
 
  const topicId = sessionStorage.getItem("topicId");
  const quizinstructions = useSelector(
    (state) => state.fetchquizinstruction.quizinstructiondetails
  );
 
  const quizId = useSelector(
    (state) => state.fetchquizinstruction.quizinstructiondetails
  );
 
  console.log("FB-QuizId",quizId,isSuccess);
 
  const learnerId = sessionStorage.getItem("UserSessionID");
  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
  console.log(getlearners);
 
  const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
  const learnerAttempt = useSelector(
    (state) => state.learnerscore.learnerscoredetails
  );
  console.log("hi",learnerAttempt);
 
  useEffect(() => {
    dispatch(fetchQuizInstructionRequest(topicId));
    dispatch(fetchlearneridRequest(learnerId));
    dispatch(fetchlearnerscoreRequest(learnersAttemptId));
  }, [dispatch, topicId, learnerId, learnersAttemptId]);
 
  const handleQuizGiveFeedback = async (topicId) => {
    dispatch(fetchQuizIdRequest(topicId));
    sessionStorage.setItem("quizId", quizId.quizId);
    navigate("/quizfeedbackquestion");
  };
 
  if(!learnerAttempt.isPassed){
    setIsReattempt(true);
  }
  // Function to format the time
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
 
useEffect(() => {
  const handleBeforeUnload = (event) => {
    if (!navigateAway) {
      event.preventDefault();
      event.returnValue = ''; // For Chrome
    }
  };
 
  const handleBrowserNavigation = (event) => {
    if (!navigateAway) {
      event.preventDefault();
      event.stopImmediatePropagation();
      // setShowModal(true);
      window.history.pushState(null, '', window.location.href);
    }
  };
 
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("popstate", handleBrowserNavigation);
  window.history.pushState(null, '', window.location.href); // Ensure the initial state is set
 
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("popstate", handleBrowserNavigation);
  };
}, [navigateAway]);
 
  return (
    <div>
      <TopBar />
      <Container style={{ marginTop: "75px", width: "90%", marginLeft: "5%" }}>
        <div id="scorepages">
          <div className="containersco">
            <Container fluid id="containers">
              <Box
                id="instructions"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  display: "grid",
                  marginLeft: "auto",
                  marginRight: "auto",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 2,
                }}
              >
                <Card
                  id="scorepage-content"
                  className="learner-score-page-content"
                  variant="outlined"
                  style={{
                    padding: "20px",
                    width: "750px",
                    backgroundColor: "#F0F4F8",
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <h4 style={{ textAlign: "center" }}>
                        {quizinstructions.nameOfQuiz} Assessment Result
                      </h4>
                    </Typography>
                  </CardContent>
 
                  <CardContent>
                    <Divider inset="none" id="divider" />
                    <Typography variant="h6">
                      <h4 style={{ textAlign: "center" }}>
                        <b>Score Card</b>
                      </h4>
                    </Typography>
                    <br />
                    <Typography variant="body1">
                      <h5>
                        <b>
                          Dear {getlearners.learnerFirstName}{" "}
                          {getlearners.learnerLastName},
                        </b>
                      </h5>
                    </Typography>
                    <Typography variant="body1">
                      {learnerAttempt ? (
                        <div className="scorecard">
                          {learnerAttempt.isPassed === true ? (
                            <>
                              <Typography
                                variant="h6"
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                <h5>Congratulations..!</h5>
                              </Typography>
                              <div
                                className="popper-content"
                                style={{
                                  padding: "10px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "5px",
                                }}
                              >
                                <img
                                  src="https://img.freepik.com/premium-vector/party-icon-confetti-popper-illustration_77417-1899.jpg"
                                  alt=""
                                  style={{ width: "120px", height: "auto" }}
                                />
                                <Typography variant="body2">
                                  <b
                                    style={{
                                      fontSize: "20px",
                                      padding: "50px",
                                    }}
                                  >
                                    You have Passed the{" "}
                                    {quizinstructions.nameOfQuiz} Assessment
                                  </b>
                                </Typography>
                              </div>
 
                              <br />
                              <h6>
                                <Typography variant="body2">
                                  Start Time:{" "}
                                  {formatTime(learnerAttempt.startTime)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  style={{ padding: "180px" }}
                                >
                                  End Time: {formatTime(learnerAttempt.endTime)}
                                </Typography>
                              </h6>
                              <Typography variant="body2">
                                <h5>
                                  {learnerAttempt.timeTaken > 60
                                    ? `The time taken: ${
                                        Math.round(
                                          (learnerAttempt.timeTaken / 60) * 100
                                        ) / 100
                                      } minutes`
                                    : `The time taken: ${learnerAttempt.timeTaken} seconds`}
                                </h5>
                              </Typography>
 
                              <Typography variant="body1">
                                <h4>
                                  <b>Your Score is {learnerAttempt.score}</b>
                                </h4>
                              </Typography>
 
                              <div
                                style={{
                                  textAlign: "center",
                                  marginTop: "20px",
                                }}
                              >
                                <Button
                                  variant="default"
                                  style={{
                                    backgroundColor: "#365486",
                                    color: "whitesmoke",
                                    width: "180px",
                                  }}
                                  onClick={() => {
                                    handleQuizGiveFeedback(quizId);
                                  }}
                                >
                                  Give Quiz Feedback
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="popper-content"
                                style={{
                                  padding: "10px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "5px",
                                }}
                              >
                                <img
                                  src="https://img.freepik.com/vetores-premium/bolha-de-fala-em-quadrinhos-vetorial-colorida-com-som-oops_172149-414.jpg"
                                  alt=""
                                  style={{ width: "120px", height: "auto" }}
                                />
                                <Typography variant="body2">
                                  <b
                                    style={{
                                      fontSize: "20px",
                                      padding: "50px",
                                    }}
                                  >
                                    You did not clear the{" "}
                                    {quizinstructions.nameOfQuiz} Assessment
                                  </b>
                                </Typography>
                              </div>
                              {quizinstructions.attemptsAllowed -
                                learnerAttempt.currentAttempt ===
                              0 ? (
                                <>
                                  <Typography
                                    variant="body1"
                                    style={{ textAlign: "center" }}
                                  >
                                    <h5>Your attempts are over...!</h5>
                                  </Typography>
                                  <br />
                                  <Button
                                    variant="default"
                                    style={{
                                      backgroundColor: "#365486",
                                      color: "whitesmoke",
                                      width: "150px",
                                    }}
                                    onClick={() => {
                                      navigate("/LearnerenrolledCourse");
                                    }}
                                  >
                                    Go To Course
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Typography variant="body1">
                                    <h5>
                                      You have{" "}
                                      {quizinstructions.attemptsAllowed -
                                        learnerAttempt.currentAttempt}{" "}
                                      more attempts to finish the quiz.
                                    </h5>
                                    <h5>
                                      You can retake the quiz now or revise the
                                      course material.
                                    </h5>
                                  </Typography>
                                  <Typography variant="body1">
                                    {/* <h4>
                                      <b>
                                        Your Score is {learnerAttempt.score}
                                      </b>
                                    </h4> */}
                                    <h4><b>Your Score is {roundScore(learnerAttempt.score)} Percentage</b></h4>
                                  </Typography>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-around",
                                      marginTop: "20px",
                                    }}
                                  >
                                    <Button
                                      variant="default"
                                      style={{
                                        backgroundColor: "#365486",
                                        color: "whitesmoke",
                                        width: "150px",
                                      }}
                                      onClick={() => {
                                        navigate("/instruction");
                                      }}
                                    >
                                      Retake Quiz
                                    </Button>
 
                                    <Button
                                      variant="default"
                                      style={{
                                        backgroundColor: "#365486",
                                        color: "whitesmoke",
                                        width: "150px",
                                      }}
                                      onClick={() => {
                                        navigate("/LearnerenrolledCourse");
                                      }}
                                    >
                                      Go To Course
                                    </Button>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <Typography variant="body1">
                          Loading learner data...
                        </Typography>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Container>
          </div>
        </div>
      </Container>
    </div>
  );
};
 
export default LearnerScorePage;