import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
import "../../../../Styles/Quiz And Feedback Module/Learner/Timer.css";
import LearnerScorePage from "./LearnerScorePage";
import { useNavigate } from "react-router-dom";

function DynamicTimer() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const dispatch = useDispatch();

  const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");

  useEffect(() => {
    if (learnersAttemptId) {
      dispatch(fetchlearnerscoreRequest(learnersAttemptId));
    }
  }, [dispatch, learnersAttemptId]);

  const learnerAttempt = useSelector(
    (state) => state.learnerscore.learnerscoredetails
  );

  useEffect(() => {
    if (learnerAttempt) {
      setStartTime(learnerAttempt.startTime);
      setEndTime(learnerAttempt.endTime);
    }
  }, [learnerAttempt]);
  const handleStartTimeChange = (e) => {
    setStartTime(learnerAttempt.startTime);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  return (
    <div>
      <br />
      <Timer startTime={startTime} endTime={endTime} />
    </div>
  );
}

const Timer = ({ startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const navigate = useNavigate();
  function goto() {
    console.log(isRunning);
    debugger;
    if (timeLeft === 0) {
      window.location.href = "/learnerscorepage";
      // navigate("/learnerscorepage");
    }
    // navigate("/learnerscorepage");
  }
  useEffect(() => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const interval = setInterval(() => {
      const now = new Date();

      if (now >= start && now <= end) {
        setIsRunning(true);
        const timeDifference = end - now;
        setTimeLeft(timeDifference > 0 ? timeDifference : 0);
      } else {
        setIsRunning(false);
        setTimeLeft(0);
        clearInterval(interval);
      }

      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      {isRunning ? (
        <h5 id="timerclass">Time Left: {formatTime(timeLeft)}</h5>
      ) : (
        <>
          {timeLeft}
          {goto()}
        </>

        // <></>
      )}
    </div>
  );
};

export default DynamicTimer;
