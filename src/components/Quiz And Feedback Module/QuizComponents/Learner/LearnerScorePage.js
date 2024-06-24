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

// useEffect(() => {
//   const handleBeforeUnload = (event) => {
//     if (!navigateAway) {
//       event.preventDefault();
//       event.returnValue = ''; // For Chrome
//     }
//   };

//   const handleBrowserNavigation = (event) => {
//     if (!navigateAway) {
//       event.preventDefault();
//       event.stopImmediatePropagation();
//       // setShowModal(true);
//       window.history.pushState(null, '', window.location.href);
//     }
//   };

//   window.addEventListener("beforeunload", handleBeforeUnload);
//   window.addEventListener("popstate", handleBrowserNavigation);
//   window.history.pushState(null, '', window.location.href); // Ensure the initial state is set

//   return () => {
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//     window.removeEventListener("popstate", handleBrowserNavigation);
//   };
// }, [navigateAway]);

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










// import React from "react";
// import { useEffect } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
// import "../../../../Styles/Quiz And Feedback Module/Learner/LearnerScorePage.css";
// import { fetchQuizIdRequest } from "../../../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";


// export const LearnerScorePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const topicId = sessionStorage.getItem("topicId");
//   const quizinstructions = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   const quizId = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   const learnerId = sessionStorage.getItem("UserSessionID");
//   const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);

//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );

//   useEffect(() => {
//     dispatch(fetchQuizInstructionRequest(topicId));
//     dispatch(fetchlearneridRequest(learnerId));
//     dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//   }, [dispatch]);

//   const handleQuizGiveFeedback = async (topicId) => {
//     dispatch(fetchQuizIdRequest(topicId));
//     sessionStorage.setItem("quizId", quizId.quizId);
//     navigate("/quizfeedbackquestion");
//   };

//   return (
//     <div>
//       <TopBar/>
//     <Container style={{ marginTop: "75px", width: "90%", marginLeft: "5%" }}>
//       <div id="scorepages">
//         <div className="containersco">
//           <Container fluid id="containers">
//             <Box
//               id="instructions"
//               sx={{
//                 width: "100%",
//                 maxWidth: 600,
//                 display: "grid",
//                 marginLeft: "auto",
//                 marginRight: "auto",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//                 gap: 2,
//               }}
//             >
//               <Card
//                 id="scorepage-content"
//                 className="learner-score-page-content"
//                 variant="outlined"
//                 style={{ padding: "20px", width: "750px" ,backgroundColor:"#F0F4F8"}}
//               >
//                 <CardContent>
//                   <Typography variant="h5" component="div">
//                    <h4 style={{textAlign:"center"}}>
//                    {quizinstructions.nameOfQuiz} Assessment Result
//                    </h4>
//                   </Typography>
//                 </CardContent>

//                 <CardContent>
//                   <Divider inset="none" id="divider" />
//                   <Typography variant="h6">
//                    <h4 style={{textAlign:"center"}}>
//                    <b>Score Card</b>
//                    </h4>
//                   </Typography>
//                   <br/>
//                   <Typography variant="body1">
//                     <h5>
//                     <b>
//                       Dear {getlearners.learnerFirstName}{" "}
//                       {getlearners.learnerLastName},
//                     </b>
//                     </h5>
//                   </Typography>
//                   <Typography variant="body1">
//                     {learnerAttempt ? (
//                       <div className="scorecard">
//                         {/* <Typography variant="body2">
//                           Start Time: {learnerAttempt.startTime}
//                         </Typography>
//                         <br />
//                         <Typography variant="body2">
//                           End Time: {learnerAttempt.endTime}
//                         </Typography>
//                         <br />
//                         <Typography variant="body2">
//                           {learnerAttempt.timeTaken > 60
//                             ? `The time taken: ${
//                                 Math.round(
//                                   (learnerAttempt.timeTaken / 60) * 100
//                                 ) / 100
//                               } minutes`
//                             : `The time taken: ${learnerAttempt.timeTaken} seconds`}
//                         </Typography> */}
//                         {learnerAttempt.isPassed === true ? (
//                           <>
//                             <Typography
//                               variant="h6"
//                               style={{ color: "green", fontWeight: "bold" }}
//                             >
//                             <h5>
//                             Congratulations..!
//                             </h5>
//                               {/* {getlearners.learnerFirstName}{" "}
//                               {getlearners.learnerLastName} */}
//                             </Typography>
//                             <div
//                               className="popper-content"
//                               style={{
//                                 padding: "10px",
//                                 backgroundColor: "#fff",
//                                 border: "1px solid #ddd",
//                                 borderRadius: "5px",
//                                 // textAlign: "center",
//                               }}
//                             >
//                               <img
//                                 // src="https://media.giphy.com/media/3o6ozsIx6prI9RYJ4s/giphy.gif"
//                                 src="https://img.freepik.com/premium-vector/party-icon-confetti-popper-illustration_77417-1899.jpg"
//                                 // src="https://previews.123rf.com/images/vectortatu/vectortatu1806/vectortatu180600045/103241339-party-popper-pulling-cracker-isolated-on-white-background-confetti-and-streamers-pulled-party-blower.jpg"
//                                 alt=""
//                                 style={{ width: "120px", height: "auto" }}
//                               />
//                               <Typography variant="body2"
//                                // style={{
//                               //   padding: "10px",
//                               //   backgroundColor: "#fff",
//                               //   border: "1px solid #ddd",
//                               //   borderRadius: "5px",
//                               //   textAlign: "center",
//                               // }}
//                               >
//                                 {/* Well done on passing the quiz! */}
//                              {/* <b style={{fontSize:"30px",padding:"90px"}}>Your Score is {learnerAttempt.score}</b> */}
//                              <b style={{fontSize:"20px",padding:"50px"}}>
//                              You have Passed the {quizinstructions.nameOfQuiz} Assessment
//                              </b>
//                               </Typography>
//                             </div>
                            
//                             {/* <Typography variant="body1">
//                              <h5>
//                              You Passed the {quizinstructions.nameOfQuiz} Assessment
//                              </h5>
//                              <h4>
//                              <b>Your Score is {learnerAttempt.score}</b>
//                              <b style={{fontSize:"30px",padding:"90px"}}>Your Score is {learnerAttempt.score}</b>
//                              </h4>
//                             </Typography> */}

