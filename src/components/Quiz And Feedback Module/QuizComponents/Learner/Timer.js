import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
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

  // useEffect(() => {
  //   if (learnerAttempt) {
  //     setStartTime(new Date()); // Start time is the current time
  //     const durationInMinutes = learnerAttempt.duration;
  //     const end = new Date();
  //     end.setMinutes(end.getMinutes() + durationInMinutes);
  //     setEndTime(end); // End time is the current time plus the duration
  //   }
  // }, [learnerAttempt]);

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
  const navigate = useNavigate(); // Initialize useNavigate hook

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

        const Toast = Swal.mixin({
          customClass:'swal2-toast-quiz-time-end',
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          background:'red',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "You have reached the time limit",
          color:'white'
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
    <div>
      <h5 id="timerclass" style={{ marginRight: "30px" }}>
        Time Left: {formatTime(timeLeft)}
      </h5>
    </div>
  );
};

export default DynamicTimer;



















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
// import { useNavigate } from "react-router-dom"; // Import useNavigate hook
// import "../../../../Styles/Quiz And Feedback Module/Learner/Timer.css";
// import Swal from "sweetalert2";

// function DynamicTimer() {
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");

//   const dispatch = useDispatch();
//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");

//   useEffect(() => {
//     if (learnersAttemptId) {
//       dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//     }
//   }, [dispatch, learnersAttemptId]);

//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );

//   useEffect(() => {
//     if (learnerAttempt) {
//       setStartTime(learnerAttempt.startTime);
//       setEndTime(learnerAttempt.endTime);
//     }
//   }, [learnerAttempt]);

//   return (
//     <div>
//       <br />
//       <Timer startTime={startTime} endTime={endTime} />
//     </div>
//   );
// }

// const Timer = ({ startTime, endTime }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const navigate = useNavigate(); // Initialize useNavigate hook

//   useEffect(() => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     const interval = setInterval(() => {
//       const now = new Date();

//       if (now >= start && now <= end) {
//         setIsRunning(true);
//         const timeDifference = end - now;
//         setTimeLeft(timeDifference > 0 ? timeDifference : 0);
//       } else {
//         setIsRunning(false);
//         setTimeLeft(0);
//         clearInterval(interval);

//         const Toast = Swal.mixin({
//           customClass:'swal2-toast-quiz-time-end',
//           toast: true,
//           position: "top",
//           showConfirmButton: false,
//           timer: 2000,
//           background:'red',
//           timerProgressBar: true,
//           didOpen: (toast) => {
//             toast.onmouseenter = Swal.stopTimer;
//             toast.onmouseleave = Swal.resumeTimer;
//           }
//         });
//         Toast.fire({
//           icon: "error",
//           title: "You have reached the time limit",
//           color:'white'
//         });
//       // alert('Quiz deleted successfully');
//       setTimeout(() => {
//       navigate(`/learnerscorepage`)
//       }, 2000);

//         // Navigate to learnerscorepage when time ends
//         // navigate("/learnerscorepage");
//       }

//       setCurrentTime(now);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [startTime, endTime, navigate]);

//   const formatTime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0"
//     )}:${String(seconds).padStart(2, "0")}`;
//   };

//   return (
//     <div>
//       <h5 id="timerclass" style={{ marginRight: "30px" }}>
//         Time Left: {formatTime(timeLeft)}
//       </h5>
//     </div>
//   );
// };

// export default DynamicTimer;


















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
//  import "../../../../Styles/Quiz And Feedback Module/Learner/Timer.css";

// function DynamicTimer() {
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");

//   const dispatch = useDispatch();
//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");

//   useEffect(() => {
//     if (learnersAttemptId) {
//       dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//     }
//   }, [dispatch, learnersAttemptId]);

//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );

