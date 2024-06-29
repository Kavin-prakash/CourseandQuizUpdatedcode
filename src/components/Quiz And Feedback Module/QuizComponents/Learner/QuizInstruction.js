// import React from "react";
// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Box from "@mui/joy/Box";
// import { Card } from '@mui/joy';
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import { Container } from "react-bootstrap";
// import Divider from "@mui/joy/Divider";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
// import { CreateAttemptRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import { QuizContext } from "./QuizContext";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";

// function QuizInstruction() {
//   const { isReattempt } = React.useContext(QuizContext);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const topicId = sessionStorage.getItem("topicId");

//   const attemptremains=sessionStorage.getItem("attemptRemaining");
//   console.log("attemptremains",attemptremains)

//   const courseId = sessionStorage.getItem('courseId')
//   const LearnerId = sessionStorage.getItem("UserSessionID");
//   const quizinstructions = useSelector(
//     (state) => state.fetchquizinstruction.quizinstructiondetails
//   );
//   const quizId = quizinstructions.quizId;
//   console.log(quizinstructions)

//   // const learnerId = sessionStorage.getItem("UserSessionID");
//   const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
//   // console.log(getlearners);
//   const learnerAttemptId=sessionStorage.getItem("learnerattemptid")

//   const [TakeQuiz, setTakeQuiz] = useState({
//     learnerId: LearnerId,
//     quizId: sessionStorage.getItem("quizId"),
//   });

//   useEffect(() => {
//     dispatch(fetchQuizInstructionRequest(topicId));
//     dispatch(fetchlearneridRequest(LearnerId));
//   }, [dispatch, topicId, LearnerId]);

//   const handleTakeQuiz = () => {
//     sessionStorage.removeItem("selectedOptions");
//     sessionStorage.removeItem("reviewData");
//     sessionStorage.removeItem("answeredQuestions");
//     sessionStorage.removeItem("currentQuestionIndex");
//     sessionStorage.removeItem("flaggedQuestions51");
//     sessionStorage.setItem("quizId", quizId);
//     sessionStorage.setItem("LearnerId", LearnerId);
//     dispatch(CreateAttemptRequest(TakeQuiz));
//     sessionStorage.setItem("learnerAttemptId", Date.now().toString()); // Create a unique learnerAttemptId
//     navigate("/attemptquiz");
//   };

//   const buttonLabel = isReattempt ? 'Reattempt Quiz' : 'Attempt Quiz';

//   // ViewTopics/f1d0cea9-1c18-4140-94db-e05efd60c4f1

//   const divStyle = {
//     boxShadow: "0px 4px 8px #23275c",
//     backgroundColor: "white",
//     width:"1100px",
//     height:"680px"
//   };
//   return (
//     <div>
//       <TopBar />
//       <Container fluid>
//         <div>
//           <div>
//             <button
//               className="btn btn-light"
//               style={{
//                 marginLeft: "90%",
//                 marginTop: "2%",
//                 backgroundColor: "#365486",
//                 color: "white",
//                 width: "50",
//               }}
//               onClick={() => {
//                 navigate(`/ViewTopics/${courseId}`);
//               }}
//             >
//               Back
//             </button>
//           </div>
//           <Container id="instructionpage-container" style={divStyle}>
//             <h4 style={{fontWeight:"bold" ,textAlign:"center", paddingTop:"2%"}}>Quiz Instruction</h4>
//             <Box
//               id="quizinstructionpage"
//               sx={{
//                 width: "100%",
//                 maxWidth: 500,
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//                 gap: 2,
//               }}
//             >
//               <Card
//                 style={{
//                   height:"50px",
//                   width:"400%",
//                   marginLeft:"25%",
//                   marginBottom:"2%",
//                   marginTop:"3%",
//                   backgroundColor:"white",
//                 }}
//                 variant="soft"
//                 id="instruction-topic"
//               >
//                 <CardContent>
//                   <Typography level="title-md">
//                     {quizinstructions.nameOfQuiz} Assessment
//                   </Typography>
//                 </CardContent>
//               </Card>