//                             {/* <Typography variant="body1">
//                              <h4>
//                              <b>Your Score is {learnerAttempt.score}</b>
//                              </h4>
//                             </Typography> */}
//                             <br/>
//                            <h6>
//                            <Typography variant="body2">
//                           Start Time: {learnerAttempt.startTime}
//                         </Typography>
//                         {/* &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp; */}
//                         <Typography variant="body2" style={{padding:"110px"}}>
//                           End Time: {learnerAttempt.endTime}
//                         </Typography>
//                            </h6>
//                         <Typography variant="body2">
//                          <h5>
//                          {learnerAttempt.timeTaken > 60
//                             ? `The time taken: ${
//                                 Math.round(
//                                   (learnerAttempt.timeTaken / 60) * 100
//                                 ) / 100
//                               } minutes`
//                             : `The time taken: ${learnerAttempt.timeTaken} seconds`}
//                          </h5>
//                         </Typography>

//                         <Typography variant="body1" >
//                              {/* <h5>
//                              You Passed the {quizinstructions.nameOfQuiz} Assessment
//                              </h5> */}
//                              <h4>
//                              <b>Your Score is {learnerAttempt.score}</b>
//                              {/* <b style={{fontSize:"30px",padding:"90px"}}>Your Score is {learnerAttempt.score}</b> */}
//                              </h4>
//                         </Typography>

//                             <div
//                               style={{
//                                 textAlign: "center",
//                                 marginTop: "20px",
//                               }}
//                             >
//                               <Button
//                                 variant="default"
//                                 style={{
//                                   backgroundColor: "#365486",
//                                   color: "whitesmoke",
//                                   width: "180px",
//                                 }}
//                                 onClick={() => {
//                                   handleQuizGiveFeedback(quizId);
//                                 }}
//                               >
//                                 Give Quiz Feedback
//                               </Button>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             {/* <Typography
//                               variant="h6"
//                               style={{ color: "red" }}
//                             >
//                               OOPS! 
//                               You did not clear the{" "}
//                               {quizinstructions.nameOfQuiz} Assessment
//                             </Typography> */}
//                             <div
//                               className="popper-content"
//                               style={{
//                                 padding: "10px",
//                                 backgroundColor: "#fff",
//                                 border: "1px solid #ddd",
//                                 borderRadius: "5px",
//                                 // textAlign: "center",
//                               }}
//                             >
//                               <img
//                                 // src="https://media.giphy.com/media/3o6ozsIx6prI9RYJ4s/giphy.gif"
//                                 src="https://img.freepik.com/vetores-premium/bolha-de-fala-em-quadrinhos-vetorial-colorida-com-som-oops_172149-414.jpg"
//                                 // src="https://previews.123rf.com/images/vectortatu/vectortatu1806/vectortatu180600045/103241339-party-popper-pulling-cracker-isolated-on-white-background-confetti-and-streamers-pulled-party-blower.jpg"
//                                 alt=""
//                                 style={{ width: "120px", height: "auto" }}
//                               />
//                               <Typography variant="body2"
//                                // style={{
//                               //   padding: "10px",
//                               //   backgroundColor: "#fff",
//                               //   border: "1px solid #ddd",
//                               //   borderRadius: "5px",
//                               //   textAlign: "center",
//                               // }}
//                               >
//                                 {/* Well done on passing the quiz! */}
//                              {/* <b style={{fontSize:"30px",padding:"90px"}}>Your Score is {learnerAttempt.score}</b> */}

//                              <b style={{fontSize:"20px",padding:"50px"}}>
//                              You did not clear the{" "}
//                               {quizinstructions.nameOfQuiz} Assessment
//                              </b>
//                               </Typography>
//                             </div>
//                             {/* <Typography variant="body1">
//                               Your Score is {learnerAttempt.score}
//                             </Typography> */}
//                             {quizinstructions.attemptsAllowed -
//                               learnerAttempt.currentAttempt === 0 ? (
//                                 <>
//                               <Typography variant="body1" style={{textAlign:"center"}}>
//                                <h5>
//                                Your attempts are over...!
//                                </h5>
//                               </Typography>
//                               <br/>
//                               <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/LearnerenrolledCourse");
//                                     }}
//                                   >
//                                     Go To Course
//                                   </Button>
//                               </>
//                             ) : (
//                               <>
//                                 <Typography variant="body1">
//                                  <h5>
//                                  You have{" "}
//                                   {quizinstructions.attemptsAllowed -
//                                     learnerAttempt.currentAttempt}{" "}
//                                   more attempts to finish the quiz.
//                                  </h5>
//                                  <h5>
//                                  You can retake the quiz now or revise the
//                                   course material.
//                                  </h5>
//                                 </Typography>

//                                 {/* <Typography variant="body1">
//                                   You can retake the quiz now or revise the
//                                   course material.
//                                 </Typography> */}
//                                 <Typography variant="body1" >
//                              {/* <h5>
//                              You Passed the {quizinstructions.nameOfQuiz} Assessment
//                              </h5> */}
//                              <h4>
//                              <b>Your Score is {learnerAttempt.score}</b>
//                              {/* <b style={{fontSize:"30px",padding:"90px"}}>Your Score is {learnerAttempt.score}</b> */}
//                              </h4>
//                         </Typography>
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "space-around",
//                                     marginTop: "20px",
//                                   }}
//                                 >
//                                   <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/instruction");
//                                     }}
//                                   >
//                                     Retake Quiz
//                                   </Button>
//                                   <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/LearnerenrolledCourse");
//                                     }}
//                                   >
//                                     Go To Course
//                                   </Button>
//                                 </div>
//                               </>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     ) : (
//                       <Typography variant="body1">
//                         Loading learner data...
//                       </Typography>
//                     )}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Container>
//         </div>
//       </div>
//     </Container>
//     </div>
//   );
// };

// export default LearnerScorePage;









































// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import Popper from "@mui/material/Popper";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
// import "../../../../Styles/Quiz And Feedback Module/Learner/LearnerScorePage.css";
// import { fetchQuizIdRequest } from "../../../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";

// export const LearnerScorePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isSuccess = useSelector((state) => state.fetchquizinstruction.isSubmitted);

//   const topicId = sessionStorage.getItem("topicId");
//   const quizinstructions = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   const quizId = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   const learnerId = sessionStorage.getItem("UserSessionID");
//   const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);

//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );

//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     dispatch(fetchQuizInstructionRequest(topicId));
//     dispatch(fetchlearneridRequest(learnerId));
//     dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//   }, [dispatch]);

//   const handleQuizGiveFeedback = async (topicId) => {
//     dispatch(fetchQuizIdRequest(topicId));
//     sessionStorage.setItem("quizId", quizId.quizId);
//     navigate("/quizfeedbackquestion");
//   };