//   useEffect(() => {
//     if (learnerAttempt) {
//       setStartTime(learnerAttempt.startTime);
//       setEndTime(learnerAttempt.endTime);
//     }
//   }, [learnerAttempt]);
//   const handleStartTimeChange = (e) => {
//     setStartTime(learnerAttempt.startTime);
//   };

//   const handleEndTimeChange = (e) => {
//     setEndTime(e.target.value);
//   };

//   return (
//     <div>
//       <br />
//       <Timer startTime={startTime} endTime={endTime} />
//     </div>
//   );
// }

// const Timer = ({ startTime, endTime }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isRunning, setIsRunning] = useState(false);

//   useEffect(() => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     const interval = setInterval(() => {
//       const now = new Date();

//       if (now >= start && now <= end) {
//         setIsRunning(true);
//         const timeDifference = end - now;
//         setTimeLeft(timeDifference > 0 ? timeDifference : 0);
//       } else {
//         setIsRunning(false);
//         setTimeLeft(0);
//         clearInterval(interval);
//       }

//       setCurrentTime(now);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [startTime, endTime]);

//   const formatTime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0"
//     )}:${String(seconds).padStart(2, "0")}`;
//   };

//   return (
//     <div>
//       {/* {isRunning ? (
//         <h5 className="timerclass">Time Left: {formatTime(timeLeft)}</h5>
//       ) : (
//         // <h2>Timer stopped</h2>
//         <h2> </h2>
//       )} */}
//       <h5 id="timerclass" style={{marginRight:"30px"}}>Time Left: {formatTime(timeLeft)}</h5>
//     </div>
//   );
// };

// export default DynamicTimer;






























// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchlearnerscoreRequest } from "../../../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";
// import "../../../../Styles/Quiz And Feedback Module/Learner/Timer.css";
// import LearnerScorePage from "./LearnerScorePage";
// import { useNavigate } from "react-router-dom";

// function DynamicTimer() {
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");

//   const dispatch = useDispatch();

//   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");

//   useEffect(() => {
//     if (learnersAttemptId) {
//       dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//     }
//   }, [dispatch, learnersAttemptId]);

//   const learnerAttempt = useSelector(
//     (state) => state.learnerscore.learnerscoredetails
//   );

//   useEffect(() => {
//     if (learnerAttempt) {
//       setStartTime(learnerAttempt.startTime);
//       setEndTime(learnerAttempt.endTime);
//     }
//   }, [learnerAttempt]);
//   const handleStartTimeChange = (e) => {
//     setStartTime(learnerAttempt.startTime);
//   };

//   const handleEndTimeChange = (e) => {
//     setEndTime(e.target.value);
//   };

//   return (
//     <div>
//       <br />
//       <Timer startTime={startTime} endTime={endTime} />
//     </div>
//   );
// }

// const Timer = ({ startTime, endTime }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isRunning, setIsRunning] = useState(false);

//   const navigate = useNavigate();
//   function goto() {
//     console.log(isRunning);
//     debugger;
//     if (timeLeft === 0) {
//       window.location.href = "/learnerscorepage";
//       // navigate("/learnerscorepage");
//     }
//     // navigate("/learnerscorepage");
//   }
//   useEffect(() => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     const interval = setInterval(() => {
//       const now = new Date();

//       if (now >= start && now <= end) {
//         setIsRunning(true);
//         const timeDifference = end - now;
//         setTimeLeft(timeDifference > 0 ? timeDifference : 0);
//       } else {
//         setIsRunning(false);
//         setTimeLeft(0);
//         clearInterval(interval);
//       }

//       setCurrentTime(now);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [startTime, endTime]);

//   const formatTime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0"
//     )}:${String(seconds).padStart(2, "0")}`;
//   };

//   return (
//     <div>
//       {isRunning ? (
//         <h5 id="timerclass">Time Left: {formatTime(timeLeft)}</h5>
//       ) : (
//         <>
//           {timeLeft}
//           {goto()}
//         </>

//         // <></>
//       )}
//     </div>
//   );
// };

// export default DynamicTimer;