//               <Card
//                 id="instruction-content"
//                 variant="outlined"
//                 style={{ width:"400%", height:"87%", marginTop:"75px" , marginLeft:"-200px" , backgroundColor:"white"}}
//               >
//                 <CardContent>
//                 <Divider inset="none" id="dividerinstruction" />
//                   <Typography level="title-md">
//                     Duration : {quizinstructions.duration} (In Minutes)
//                   </Typography>
//                   <Typography level="title-md">
//                     Pass Mark : {quizinstructions.passMark}
//                   </Typography>
//                   <Typography level="title-md">
//                   Attempts Allowed : {quizinstructions.attemptsAllowed}
//                   </Typography>
//                   {isReattempt && <Typography level="title-md" style={{ color: "red" }}>Remaining Attempts: {attemptremains}</Typography>}
//                   &nbsp;
//                  <Divider inset="none" id="dividerinstruction" />
//                   <Typography ></Typography>
//                   <Typography>
//                     <b>
//                       Dear {getlearners.learnerFirstName}{" "}
//                       {getlearners.learnerLastName},
//                     </b>
//                   </Typography>
//                   <Typography>
//                     <li>
//                     As soon as you begin the quiz, the countdown timer initiates. It's crucial to finish the quiz within the designated time frame. 
//                     Remember, your responses will only be considered for evaluation if you hit the submit button after answering all the questions.
//                     </li>
//                   </Typography>

//                   <Typography>
//                     <li>
//                     If you attempt to exit or use the back button after initiating the quiz, a confirmation message will appear. 
//                     Please note that doing so will result in you being logged out from the quiz session.
//                     </li>
//                   </Typography>

//                   <Typography>
//                     <b>All the Best!</b>
//                   </Typography>

//                   <br />
//                   <Button
//                     onClick={handleTakeQuiz}
//                     variant="default"
//                     style={{
//                       backgroundColor: "#365486",
//                       color: "whitesmoke",
//                       width: "150px",
//                     }}
//                   >
//                     {/* Attempt Quiz */}
//                     {buttonLabel}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Container>
//         </div>
//       </Container>
//     </div>
//   );
// }

// export default QuizInstruction;  