//   const handlePopperOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handlePopperClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);

//   return (
//     <Container style={{ marginTop: "100px", width: "90%", marginLeft: "5%" }}>
//       <div id="scorepages">
//         <div className="containersco">
//           <Container fluid id="containers">
//             <Box
//               id="instructions"
//               sx={{
//                 width: "100%",
//                 maxWidth: 600,
//                 display: "grid",
//                 marginLeft: "auto",
//                 marginRight: "auto",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//                 gap: 2,
//               }}
//             >
//               {/* <Card
//                 id="scorepage-topic"
//                 className="learner-score-page-topic"
//                 style={{
//                   marginBottom: "2%",
//                   marginTop: "0%",
//                   textAlign: "center",
//                   backgroundColor: "#f5f5f5",
//                   padding: "20px",
//                 }}
//                 variant="outlined"
//               >
//                 <CardContent>
//                   <Typography variant="h5" component="div">
//                     {quizinstructions.nameOfQuiz} Assessment Result
//                   </Typography>
//                 </CardContent>
//               </Card> */}
//               <Card
//                 id="scorepage-content"
//                 className="learner-score-page-content"
//                 variant="outlined"
//                 style={{ padding: "20px", width:"750px"}}
//               >

//                   <CardContent>
//                   <Typography variant="h5" component="div">
//                     {quizinstructions.nameOfQuiz} Assessment Result
//                   </Typography>
//                 </CardContent>

//                 <CardContent>
//                   <Divider inset="none" id="divider" />
//                   <Typography variant="h6">
//                     <b>Score Card</b>
//                   </Typography>
//                   <Typography variant="body1">
//                     <b>
//                       Dear {getlearners.learnerFirstName}{" "}
//                       {getlearners.learnerLastName},
//                     </b>
//                   </Typography>
//                   <br />
//                   <Typography variant="body1">
//                     {learnerAttempt ? (
//                       <div className="scorecard">
//                         <Typography variant="body2">
//                           Start Time: {learnerAttempt.startTime}
//                         </Typography>
//                         <br/>
//                         <Typography variant="body2">
//                           End Time: {learnerAttempt.endTime}
//                         </Typography>
//                         <br/>
//                         <Typography variant="body2">
//                           {learnerAttempt.timeTaken > 60
//                             ? `The time taken: ${
//                                 Math.round(
//                                   (learnerAttempt.timeTaken / 60) * 100
//                                 ) / 100
//                               } minutes`
//                             : `The time taken: ${learnerAttempt.timeTaken} seconds`}
//                         </Typography>
//                         <br/>
//                         {learnerAttempt.isPassed === true ? (
//                           <>
//                             <Typography
//                               variant="h6"
//                               // onMouseEnter={handlePopperOpen}
//                               // onMouseLeave={handlePopperClose}
//                               style={{ color: "green", fontWeight: "bold" }}
//                             >
//                               Congratulations {getlearners.learnerFirstName}{" "}
//                               {getlearners.learnerLastName}
//                             </Typography>
//                             <br/>
//                             <div className="popper-content" style={{ padding: "10px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "5px" }}>
//                                 <img src="https://media.giphy.com/media/3o6ozsIx6prI9RYJ4s/giphy.gif" alt="Congrats" style={{ width: "100px", height: "auto" }} />
//                                 Well done on passing the quiz!
//                               </div>
//                             {/* <Popper
//                               id="congratulations-popper"
//                               open={open}
//                               anchorEl={anchorEl}
//                               placement="bottom"
//                             >
//                               <div className="popper-content" style={{ padding: "10px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "5px" }}>
//                                 <img src="https://media.giphy.com/media/3o6ozsIx6prI9RYJ4s/giphy.gif" alt="Congrats" style={{ width: "100px", height: "auto" }} />
//                                 Well done on passing the quiz!
//                               </div>
//                             </Popper> */}
//                             <Typography variant="body1">
//                               You Passed the {quizinstructions.nameOfQuiz} Assessment
//                             </Typography>
//                             <br/>
//                             <Typography variant="body1">
//                              <b>
//                              Your Score is {learnerAttempt.score}
//                              </b>
//                             </Typography>
//                             <div style={{ textAlign: "center", marginTop: "20px" }}>
//                               <Button
//                                 variant="default"
//                                 style={{
//                                   backgroundColor: "#365486",
//                                   color: "whitesmoke",
//                                   width: "180px",
//                                 }}
//                                 onClick={() => {
//                                   handleQuizGiveFeedback(quizId);
//                                 }}
//                               >
//                                 Give Quiz Feedback
//                               </Button>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <Typography variant="h6" style={{ color: "red" }}>
//                               OOPS ! You did not clear the {quizinstructions.nameOfQuiz} Assessment
//                             </Typography>
//                             <br/>
//                             <Typography variant="body1">Your Score is {learnerAttempt.score}</Typography>
//                             <br/>
//                             {quizinstructions.attemptsAllowed - learnerAttempt.currentAttempt === 0 ? (
//                               <Typography variant="body1">Your attempts are over...</Typography>
//                             ) : (
//                               <>
//                                 <Typography variant="body1">
//                                   You have {quizinstructions.attemptsAllowed - learnerAttempt.currentAttempt} more attempts to finish the quiz.
//                                 </Typography>
//                                 <br/>
//                                 <Typography variant="body1">You can retake the quiz now or revise the course material.</Typography>
//                                 <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
//                                   <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/instruction");
//                                     }}
//                                   >
//                                     Retake Quiz
//                                   </Button>
//                                   <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/quizengine");
//                                     }}
//                                   >
//                                     Go To Course
//                                   </Button>
//                                 </div>
//                               </>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     ) : (
//                       <Typography variant="body1">Loading learner data...</Typography>
//                     )}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Container>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default LearnerScorePage;


























// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";

// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
// import "../../../../Styles/Quiz And Feedback Module/Learner/LearnerScorePage.css";
// import { fetchQuizIdRequest } from "../../../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";


// export const LearnerScorePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isSuccess = useSelector((state) => state.fetchquizinstruction.isSubmitted);


//   const topicId = sessionStorage.getItem("topicId");
//   const quizinstructions = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   // const quizId = sessionStorage.getItem("quizId");
//   const quizId = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   console.log("FB- quizId", quizId, isSuccess);

//   const learnerId = sessionStorage.getItem("UserSessionID");
//   const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//   console.log(getlearners);

