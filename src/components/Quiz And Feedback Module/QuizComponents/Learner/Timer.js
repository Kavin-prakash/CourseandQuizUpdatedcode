import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
import { useNavigate } from "react-router-dom";
import "../../../../Styles/Quiz And Feedback Module/Learner/Timer.css";
import Swal from "sweetalert2";
 
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
  const [progressTop, setProgressTop] = useState(100);
  const [progressBottom, setProgressBottom] = useState(100);
  const [progressLeft, setProgressLeft] = useState(100);
  const [progressRight, setProgressRight] = useState(100);
  const navigate = useNavigate();
 
  useEffect(() => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalDuration = end - start;
    const segmentDuration = totalDuration / 4; // Split the total duration into four segments
 
    const interval = setInterval(() => {
      const now = new Date();
 
      if (now >= start && now <= end) {
        setIsRunning(true);
        const timeDifference = end - now;
        setTimeLeft(timeDifference > 0 ? timeDifference : 0);
 
        // Update progress for each side
        if (timeDifference <= segmentDuration * 1) {
          setProgressRight((timeDifference / segmentDuration) * 100);
        } else if (timeDifference <= segmentDuration * 2) {
          setProgressRight(0);
          setProgressBottom(((timeDifference - segmentDuration) / segmentDuration) * 100);
        } else if (timeDifference <= segmentDuration * 3) {
          setProgressRight(0);
          setProgressBottom(0);
          setProgressLeft(((timeDifference - segmentDuration * 2) / segmentDuration) * 100);
        } else {
          setProgressRight(0);
          setProgressBottom(0);
          setProgressLeft(0);
          setProgressTop(((timeDifference - segmentDuration * 3) / segmentDuration) * 100);
        }
      } else {
        setIsRunning(false);
        setTimeLeft(0);
        setProgressTop(0);
        setProgressBottom(0);
        setProgressLeft(0);
        setProgressRight(0);
        clearInterval(interval);
 
        const Toast = Swal.mixin({
          customClass: 'swal2-toast-quiz-time-end',
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          background: 'red',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "You have reached the time limit",
          color: 'white'
        });
 
        setTimeout(() => {
          navigate(`/learnerscorepage`);
        }, 2000);
      }
 
      setCurrentTime(now);
 
    }, 1000);
 
    return () => clearInterval(interval);
  }, [startTime, endTime, navigate]);
 
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
    <div className="timer-rectangle">
      <h5 id="timerclass">
        Time Left: {formatTime(timeLeft)}
      </h5>
      {/* <div className="progress-bar-container">
        <div
          className="progress-bar progress-bar-top"
          style={{ width: `${progressTop}%` }}
        ></div>
        <div
          className="progress-bar progress-bar-bottom"
          style={{ width: `${progressBottom}%` }}
        ></div>
        <div
          className="progress-bar progress-bar-left"
          style={{ height: `${progressLeft}%` }}
        ></div>
        <div
          className="progress-bar progress-bar-right"
          style={{ height: `${progressRight}%` }}
        ></div>
      </div> */}
    </div>
  );
};
 
export default DynamicTimer;