import React from "react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Box from "@mui/joy/Box";
import { Card } from '@mui/joy';
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Container } from "react-bootstrap";
import Divider from "@mui/joy/Divider";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizInstructionRequest } from "../../../../actions/Quiz And Feedback Module/Learner/QuizInstructionAction";
import { CreateAttemptRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
import { fetchlearneridRequest } from "../../../../actions/Quiz And Feedback Module/Learner/GetLearnerIDAction";
import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
import { QuizContext } from "./QuizContext";
import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
 
 
 
function QuizInstruction() {
  const {isReattempt}=React.useContext(QuizContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topicId = sessionStorage.getItem("topicId");
 
  const attemptremains=sessionStorage.getItem("attemptRemaining");
  console.log("attemptremains",attemptremains)
 
  const LearnerId = sessionStorage.getItem("UserSessionID");
  const quizinstructions = useSelector(
    (state) => state.fetchquizinstruction.quizinstructiondetails
  );
  const quizId = quizinstructions.quizId;
  console.log(quizinstructions)
 
  // const learnerId = sessionStorage.getItem("UserSessionID");
  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
  // console.log(getlearners);
 const learnerAttemptId=sessionStorage.getItem("learnerattemptid")
 
 
  const [TakeQuiz, setTakeQuiz] = useState({
    learnerId: LearnerId,
    quizId: sessionStorage.getItem("quizId"),
  });
 
  useEffect(() => {
    dispatch(fetchQuizInstructionRequest(topicId));
    dispatch(fetchlearneridRequest(LearnerId));
  }, [dispatch, topicId, LearnerId]);
 
 
  const handleTakeQuiz = () => {
    sessionStorage.removeItem("selectedOptions");
    sessionStorage.removeItem("reviewData");
    sessionStorage.removeItem("answeredQuestions");
    sessionStorage.removeItem("currentQuestionIndex");
 
    sessionStorage.setItem("quizId", quizId);
    sessionStorage.setItem("LearnerId", LearnerId);
    dispatch(CreateAttemptRequest(TakeQuiz));
    sessionStorage.setItem("learnerAttemptId", Date.now().toString()); // Create a unique learnerAttemptId
    navigate("/attemptquiz");
  };
 
  const buttonLabel = isReattempt ? 'Reattempt Quiz' : 'Attempt Quiz';
 
  const divStyle = {
    boxShadow: "0px 4px 8px #23275c",
    backgroundColor: "white",
    width:"1100px",
    height:"680px"
  };
 
 
 
 
  return (
    <div>
      <TopBar />
      <Container fluid >
        <div>
          <div>
            <button
              className="btn btn-light"
              style={{
                marginLeft:"90%",
                marginTop:"2%",
                backgroundColor: "#365486",
                color: "white",
                width:"50",
              }}
              onClick={() => {
                navigate("/quizengine");
              }}
            >
              Back
            </button>
          </div>
          <Container id="instructionpage-container" style={divStyle}>
            <h4 style={{fontWeight:"bold" ,textAlign:"center", paddingTop:"2%"}}>Quiz Instruction</h4>
            <Box
              id="quizinstructionpage"
              sx={{
                width: "100%",
                maxWidth:500,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 2,
              }}
            >
              <Card
                style={{
                  height:"50px",
                  width:"400%",
                  marginLeft:"25%",
                  marginBottom:"2%",
                  marginTop:"3%",
                  backgroundColor:"white",
                }}
                id="instruction-topic"
              >
                <CardContent>
                  <Typography level="title-md">
                    {quizinstructions.nameOfQuiz} Assessment
                  </Typography>
                </CardContent>
               </Card>
 
              <Card
                id="instruction-content"
                variant="outlined"
                style={{ width:"400%", height:"87%", marginTop:"75px" , marginLeft:"-200px" , backgroundColor:"white"}}
              >
                <CardContent>
                  <Divider inset="none" id="dividerinstruction" />
                  <Typography level="title-md">
                    Duration : {quizinstructions.duration} (In Minutes)
                  </Typography>
                  <Typography level="title-md">
                    Pass Mark : {quizinstructions.passMark}
                  </Typography>
                  <Typography level="title-md">
                    Attempts Allowed : {quizinstructions.attemptsAllowed}
                  </Typography>
                  {isReattempt && <Typography level="title-md" style={{ color: "red" }}>Remaining Attempts: {attemptremains}</Typography>}
                  &nbsp;
                 <Divider inset="none" id="dividerinstruction" />
                  <Typography >
                    <b>
                      Dear {getlearners.learnerFirstName}{" "}
                      {getlearners.learnerLastName},
                    </b>
                  </Typography>
                  <Typography>
                    <li>
                      The quizzes consists of questions carefully designed to
                      help you self-assess your comprehension of the information
                      presented on the topics covered in the course.
                    </li>
                  </Typography>
                  <Typography>
                    <li>
                      Each question in the quiz consists of "multiple-choice
                      question" (Mcq), "multi-select question" (MSQ) or "True Or
                      False" (T/F) format. Read each question carefully, and
                      attempt the quiz.
                    </li>
                  </Typography>
 
                  <Typography>
                    <li>
                      In "multi-select question (MSQ)", you have to choose more
                      than one option. If your chosen answer is partially
                      correct, you will get half mark.
                    </li>
                  </Typography>
 
                  <Typography>
                    <li>
                    As soon as you begin the quiz, the countdown timer initiates. It's crucial to finish the quiz within the designated time frame.
                    Remember, your responses will only be considered for evaluation if you hit the submit button after answering all the questions.
                    </li>
                  </Typography>
 
                  <Typography>
                    <li>
                    If you attempt to exit or use the back button after initiating the quiz, a confirmation message will appear.
                    Please note that doing so will result in you being logged out from the quiz session.
                    </li>
                  </Typography>
 
                  <Typography>
                    <b>All the Best!</b>
                  </Typography>
 
                  <br />
                  <Button
                    onClick={handleTakeQuiz}
                    variant="default"
                    style={{
                      backgroundColor: "#365486",
                      color: "whitesmoke",
                      width: "150px",
                    }}
                  >
                    {/* Attempt Quiz */}
                    {buttonLabel}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </div>
      </Container>
    </div>
  );
}
 
export default QuizInstruction;  
 