//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );
//   console.log("hi,", learnerAttempt);

//   useEffect(() => {
//     dispatch(fetchQuizInstructionRequest(topicId));
//     dispatch(fetchlearneridRequest(learnerId));
//     debugger;
//     dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//   }, [dispatch]);

//   const handleQuizGiveFeedback = async (topicId) => {
//     dispatch(fetchQuizIdRequest(topicId));
//     // sessionStorage.setItem("quizId", quizId);
//     sessionStorage.setItem("quizId", quizId.quizId);
//     navigate("/quizfeedbackquestion");
//   };

//   return (
//     <Container style={{ marginTop: "100px", width: "90%", marginLeft: "15%" }}>
//       <div id="scorepages">
//         <div class="containersco">
//           <Container fluid id="containers">
//             <Box
//               id="instructions"
//               sx={{
//                 width: "80%",
//                 maxWidth: 400,
//                 display: "grid",
//                 marginLeft: "2%",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//                 gap: 2,
//               }}
//               style={{}}
//             >
//               <Card
//                 id="scorepage-topic"
//                 style={{
//                   height: "50px",
//                   width: "500%",
//                   marginLeft: "108%",
//                   marginBottom: "2%",
//                   marginTop: "-20%",
//                 }}
//                 variant="soft"
//               >
//                 <CardContent>
//                   <Typography level="title-md">
//                     {quizinstructions.nameOfQuiz} Assessment Result
//                   </Typography>
//                 </CardContent>
//               </Card>
//               <Card
//                 id="scorepage-content"
//                 variant="soft"
//                 style={{ width: "500%", height: "105%" }}
//               >
//                 <CardContent>
 
//                   <Divider inset="none" id="divider" />
//                   <Typography>
//                     <b>Score Card</b>
//                   </Typography>
//                   <Typography>
//                     <b>
//                       Dear {getlearners.learnerFirstName}{" "}
//                       {getlearners.learnerLastName},
//                     </b>
//                   </Typography>
//                   <Typography>
//                     <br></br>
//                   </Typography>
//                   <Typography>
//                     {learnerAttempt ? (
//                       <div className="scorecard">
//                         <h6>Start Time : {learnerAttempt.startTime}</h6>
//                         <h6>End Time : {learnerAttempt.endTime}</h6>
//                         <h1>
//                           {learnerAttempt.timeTaken > 60
//                             ? `The time taken : ${
//                                 Math.round(
//                                   (learnerAttempt.timeTaken / 60) * 100
//                                 ) / 100
//                               } minutes`
//                             : `The time taken : ${learnerAttempt.timeTaken} seconds`}
//                         </h1>
//                         {learnerAttempt.isPassed === true ? (
//                           <>
//                             <h1>
//                               Contragulations {getlearners.learnerFirstName}{" "}
//                               {getlearners.learnerLastName}
//                             </h1>
//                             <h1>
//                               You Passed the {quizinstructions.nameOfQuiz}
//                               Assessment
//                             </h1>
//                             <h1>Your Score is {learnerAttempt.score} </h1>

//                             <></>
//                             <div>
//                               <Button
//                                 variant="default"
//                                 style={{
//                                   backgroundColor: "#365486",
//                                   color: "whitesmoke",
//                                   width: "180px",
//                                   marginLeft: "70%",
//                                   marginBottom: "55px",
//                                 }}
//                                 onClick={() => {
//                                   handleQuizGiveFeedback(quizId);
//                                 }}
//                               >
//                                 Give Quiz Feedback
//                               </Button>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <h3>
//                               OOPS You not cleared the{" "}
//                               {quizinstructions.nameOfQuiz} Assessment
//                             </h3>

//                             <h5>Your Score is {learnerAttempt.score} </h5>

//                             {quizinstructions.attemptsAllowed -
//                               learnerAttempt.currentAttempt ===
//                             0 ? (
//                               <>
//                                 <h5>Your Attempt is over...</h5>
//                               </>
//                             ) : (
//                               <>
//                                 <h5>
//                                   You have only{" "}
//                                   {quizinstructions.attemptsAllowed -
//                                     learnerAttempt.currentAttempt}{" "}
//                                   more attempts to finish the quiz...
//                                 </h5>
//                                 <h5>
//                                   You can retake the quiz now or again revise
//                                   the courses
//                                 </h5>
//                                 <div
//                                   style={{
//                                     marginLeft: "-1%",
//                                     marginTop: "20%",
//                                   }}
//                                 >
//                                   <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                       marginLeft: "80%",
//                                       marginTop: "-170px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/instruction");
//                                     }}
//                                   >
//                                     Retake Quiz
//                                   </Button>
//                                 </div>
//                                 <div
//                                   style={{
//                                     marginLeft: "-210%",
//                                     marginTop: "-6%",
//                                   }}
//                                 >
//                                   <Button
//                                     variant="default"
//                                     style={{
//                                       backgroundColor: "#365486",
//                                       color: "whitesmoke",
//                                       width: "150px",
//                                       marginLeft: "70%",
//                                       marginTop: "-120px",
//                                     }}
//                                     onClick={() => {
//                                       navigate("/quizengine");
//                                     }}
//                                   >
//                                     Go To Course
//                                   </Button>
//                                 </div>
//                               </>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     ) : (
//                       <p>Loading learner data...</p>
//                     )}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Container>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default LearnerScorePage;




// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import AdminNavbar from "../../AdminNavbar";
// // import "../../../../Styles/Quiz And Feedback Module/Learner/QuizInstruction.css";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
// // import "../../../../Styles/Quiz And Feedback Module/Learner/LearnerScorePage.css";

// export const LearnerScorePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const topicId = sessionStorage.getItem("topicId");
//   const quizinstructions = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   const learnerId = sessionStorage.getItem("UserSessionID");
//   const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//   console.log(getlearners);

//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );
//   console.log("hi,", learnerAttempt);

//   useEffect(() => {
//     dispatch(fetchQuizInstructionRequest(topicId));
//     dispatch(fetchlearneridRequest(learnerId));
//     debugger;
//     dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//   }, [dispatch]);

//   const divStyle = {
//     boxShadow: "0px 4px 8px #23275c",
//   };

//   return (
//     <Container fluid style={{marginTop:"700px"}}>
//     <div>
//       {/* <AdminNavbar /> */}
//       <div class="container">
//         <div>

//           {/* <button
//             class="btn btn-light"
//             style={{
//               marginLeft: "100%",
//               marginTop: "60%",
//               backgroundColor: "#365486",
//               color: "white",
//               width: "50",
//             }}
//           >
//             Back
//           </button> */}

