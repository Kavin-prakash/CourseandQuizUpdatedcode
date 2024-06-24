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

function QuizInstruction() {
  const {isReattempt}=React.useContext(QuizContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topicId = sessionStorage.getItem("topicId");

  const LearnerId = sessionStorage.getItem("UserSessionID");
  const quizinstructions = useSelector(
    (state) => state.fetchquizinstruction.quizinstructiondetails
  );
  const quizId = quizinstructions.quizId;
  console.log(quizinstructions)

  // const learnerId = sessionStorage.getItem("UserSessionID");
  const getlearners = useSelector((state) => state.fetchlearnerid.learnerId);
  // console.log(getlearners);

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

  return (
    <div>
      <TopBar />
      <Container fluid>
        <div>
          <div>
            <button
              className="btn btn-light"
              style={{
                marginLeft: "95%",
                marginTop: "5%",
                backgroundColor: "#365486",
                color: "white",
                width: "50",
              }}
              onClick={() => {
                navigate("/quizengine");
              }}
            >
              Back
            </button>
          </div>
          <Container fluid id="instructionpage-container">
            <Box
              id="quizinstructionpage"
              sx={{
                width: "100%",
                maxWidth: 500,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 2,
              }}
            >
              <Card
                style={{
                  height: "50px",
                  width: "440%",
                  marginLeft: "108%",
                  marginBottom: "2%",
                  marginTop: "-20%",
                }}
                variant="soft"
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
                variant="soft"
                style={{ width: "440%", height: "115%" }}
              >
                <CardContent>
                  <Divider inset="none" id="divider" />
                  <Typography level="title-md">
                    Duration : {quizinstructions.duration} (In Minutes)
                  </Typography>
                  <Typography level="title-md">
                    Pass Mark : {quizinstructions.passMark}
                  </Typography>
                  <Typography level="title-md">
                    Attempts Allowed : {quizinstructions.attemptsAllowed}
                  </Typography>
                  <Divider inset="none" id="divider" />
                  <Typography>
                    <b>Quiz Instruction</b>
                  </Typography>
                  <Typography>
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