//         </div>
//         {/* <AdminNavbar /> */}
//         <Container fluid id="container" style={divStyle}>
//           <Box
//             id="instruction"
//             sx={{
//               width: "100%",
//               maxWidth: 500,
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//               gap: 2,
//             }}
//           >
//             <Card style={{ height: "50px", marginLeft: "-14%" }} variant="soft">
//               <CardContent>
//                 <Typography level="title-md">
//                   {quizinstructions.nameOfQuiz} Assessment Result
//                 </Typography>
//               </CardContent>
//             </Card>
//             <Card id="card" variant="soft">
//               <CardContent>
//                 <Divider inset="none" id="divider" />
//                 <Typography level="title-md">
//                   Duration : {quizinstructions.duration}{" "}
//                 </Typography>
//                 <Typography level="title-md">
//                   Pass Mark : {quizinstructions.passMark}{" "}
//                 </Typography>
//                 <Typography level="title-md">
//                   Attempts Allowed : {quizinstructions.attemptsAllowed}
//                 </Typography>
//                 <Divider inset="none" id="divider" />
//                 <Typography>
//                   <b>Score Card</b>
//                 </Typography>
//                 <Typography>
//                   <b>
//                     Dear {getlearners.learnerFirstName}{" "}
//                     {getlearners.learnerLastName},
//                   </b>
//                 </Typography>
//                 <Typography>
//                   <br></br>
//                 </Typography>
//                 <Typography>
//                   {learnerAttempt ? (
//                     <div className="scorecard">
//                       <h1>The time taken : {learnerAttempt.timeTaken/60}</h1>
//                       {learnerAttempt.isPassed === true ? (
//                         <>
//                           <h1>
//                             Contragulations {getlearners.learnerFirstName}{" "}
//                             {getlearners.learnerLastName}❗🎉
//                           </h1>
//                           <h1>
//                             You Passed the {quizinstructions.nameOfQuiz}
//                             Assessment
//                           </h1>

//                           <h1>Your Score is {learnerAttempt.score} </h1>

//                           <div>
//                             <div class="emoji emoji--haha">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth">
//                                   <div class="emoji__tongue"></div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div class="emoji emoji--yay">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                             <div class="emoji emoji--wow">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                           </div>
//                           <>
//                             <div>
//                               <Button
//                                 variant="default"
//                                 style={{
//                                   backgroundColor: "#365486",
//                                   color: "whitesmoke",
//                                   width: "150px",
//                                   marginLeft: "50%",

//                                 }}
//                                 onClick={() => {
//                                   navigate("/quizengine");
//                                 }}
//                               >
//                                 Go To Course
//                               </Button>
//                             </div>
//                           </>
//                         </>
//                       ) : (
//                         <>
//                           <h3>
//                             OOPS☹❗ You not cleared the{" "}
//                             {quizinstructions.nameOfQuiz} Assessment
//                           </h3>

//                           <h5>Your Score is {learnerAttempt.score} </h5>

//                           <div class="emoji emoji--sad">
//                             <div class="emoji__face">
//                               <div class="emoji__eyebrows"></div>
//                               <div class="emoji__eyes"></div>
//                               <div class="emoji__mouth"></div>
//                             </div>
//                           </div>
//                           {quizinstructions.attemptsAllowed -
//                             learnerAttempt.currentAttempt ===
//                           0 ? (
//                             <>

//                               <h5>Your Attempt is over...</h5>
//                             </>
//                           ) : (
//                             <>
//                               <h5>
//                                 You have only{" "}
//                                 {quizinstructions.attemptsAllowed -
//                                   learnerAttempt.currentAttempt}{" "}
//                                 more attempts to finish the quiz...
//                               </h5>
//                               <h5>
//                             You can retake the quiz now or again revise the
//                             courses
//                           </h5>
//                               <div
//                                 style={{ marginLeft: "-1%", marginTop: "20%" }}
//                               >
//                                 <Button
//                                   variant="default"
//                                   style={{
//                                     backgroundColor: "#365486",
//                                     color: "whitesmoke",
//                                     width: "150px",
//                                     marginLeft: "60%",
//                                     marginTop: "-150px"
//                                   }}
//                                   onClick={() => {
//                                     navigate("/instruction");
//                                   }}
//                                 >
//                                   Retake Quiz
//                                 </Button>
//                               </div>
//                               <div
//                                 style={{
//                                   marginLeft: "-210%",
//                                   marginTop: "-6%",
//                                 }}
//                               >
//                                 <Button
//                                   variant="default"
//                                   style={{
//                                     backgroundColor: "#365486",
//                                     color: "whitesmoke",
//                                     width: "150px",
//                                     marginLeft: "70%",
//                                     marginTop: "-120px"
//                                   }}
//                                   onClick={() => {
//                                     navigate("/quizengine");
//                                   }}
//                                 >
//                                   Go To Course
//                                 </Button>
//                               </div>
//                             </>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   ) : (
//                     <p>Loading learner data...</p>
//                   )}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>
//         </Container>
//       </div>
//     </div>
//     </Container>
//   );
// };

// export default LearnerScorePage;

// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import AdminNavbar from "./AdminNavbar";
// import "../../../Styles/Quiz And Feedback Module/QuizInstruction.css";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../actions/Quiz And Feedback Module/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../actions/Quiz And Feedback Module/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../actions/Quiz And Feedback Module/LearnerScorePageAction";
// // import "../../../Styles/Quiz And Feedback Module/LearnerScorePage.css";

// export const LearnerScorePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const topicId = sessionStorage.getItem("topicId");
//   const quizinstructions = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );

//   const learnerId = sessionStorage.getItem("UserSessionID");
//   const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//   console.log(getlearners);

//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );
//   console.log("hi,", learnerAttempt);

//   useEffect(() => {
//     dispatch(fetchQuizInstructionRequest(topicId));
//     dispatch(fetchlearneridRequest(learnerId));
//     debugger;
//     dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//   }, [dispatch]);

//   const divStyle = {
//     boxShadow: "0px 4px 8px #23275c",
//   };

//   return (
//     <div>
//       <AdminNavbar />
//       <div class="container">
//         <div>
//           <button
//             class="btn btn-light"
//             style={{
//               marginLeft: "100%",
//               marginTop: "60%",
//               backgroundColor: "#365486",
//               color: "white",
//               width: "50",
//             }}
//           >
//             Back
//           </button>
//         </div>
//         {/* <AdminNavbar /> */}
//         <Container fluid id="container" style={divStyle}>
//           <Box
//             id="instruction"
//             sx={{
//               width: "100%",
//               maxWidth: 500,
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//               gap: 2,
//             }}
//           >
//             <Card style={{ height: "50px", marginLeft: "-14%" }} variant="soft">
//               <CardContent>
//                 <Typography level="title-md">
//                   {quizinstructions.nameOfQuiz} Assessment Result
//                 </Typography>
//               </CardContent>
//             </Card>
//             <Card id="card" variant="soft">
//               <CardContent>
//                 <Divider inset="none" id="divider" />
//                 <Typography level="title-md">
//                   Duration : {quizinstructions.duration}{" "}
//                 </Typography>
//                 <Typography level="title-md">
//                   Pass Mark : {quizinstructions.passMark}{" "}
//                 </Typography>
//                 <Typography level="title-md">
//                   Attempts Allowed : {quizinstructions.attemptsAllowed}
//                 </Typography>
//                 <Divider inset="none" id="divider" />
//                 <Typography>
//                   <b>Score Card</b>
//                 </Typography>
//                 <Typography>
//                   <b>
//                     Dear {getlearners.learnerFirstName}{" "}
//                     {getlearners.learnerLastName},
//                   </b>
//                 </Typography>
//                 <Typography>
//                   <br></br>
//                 </Typography>
//                 <Typography>
//                   {learnerAttempt ? (
//                     <div className="scorecard">
//                       {learnerAttempt.score > quizinstructions.passMark ? (
//                         <>
//                           <h1>
//                             Contragulations {getlearners.learnerFirstName}{" "}
//                             {getlearners.learnerLastName}❗🎉
//                           </h1>
//                           <h1>
//                             You Passed the {quizinstructions.nameOfQuiz}
//                             Assessment
//                           </h1>
//                           <h1>Your Score is {learnerAttempt.score} </h1>
//                           <div>
//                             <div class="emoji emoji--haha">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth">
//                                   <div class="emoji__tongue"></div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div class="emoji emoji--yay">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                             <div class="emoji emoji--wow">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <h3>
//                             OOPS☹❗ You not cleared the{" "}
//                             {quizinstructions.nameOfQuiz} Assessment
//                           </h3>
//                           <h5>
//                             You can retake the quiz now or again revise the
//                             courses
//                           </h5>
//                           <h1>Your Score is {learnerAttempt.score} </h1>
//                           <div class="emoji emoji--sad">
//                             <div class="emoji__face">
//                               <div class="emoji__eyebrows"></div>
//                               <div class="emoji__eyes"></div>
//                               <div class="emoji__mouth"></div>
//                             </div>
//                           </div>
//                           <div style={{ marginLeft: "-1%", marginTop: "20%" }}>
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                               }}
//                               onClick={() => {
//                                 navigate("/instruction");
//                               }}
//                             >
//                               Retake Quiz
//                             </Button>
//                           </div>
//                           <div
//                             style={{ marginLeft: "-210%", marginTop: "-6%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                               }}
//                               onClick={() => {
//                                 navigate("/quizengine");
//                               }}
//                             >
//                               Go To Course
//                             </Button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ) : (
//                     <p>Loading learner data...</p>
//                   )}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default LearnerScorePage;

// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import AdminNavbar from "./AdminNavbar";
// import "../../../Styles/Quiz And Feedback Module/QuizInstruction.css";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../actions/Quiz And Feedback Module/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../actions/Quiz And Feedback Module/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../actions/Quiz And Feedback Module/LearnerScorePageAction";
// // import "../../../Styles/Quiz And Feedback Module/LearnerScorePage.css";

// export const LearnerScorePage = () => {
//  const dispatch = useDispatch();
//  const navigate = useNavigate();

//  const topicId = sessionStorage.getItem("topicId");
//  const quizinstructions = useSelector(
//    (state) => state.fetchquizinstruction.quizinstructiondetails
//  );

//  const learnerId = sessionStorage.getItem("UserSessionID");
//  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//  console.log(getlearners);

// //  const learnerAttemptId = sessionStorage.getItem("learnerAttemptId");
// //  const learnersAttemptId = useSelector(
// //    (state) => state.learnerscore.learnerscoredetails
// //  );
// //  console.log("hil,", learnersAttemptId);

//   const learnerattemptid=useSelector(
//     (state)=>state.learnerattempt.attemptId
//   );
//   console.log("learnerattemptid",learnerattemptid)

//  useEffect(() => {
//    dispatch(fetchQuizInstructionRequest(topicId));
//    dispatch(fetchlearneridRequest(learnerId));
//   //  debugger;
//   //  dispatch(fetchlearnerscoreRequest(learnerAttemptId));
//  }, [dispatch]);

//  const divStyle = {
//    boxShadow: "0px 4px 8px #23275c",
//  };

//     return (
//       <div>
//           <AdminNavbar />

//         <div class="container">
//       <div >
//         <button
//           class="btn btn-light"
//           style={{
//             marginLeft: "100%",
//             marginTop: "60%",
//             backgroundColor: "#365486",
//             color: "white",
//             width: "50",
//           }}
//           // onClick={() => {handleNavigate();}}
//         >
//           Back
//         </button>
//       </div>

//       <Container fluid id="container" style={divStyle}>
//         <Box
//           id="instruction"
//           sx={{
//             width: "100%",
//             maxWidth: 500,
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//             gap: 2,
//           }}
//         >
//           <Card style={{ height: "50px", marginLeft: "-14%" }} variant="soft">
//             <CardContent>
//               <Typography level="title-md">
//                 {quizinstructions.nameOfQuiz} Assessment Result
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card id="card" variant="soft">
//             <CardContent>
//               <Divider inset="none" id="divider" />
//               <Typography level="title-md">
//                 Duration : {quizinstructions.duration}{" "}
//               </Typography>
//               <Typography level="title-md">
//                 Pass Mark : {quizinstructions.passMark}{" "}
//               </Typography>
//               <Typography level="title-md">
//                 Attempts Allowed : {quizinstructions.attemptsAllowed}
//               </Typography>
//               <Divider inset="none" id="divider" />
//               <Typography>
//                 <b>Score Card</b>
//               </Typography>
//               <Typography>
//                 <b>
//                   Dear {getlearners.learnerFirstName}{" "}
//                   {getlearners.learnerLastName},
//                 </b>
//               </Typography>
//               <Typography>
//                 <br></br>
//               </Typography>
//  <Typography>
//                   {learnerattemptid ? (
//                     <div className="scorecard">
//                       {learnerattemptid.score >= quizinstructions.passMark ? (
//                         <>
//                           <h1>
//                             Contragulations {getlearners.learnerFirstName}{" "}
//                             {getlearners.learnerLastName}❗🎉
//                           </h1>
//                           <h1>
//                             You Passed the {quizinstructions.nameOfQuiz}
//                             Assessment
//                           </h1>
//                           <h1>Your Score is {learnerattemptid.score} </h1>
//                           <div>
//                             <div class="emoji emoji--haha">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth">
//                                   <div class="emoji__tongue"></div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div class="emoji emoji--yay">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                             <div class="emoji emoji--wow">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <>

//                           <h3>
//                             OOPS☹❗ You not cleared the{" "}
//                             {quizinstructions.nameOfQuiz} Assessment
//                           </h3>
//                            <h5>You can retake the quiz now or again revise the courses</h5>
//                           {/* <div class="emoji emoji--sad">
//                             <div class="emoji__face">
//                               <div class="emoji__eyebrows"></div>
//                               <div class="emoji__eyes"></div>
//                               <div class="emoji__mouth"></div>
//                             </div>
//                           </div> */}
//                           <div
//                             style={{ marginLeft: "-1%", marginTop: "20%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                               }}
//                               onClick={() => {
//                                 navigate("/instruction");
//                               }}
//                             >
//                               Retake Quiz
//                             </Button>
//                           </div>
//                           <div
//                             style={{ marginLeft: "-210%", marginTop: "-6%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                               }}
//                               onClick={() => {
//                                 navigate("/quizengine");
//                               }}
//                             >
//                               Go To Course
//                             </Button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ) : (
//                     <p>Loading learner data...</p>
//                   )}
//                 </Typography>

//             </CardContent>
//           </Card>
//         </Box>
//       </Container>
//     </div>
//     </div>
//   );

// };

// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import AdminNavbar from "./AdminNavbar";
// import "../../../Styles/Quiz And Feedback Module/QuizInstruction.css";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../actions/Quiz And Feedback Module/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../actions/Quiz And Feedback Module/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../actions/Quiz And Feedback Module/LearnerScorePageAction";
// import "../../../Styles/Quiz And Feedback Module/LearnerScorePage.css";

// export const LearnerScorePage = () => {
//  const dispatch = useDispatch();
//  const navigate = useNavigate();

//  const topicId = sessionStorage.getItem("topicId");
//  const quizinstructions = useSelector(
//    (state) => state.fetchquizinstruction.quizinstructiondetails
//  );

//  const learnerId = sessionStorage.getItem("UserSessionID");
//  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//  console.log(getlearners);

//  const learnerAttemptId = sessionStorage.getItem("learnerAttemptId");
//  const learnersAttemptId = useSelector(
//    (state) => state.learnerscore.learnerscoredetails
//  );
//  console.log("ScorePage Attempt ID :,", learnersAttemptId);

//  useEffect(() => {
//    dispatch(fetchQuizInstructionRequest(topicId));
//    dispatch(fetchlearneridRequest(learnerId));
//    debugger;
//    dispatch(fetchlearnerscoreRequest(learnerAttemptId));
//  }, [dispatch]);

//  const divStyle = {
//    boxShadow: "0px 4px 8px #23275c",
//  };

//     return (
//       <div>
//           <AdminNavbar />

//         <div class="container-score">
//       <div >
//         <button
//           class="btn btn-light"
//           style={{
//             marginLeft: "100%",
//             marginTop: "60%",
//             // backgroundColor: "#365486",
//             color: "white",
//             width: "50",
//           }}
//           // onClick={() => {handleNavigate();}}
//         >
//           {/* Back */}
//         </button>
//       </div>

//       <Container fluid id="container" style={divStyle}>
//         <Box
//           id="instruction"
//           sx={{
//             width: "100%",
//             maxWidth: 500,
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//             gap: 2,
//           }}
//         >
//           <Card style={{ height: "50px", marginLeft: "-14%" }} variant="soft">
//             <CardContent>
//               <Typography level="title-md">
//                 {quizinstructions.nameOfQuiz} Assessment Result
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card id="card" variant="soft">
//             <CardContent>
//               <Divider inset="none" id="divider" />
//               <Typography level="title-md">
//                 Duration : {quizinstructions.duration}{" "}
//               </Typography>
//               <Typography level="title-md">
//                 Pass Mark : {quizinstructions.passMark}{" "}
//               </Typography>
//               <Typography level="title-md">
//                 Attempts Allowed : {quizinstructions.attemptsAllowed}
//               </Typography>
//               <Divider inset="none" id="divider" />
//               <Typography>
//                 <b>Score Card</b>
//               </Typography>
//               <Typography>
//                 <b>
//                   Dear {getlearners.learnerFirstName}{" "}
//                   {getlearners.learnerLastName},
//                 </b>
//               </Typography>
//               <Typography>
//                 <br></br>
//               </Typography>
//  <Typography>
//                   {learnersAttemptId ? (
//                     <div className="scorecard">
//                       {learnersAttemptId.score >= quizinstructions.passMark ? (
//                         <>
//                           <h1>
//                             Contragulations {getlearners.learnerFirstName}{" "}
//                             {getlearners.learnerLastName}❗🎉
//                           </h1>
//                           <h1>
//                             You Passed the {quizinstructions.nameOfQuiz}
//                             Assessment
//                           </h1>
//                           <h1>Your Score is {learnersAttemptId.score} </h1>
//                           <div>
//                             <div class="emoji emoji--haha">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth">
//                                   <div class="emoji__tongue"></div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div class="emoji emoji--yay">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                             <div class="emoji emoji--wow">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <>

//                           <h3>
//                             OOPS☹❗ You have not cleared the{" "}
//                             {quizinstructions.nameOfQuiz} Assessment
//                           </h3>
//                            <h5>You can retake the quiz or again revise the course</h5>
//                           {/* <div class="emoji emoji--sad">
//                             <div class="emoji__face">
//                               <div class="emoji__eyebrows"></div>
//                               <div class="emoji__eyes"></div>
//                               <div class="emoji__mouth"></div>
//                             </div>
//                           </div> */}
//                           <div
//                             style={{ marginLeft: "-1%", marginTop: "-3%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                                 marginBottom: "-56%"
//                               }}
//                               onClick={() => {
//                                 navigate("/instruction");
//                               }}
//                             >
//                               Retake Quiz
//                             </Button>
//                           </div>
//                           <div
//                             style={{ marginLeft: "-210%", marginTop: "-6%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                                 marginBottom: "-20%"

//                               }}
//                               onClick={() => {
//                                 navigate("/quizengine");
//                               }}
//                             >
//                               Go To Course
//                             </Button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ) : (
//                     // <p>Loading learner data...</p>
//                     <p></p>
//                   )}
//                 </Typography>

//             </CardContent>
//           </Card>
//         </Box>
//       </Container>
//     </div>
//     </div>
//   );

// };

// export default LearnerScorePage;

// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import AdminNavbar from "./AdminNavbar";
// import "../../../Styles/Quiz And Feedback Module/QuizInstruction.css";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../actions/Quiz And Feedback Module/QuizInstructionAction";
// import { fetchlearneridRequest } from "../../../actions/Quiz And Feedback Module/GetLearnerIDAction";
// import { fetchlearnerscoreRequest } from "../../../actions/Quiz And Feedback Module/LearnerScorePageAction";
// // import "../../../Styles/Quiz And Feedback Module/LearnerScorePage.css";

// export const LearnerScorePage = () => {
//  const dispatch = useDispatch();
//  const navigate = useNavigate();

//  const topicId = sessionStorage.getItem("topicId");
//  const quizinstructions = useSelector(
//    (state) => state.fetchquizinstruction.quizinstructiondetails
//  );

//  const learnerId = sessionStorage.getItem("UserSessionID");
//  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//  console.log(getlearners);

// //  const learnerAttemptId = sessionStorage.getItem("learnerAttemptId");
// //  const learnersAttemptId = useSelector(
// //    (state) => state.learnerscore.learnerscoredetails
// //  );
// //  console.log("hil,", learnersAttemptId);

//   const learnerattemptid=useSelector(
//     (state)=>state.learnerattempt.attemptId
//   );
//   console.log("learnerattemptid",learnerattemptid)

//   const score=useSelector(
//     (state)=>state.learnerscore.learnerscoredetails
//   );
//   console.log("learnerscore",score.score)

//  useEffect(() => {
//    dispatch(fetchQuizInstructionRequest(topicId));
//    dispatch(fetchlearneridRequest(learnerId));
//     // dispatch(fetchlearnerscoreRequest(learnerattemptid));
//   //  debugger;
//   //  dispatch(fetchlearnerscoreRequest(learnerAttemptId));
//  }, [dispatch]);

//  const divStyle = {
//    boxShadow: "0px 4px 8px #23275c",
//  };

//     return (
//       <div>
//           <AdminNavbar />

//         <div class="container">
//       <div >
//         <button
//           class="btn btn-light"
//           style={{
//             marginLeft: "100%",
//             marginTop: "60%",
//             backgroundColor: "#365486",
//             color: "white",
//             width: "50",
//           }}
//           // onClick={() => {handleNavigate();}}
//         >
//           Back
//         </button>
//       </div>

//       <Container fluid id="container" style={divStyle}>
//         <Box
//           id="instruction"
//           sx={{
//             width: "100%",
//             maxWidth: 500,
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//             gap: 2,
//           }}
//         >
//           <Card style={{ height: "50px", marginLeft: "-14%" }} variant="soft">
//             <CardContent>
//               <Typography level="title-md">
//                 {quizinstructions.nameOfQuiz} Assessment Result
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card id="card" variant="soft">
//             <CardContent>
//               <Divider inset="none" id="divider" />
//               <Typography level="title-md">
//                 Duration : {quizinstructions.duration}{" "}
//               </Typography>
//               <Typography level="title-md">
//                 Pass Mark : {quizinstructions.passMark}{" "}
//               </Typography>
//               <Typography level="title-md">
//                 Attempts Allowed : {quizinstructions.attemptsAllowed}
//               </Typography>
//               <Divider inset="none" id="divider" />
//               <Typography>
//                 <b>Score Card</b>
//               </Typography>
//               <Typography>
//                 <b>
//                   Dear {getlearners.learnerFirstName}{" "}
//                   {getlearners.learnerLastName},
//                 </b>
//               </Typography>
//               <Typography>
//                 <br></br>
//               </Typography>
//              <Typography>
//                   {learnerattemptid ? (
//                     <div className="scorecard">
//                       {score.score>= quizinstructions.passMark ? (
//                         <>
//                           <h1>
//                             Contragulations {getlearners.learnerFirstName}{" "}
//                             {getlearners.learnerLastName}❗🎉
//                           </h1>
//                           <h1>
//                             You Passed the {quizinstructions.nameOfQuiz}
//                             Assessment
//                           </h1>
//                           <h1>Your Score is {score.score} </h1>
//                           <div>
//                             <div class="emoji emoji--haha">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth">
//                                   <div class="emoji__tongue"></div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div class="emoji emoji--yay">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                             <div class="emoji emoji--wow">
//                               <div class="emoji__face">
//                                 <div class="emoji__eyebrows"></div>
//                                 <div class="emoji__eyes"></div>
//                                 <div class="emoji__mouth"></div>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <>

//                           <h3>
//                             OOPS☹❗ You not cleared the{" "}
//                             {quizinstructions.nameOfQuiz} Assessment
//                           </h3>
//                            <h5>You can retake the quiz now or again revise the courses</h5>
//                           {/* <div class="emoji emoji--sad">
//                             <div class="emoji__face">
//                               <div class="emoji__eyebrows"></div>
//                               <div class="emoji__eyes"></div>
//                               <div class="emoji__mouth"></div>
//                             </div>
//                           </div> */}
//                           <div
//                             style={{ marginLeft: "-1%", marginTop: "20%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                               }}
//                               onClick={() => {
//                                 navigate("/instruction");
//                               }}
//                             >
//                               Retake Quiz
//                             </Button>
//                           </div>
//                           <div
//                             style={{ marginLeft: "-210%", marginTop: "-6%" }}
//                           >
//                             <Button
//                               variant="default"
//                               style={{
//                                 backgroundColor: "#365486",
//                                 color: "whitesmoke",
//                                 width: "150px",
//                                 marginLeft: "50%",
//                               }}
//                               onClick={() => {
//                                 navigate("/quizengine");
//                               }}
//                             >
//                               Go To Course
//                             </Button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ) : (
//                     <p>Loading learner data...</p>
//                   )}
//                 </Typography>

//             </CardContent>
//           </Card>
//         </Box>
//       </Container>
//     </div>
//     </div>
//   );

// };

// export default LearnerScorePage;