import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
import { useNavigate } from "react-router-dom";
import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
import Timer from "./Timer";
import QuestionNavigationBar from "./QuestionNavigationBar";
import ConfirmationModal from "./ConfirmationModal";

const AttemptQuiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quizId = sessionStorage.getItem("quizId");
  const questions = useSelector((state) => state.AttemptQuiz.questions);
  const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
    return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
  });

  const [selectedOptions, setSelectedOptions] = useState(() => {
    const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
    return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
  });

  const [showModal, setShowModal] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);

  useEffect(() => {
    // Ensure questions are fetched
    if (!questions || questions.length === 0) {
      dispatch(fetchQuestionsRequest(quizId));
    }
  }, [quizId, dispatch, questions]);

  useEffect(() => {
    // Store learnerattemptid in sessionStorage
    if (learnerattemptid) {
      sessionStorage.setItem("learnerattemptid", learnerattemptid);
    }
  }, [learnerattemptid]);

  useEffect(() => {
    sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  useEffect(() => {
    sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
  }, [currentQuestionIndex]);

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

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleOptionChange = (questionId, optionValue, isMSQ) => {
    const learnerAttemptId = learnerattemptid || sessionStorage.getItem("learnerattemptid");

    if (!learnerAttemptId) {
      console.error("learnerAttemptId is not defined");
      return;
    }

    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = { ...prevSelectedOptions };
      if (isMSQ) {
        const selectedForQuestion = updatedOptions[questionId] || [];
        if (selectedForQuestion.includes(optionValue)) {
          updatedOptions[questionId] = selectedForQuestion.filter(
            (opt) => opt !== optionValue
          );
        } else if (selectedForQuestion.length < 3) {
          updatedOptions[questionId] = [...selectedForQuestion, optionValue];
        } else {
          alert("You can select a maximum of 3 options.");
        }
      } else {
        updatedOptions[questionId] = [optionValue];
      }

      // Dispatch action to save the answer
      dispatch(
        selectAnswerRequest({
          learnerAttemptId,
          quizQuestionId: questionId,
          selectedOptions: updatedOptions[questionId],
        })
      );

      return updatedOptions;
    });
  };

  const handleSubmit = () => {
    const attemptId = learnerattemptid || sessionStorage.getItem("learnerattemptid");
    if (attemptId) {
      dispatch(fetchReviewRequest(attemptId));
      setNavigateAway(true);
      navigate("/reviewanswer");
    } else {
      console.error("Attempt ID is missing.");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalConfirm = () => {
    setNavigateAway(true);
    setShowModal(false);
    window.history.back();
  };

  return (
    <div>
      <TopBar />
      <div className="learner-attemptquiz">
        <Timer />
        <div className="attempt-quiz-page">
          <h1 className="quiz-title">Attempt Quiz</h1>
          <div className="quiz-content">
            <QuestionNavigationBar
              questions={questions}
              selectedOptions={selectedOptions}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionClick={handleQuestionClick}
            />
            <div className="main-content1">
              {questions && questions.length > 0 ? (
                <>
                  <div className="question-container">
                    <h5 className="quiz-question">
                      {questions[currentQuestionIndex].questionNo}.{" "}
                      {questions[currentQuestionIndex].question}
                    </h5>
                    <ul className="question-options">
                      {questions[currentQuestionIndex].options.map(
                        (option, optionIndex) => (
                          <li key={optionIndex}>
                            <input
                              type={
                                questions[currentQuestionIndex].questionType ===
                                  "MCQ" ||
                                questions[currentQuestionIndex].questionType ===
                                  "TF" ||
                                questions[currentQuestionIndex].questionType ===
                                  "T/F"
                                  ? "radio"
                                  : "checkbox"
                              }
                              name={
                                questions[currentQuestionIndex].quizQuestionId
                              }
                              value={option.option}
                              checked={
                                selectedOptions[
                                  questions[currentQuestionIndex]
                                    .quizQuestionId
                                ]?.includes(option.option) || false
                              }
                              onChange={() =>
                                handleOptionChange(
                                  questions[currentQuestionIndex]
                                    .quizQuestionId,
                                  option.option,
                                  questions[currentQuestionIndex].questionType ===
                                    "MSQ"
                                )
                              }
                              style={{ cursor: "pointer" }}
                              className="option-type"
                            />
                            {option.option}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="navigation-buttons">
                    <button
                      className="previous-button"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button className="next-button" onClick={handleNext}>
                        Next
                      </button>
                    ) : (
                      <button className="review-button" onClick={handleSubmit}>
                        Review
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <p>Loading questions...</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        show={showModal}
        handleClose={handleModalClose}
        handleConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default AttemptQuiz;





















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     // Ensure questions are fetched
//     if (!questions || questions.length === 0) {
//       dispatch(fetchQuestionsRequest(quizId));
//     }
//   }, [quizId, dispatch, questions]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         event.returnValue = ''; // For Chrome
//       }
//     };

//     const handleBrowserNavigation = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         event.stopImmediatePropagation();
//         // setShowModal(true);
//         window.history.pushState(null, '', window.location.href);
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("popstate", handleBrowserNavigation);
//     window.history.pushState(null, '', window.location.href); // Ensure the initial state is set

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, [navigateAway]);

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     if (!learnerAttemptId) {
//       console.error("learnerAttemptId is not defined");
//       return;
//     }

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     if (attemptId) {
//       dispatch(fetchReviewRequest(attemptId));
//       setNavigateAway(true);
//       navigate("/reviewanswer");
//     } else {
//       console.error("Attempt ID is missing.");
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;


















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     // Ensure questions are fetched
//     if (!questions || questions.length === 0) {
//       dispatch(fetchQuestionsRequest(quizId));
//     }
//   }, [quizId, dispatch, questions]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         event.returnValue = ''; // For Chrome
//       }
//     };

//     const handleBrowserNavigation = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         event.stopImmediatePropagation();
//         setShowModal(true);
//         window.history.pushState(null, '', window.location.href);
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, [navigateAway]);

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     if (!learnerAttemptId) {
//       console.error("learnerAttemptId is not defined");
//       return;
//     }

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     if (attemptId) {
//       dispatch(fetchReviewRequest(attemptId));
//       setNavigateAway(true);
//       navigate("/reviewanswer");
//     } else {
//       console.error("Attempt ID is missing.");
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;























// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

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
//       setShowModal(true);
//       window.history.pushState(null, '', window.location.href);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, [navigateAway]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     if (!learnerAttemptId) {
//       console.error("learnerAttemptId is not defined");
//       return;
//     }

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     if (attemptId) {
//       dispatch(fetchReviewRequest(attemptId));
//       setNavigateAway(true);
//       navigate("/reviewanswer");
//     } else {
//       console.error("Attempt ID is missing.");
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;

























// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     if (learnerattemptid) {
//       sessionStorage.setItem("learnerAttemptId", learnerattemptid);
//     }
//   }, [learnerattemptid]);

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
//       setShowModal(true);
//       window.history.pushState(null, '', window.location.href);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, [navigateAway]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }
//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );
//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     setNavigateAway(true);
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;


























// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

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
//       setShowModal(true);
//       window.history.pushState(null, '', window.location.href);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, [navigateAway]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }
//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );
//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     setNavigateAway(true);
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;





















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       // setShowModal(true);
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   useEffect(() => {
//     const handleBrowserNavigation = () => {
//       if (!showModal) {
//         // Prevent browser navigation
//         window.history.pushState(null, null, window.location.pathname);
//         setShowModal(true);
//       }
//     };

//     window.addEventListener("popstate", handleBrowserNavigation);
//     console.log("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, [showModal]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }
//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );
//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setShowModal(false);
//     // Navigate to the previous page
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           {/* <h1 className="quiz-title">Attempt Quiz</h1> */}
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;




















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   const handleBeforeUnload = (event) => {
//     // Cancel the event as we handle it ourselves
//     event.preventDefault();
//     // Show the confirmation modal
//     // setShowModal(true);
//   };

//   useEffect(() => {
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }
//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );
//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setShowModal(false);
//     // Navigate to the previous page
//     window.history.back();
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;
















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       // Cancel the event as we handle it ourselves
//       event.preventDefault();
//       // Show the confirmation modal
//       setShowModal(true);
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }
//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );
//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     // Navigate to the review page
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     // Close the confirmation modal
//     setShowModal(false);
//     // Allow the user to navigate away
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//     // Navigate to the previous page
//     navigate(-1);
//   };

//   const handleBrowserNavigation = (e) => {
//     // Cancel the event as we handle it ourselves
//     e.preventDefault();
//     // Show the confirmation modal
//     setShowModal(true);
//   };

//   useEffect(() => {
//     // Add event listener for browser navigation
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       // Cleanup: remove event listener
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, []);

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;















// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         // setShowModal(true);
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [navigateAway]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };
//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }
//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );
//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     setNavigateAway(true);
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     navigate(-1); // Navigate to the previous page
//   };

//   const handleBrowserNavigation = (e) => {
//     if (!navigateAway && !showModal) {
//       e.preventDefault();
//       setShowModal(true);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, []);

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
// </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;
















// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal component

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         event.returnValue = "Are you sure you want to leave?";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [navigateAway]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     setNavigateAway(true); // Allow navigation away after submit
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     navigate(-1);
//   };

//   const handleBrowserNavigation = (e) => {
//     if (!navigateAway) {
//       e.preventDefault();
//       setShowModal(true);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, []);

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;



















// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";
// import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal component

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [navigateAway, setNavigateAway] = useState(false);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (!navigateAway) {
//         event.preventDefault();
//         event.returnValue = "Are you sure you want to leave?";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [navigateAway]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     setNavigateAway(true); // Allow navigation away after submit
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleModalConfirm = () => {
//     setNavigateAway(true);
//     setShowModal(false);
//     navigate(-1);
//   };

//   const handleBrowserNavigation = (e) => {
//     if (!navigateAway) {
//       e.preventDefault();
//       setShowModal(true);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("popstate", handleBrowserNavigation);
//     return () => {
//       window.removeEventListener("popstate", handleBrowserNavigation);
//     };
//   }, []);

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         show={showModal}
//         handleClose={handleModalClose}
//         handleConfirm={handleModalConfirm}
//       />
//     </div>
//   );
// };

// export default AttemptQuiz;




















// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import Timer from "./Timer";
// import QuestionNavigationBar from "./QuestionNavigationBar";

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div>
//       <TopBar />
//       <div className="learner-attemptquiz">
//         <Timer />
//         <div className="attempt-quiz-page">
//           <h1 className="quiz-title">Attempt Quiz</h1>
//           <div className="quiz-content">
//             <QuestionNavigationBar
//               questions={questions}
//               selectedOptions={selectedOptions}
//               currentQuestionIndex={currentQuestionIndex}
//               onQuestionClick={handleQuestionClick}
//             />
//             <div className="main-content1">
//               {questions && questions.length > 0 ? (
//                 <>
//                   <div className="question-container">
//                     <h5 className="quiz-question">
//                       {questions[currentQuestionIndex].questionNo}.{" "}
//                       {questions[currentQuestionIndex].question}
//                     </h5>
//                     <ul className="question-options">
//                       {questions[currentQuestionIndex].options.map(
//                         (option, optionIndex) => (
//                           <li key={optionIndex}>
//                             <input
//                               type={
//                                 questions[currentQuestionIndex].questionType ===
//                                   "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                   "T/F"
//                                   ? "radio"
//                                   : "checkbox"
//                               }
//                               name={
//                                 questions[currentQuestionIndex].quizQuestionId
//                               }
//                               value={option.option}
//                               checked={
//                                 selectedOptions[
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId
//                                 ]?.includes(option.option) || false
//                               }
//                               onChange={() =>
//                                 handleOptionChange(
//                                   questions[currentQuestionIndex]
//                                     .quizQuestionId,
//                                   option.option,
//                                   questions[currentQuestionIndex].questionType ===
//                                     "MSQ"
//                                 )
//                               }
//                               style={{ cursor: "pointer" }}
//                               className="option-type"
//                             />
//                             {option.option}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                   <div className="navigation-buttons">
//                     <button
//                       className="previous-button"
//                       onClick={handlePrevious}
//                       disabled={currentQuestionIndex === 0}
//                     >
//                       Previous
//                     </button>
//                     {currentQuestionIndex < questions.length - 1 ? (
//                       <button className="next-button" onClick={handleNext}>
//                         Next
//                       </button>
//                     ) : (
//                       <button className="review-button" onClick={handleSubmit}>
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <p>Loading questions...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

























// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction";
// import { fetchReviewRequest } from "../../../../actions/Quiz And Feedback Module/Learner/ReviewAction";
// import { selectAnswerRequest } from "../../../../actions/Quiz And Feedback Module/Learner/SelectAnswerAction";
// import { useNavigate } from "react-router-dom";
// import "../../../../Styles/Quiz And Feedback Module/Learner/AttemptQuiz.css";
// // import LearnerNavbar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// import Timer from "./Timer";
// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);

//   const learnerattemptid = useSelector(
//     (state) => state.learnerattempt.attemptId
//   );

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem(
//       "currentQuestionIndex"
//     );
//     return storedCurrentQuestionIndex
//       ? parseInt(storedCurrentQuestionIndex)
//       : 0;
//   });

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem("selectedOptions");
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   // Fetch questions when the component mounts and reset selected options
//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   // Update session storage when selectedOptions change
//   useEffect(() => {
//     sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   // Update session storage when currentQuestionIndex changes
//   useEffect(() => {
//     sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter(
//             (opt) => opt !== optionValue
//           );
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert("You can select a maximum of 3 options.");
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(
//         selectAnswerRequest({
//           learnerAttemptId,
//           quizQuestionId: questionId,
//           selectedOptions: updatedOptions[questionId],
//         })
//       );

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate("/reviewanswer");
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div>
//       <TopBar/>
//     <div className="learner-attemptquiz">
//       {/* <AdminNavbar /> */}
//       <Timer />
//       <div className="attempt-quiz-page">
//         <h1 className="quiz-title">Attempt Quiz</h1>
//         <div className="quiz-content">
//           <div className="navbar">
//             {questions && questions.length > 0 ? (
//               questions.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuestionClick(index)}
//                   className={
//                     selectedOptions[questions[index].quizQuestionId]?.length > 0
//                       ? "answered"
//                       : ""
//                   }
//                 >
//                   {index + 1}
//                 </button>
//               ))
//             ) : (
//               <p>No questions available</p>
//             )}
//           </div>
//           <div className="main-content1">
//             {questions && questions.length > 0 ? (
//               <>
//                 <div className="question-container">
//                   <h5 className="quiz-question">
//                     {questions[currentQuestionIndex].questionNo}.{" "}
//                     {questions[currentQuestionIndex].question}
//                   </h5>
//                   <ul className="question-options">
//                     {questions[currentQuestionIndex].options.map(
//                       (option, optionIndex) => (
//                         <li key={optionIndex}>
//                           <input
//                             type={
//                               questions[currentQuestionIndex].questionType ===
//                                 "MCQ" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                 "TF" ||
//                                 questions[currentQuestionIndex].questionType ===
//                                 "T/F"
//                                 ? "radio"
//                                 : "checkbox"
//                             }
//                             name={
//                               questions[currentQuestionIndex].quizQuestionId
//                             }
//                             value={option.option}
//                             checked={
//                               selectedOptions[
//                                 questions[currentQuestionIndex].quizQuestionId
//                               ]?.includes(option.option) || false
//                             }
//                             onChange={() =>
//                               handleOptionChange(
//                                 questions[currentQuestionIndex].quizQuestionId,
//                                 option.option,
//                                 questions[currentQuestionIndex].questionType ===
//                                 "MSQ"
//                               )
//                             }
//                             style={{ cursor: "pointer" }} className="option-type"
//                           />
//                           {option.option}
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 </div>
//                 <div className="navigation-buttons">
//                   <button
//                     className="previous-button"
//                     onClick={handlePrevious}
//                     disabled={currentQuestionIndex === 0}
//                   >
//                     Previous
//                   </button>
//                   {currentQuestionIndex < questions.length - 1 ? (
//                     <button className="next-button" onClick={handleNext}>
//                       Next
//                     </button>
//                   ) : (
//                     <button className="review-button" onClick={handleSubmit}>
//                       Review
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <p>Loading questions...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default AttemptQuiz;




// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';
// import AdminNavbar from './AdminNavbar';
// import Timer from "../../../components/Quiz And Feedback Module/QuizComponents/Timer"

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const storedCurrentQuestionIndex = sessionStorage.getItem('currentQuestionIndex');
//     return storedCurrentQuestionIndex ? parseInt(storedCurrentQuestionIndex) : 0;
//   });
//git branch learnerintegrated
//git add .
//git commit -m"integrated"
//git checkout learnerintegrated
//git push origin learnerintegrated
//

//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   // Fetch questions when the component mounts and reset selected options
//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   // Update session storage when selectedOptions change
//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   // Update session storage when currentQuestionIndex changes
//   useEffect(() => {
//     sessionStorage.setItem('currentQuestionIndex', currentQuestionIndex);
//   }, [currentQuestionIndex]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className='learner-attemptquiz'>
//       <AdminNavbar />
//   <Timer/>
//       <div className="attempt-quiz-page">
//         <h1 className="quiz-title">Attempt Quiz</h1>
//         <div className="quiz-content">
//           <div className="navbar">
//             {questions && questions.length > 0 ? (
//               questions.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuestionClick(index)}
//                   className={selectedOptions[questions[index].quizQuestionId]?.length > 0 ? 'answered' : ''}
//                 >
//                   {index + 1}
//                 </button>
//               ))
//             ) : (
//               <p>No questions available</p>
//             )}
//           </div>
//           <div className="main-content1">
//             {questions && questions.length > 0 ? (
//               <>
//                 <div className="question-container">
//                   <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                   <ul>
//                     {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                       <li key={optionIndex}>
//                         <input
//                           type={
//                             questions[currentQuestionIndex].questionType === 'MCQ' ||
//                             questions[currentQuestionIndex].questionType === 'TF' ||
//                             questions[currentQuestionIndex].questionType === 'T/F'
//                               ? 'radio'
//                               : 'checkbox'
//                           }
//                           name={questions[currentQuestionIndex].quizQuestionId}
//                           value={option.option}
//                           checked={
//                             selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                           }
//                           onChange={() => handleOptionChange(
//                             questions[currentQuestionIndex].quizQuestionId,
//                             option.option,
//                             questions[currentQuestionIndex].questionType === 'MSQ'
//                           )}
//                           style={{ cursor: 'pointer' }}
//                         />
//                         {option.option}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="navigation-buttons">
//                   <button
//                     className="previous-button"
//                     onClick={handlePrevious}
//                     disabled={currentQuestionIndex === 0}
//                   >
//                     Previous
//                   </button>
//                   {currentQuestionIndex < questions.length - 1 ? (
//                     <button className="next-button" onClick={handleNext}>
//                       Next
//                     </button>
//                   ) : (
//                     <button className="review-button" onClick={handleSubmit}>
//                       Review
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <p>Loading questions...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';
// import AdminNavbar from './AdminNavbar';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   // State to track answered questions
//   const [answeredQuestions, setAnsweredQuestions] = useState(() => {
//     const storedAnsweredQuestions = sessionStorage.getItem('answeredQuestions');
//     return storedAnsweredQuestions ? JSON.parse(storedAnsweredQuestions) : {};
//   });

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   useEffect(() => {
//     sessionStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
//   }, [answeredQuestions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Update the answered status
//       setAnsweredQuestions((prevAnsweredQuestions) => ({
//         ...prevAnsweredQuestions,
//         [questionId]: updatedOptions[questionId].length > 0,
//       }));

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className='learner-attemptquiz'>
//       <AdminNavbar />
//       <div className="attempt-quiz-page">
//         <h1 className="quiz-title">Attempt Quiz</h1>
//         <div className="quiz-content">
//           <div className="navbar">
//             {questions && questions.length > 0 ? (
//               questions.map((question, index) => {
//                 const isAnswered = answeredQuestions[question.quizQuestionId];
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => handleQuestionClick(index)}
//                     className={isAnswered ? 'answered' : 'unanswered'}
//                   >
//                     {index + 1}
//                   </button>
//                 );
//               })
//             ) : (
//               <p>No questions available</p>
//             )}
//           </div>
//           <div className="main-content1">
//             {questions && questions.length > 0 ? (
//               <>
//                 <div className="question-container">
//                   <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                   <ul>
//                     {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                       <li key={optionIndex}>
//                         <input
//                           type={
//                             questions[currentQuestionIndex].questionType === 'MCQ' ||
//                             questions[currentQuestionIndex].questionType === 'TF' ||
//                             questions[currentQuestionIndex].questionType === 'T/F'
//                               ? 'radio'
//                               : 'checkbox'
//                           }
//                           name={questions[currentQuestionIndex].quizQuestionId}
//                           value={option.option}
//                           checked={
//                             selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                           }
//                           onChange={() => handleOptionChange(
//                             questions[currentQuestionIndex].quizQuestionId,
//                             option.option,
//                             questions[currentQuestionIndex].questionType === 'MSQ'
//                           )}
//                           style={{ cursor: 'pointer' }}
//                         />
//                         {option.option}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="navigation-buttons">
//                   <button
//                     className="previous-button"
//                     onClick={handlePrevious}
//                     disabled={currentQuestionIndex === 0}
//                   >
//                     Previous
//                   </button>
//                   {currentQuestionIndex < questions.length - 1 ? (
//                     <button className="next-button" onClick={handleNext}>
//                       Next
//                     </button>
//                   ) : (
//                     <button className="review-button" onClick={handleSubmit}>
//                       Review
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <p>Loading questions...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';
// import AdminNavbar from './AdminNavbar';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className='learner-attemptquiz'>
//       <AdminNavbar />
//       <div className="attempt-quiz-page">
//         <h1 className="quiz-title">Attempt Quiz</h1>
//         <div className="quiz-content">
//           <div className="navbar">
//             {questions && questions.length > 0 ? (
//               questions.map((question, index) => {
//                 const isAnswered = selectedOptions[question.quizQuestionId] && selectedOptions[question.quizQuestionId].length > 0;
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => handleQuestionClick(index)}
//                     className={isAnswered ? 'answered' : 'unanswered'}
//                   >
//                     {index + 1}
//                   </button>
//                 );
//               })
//             ) : (
//               <p>No questions available</p>
//             )}
//           </div>
//           <div className="main-content1">
//             {questions && questions.length > 0 ? (
//               <>
//                 <div className="question-container">
//                   <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                   <ul>
//                     {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                       <li key={optionIndex}>
//                         <input
//                           type={
//                             questions[currentQuestionIndex].questionType === 'MCQ' ||
//                             questions[currentQuestionIndex].questionType === 'TF' ||
//                             questions[currentQuestionIndex].questionType === 'T/F'
//                               ? 'radio'
//                               : 'checkbox'
//                           }
//                           name={questions[currentQuestionIndex].quizQuestionId}
//                           value={option.option}
//                           checked={
//                             selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                           }
//                           onChange={() => handleOptionChange(
//                             questions[currentQuestionIndex].quizQuestionId,
//                             option.option,
//                             questions[currentQuestionIndex].questionType === 'MSQ'
//                           )}
//                           style={{ cursor: 'pointer' }}
//                         />
//                         {option.option}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="navigation-buttons">
//                   <button
//                     className="previous-button"
//                     onClick={handlePrevious}
//                     disabled={currentQuestionIndex === 0}
//                   >
//                     Previous
//                   </button>
//                   {currentQuestionIndex < questions.length - 1 ? (
//                     <button className="next-button" onClick={handleNext}>
//                       Next
//                     </button>
//                   ) : (
//                     <button className="review-button" onClick={handleSubmit}>
//                       Review
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <p>Loading questions...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';
// import AdminNavbar from './AdminNavbar';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const learnerattemptid = useSelector((state) => state.learnerattempt.attemptId);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });

//   useEffect(() => {
//     if (quizId) {
//       fetchQuestions(quizId);
//     }
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId: learnerattemptid,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className='learner-attemptquiz'>
//       <AdminNavbar/>
//       <div className="attempt-quiz-page">
//         <h1 className="quiz-title">Attempt Quiz</h1>
//         <div className="quiz-content">
//           <div className="navbar">
//             {questions && questions.length > 0 ? (
//               questions.map((_, index) => (
//                 <button key={index} onClick={() => handleQuestionClick(index)}>
//                   {index + 1}
//                 </button>
//               ))
//             ) : (
//               <p>No questions available</p>
//             )}
//           </div>
//           <div className="main-content1">
//             {questions && questions.length > 0 ? (
//               <>
//                 <div className="question-container">
//                   <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                   <ul>
//                     {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                       <li key={optionIndex}>
//                         <input
//                           type={
//                             questions[currentQuestionIndex].questionType === 'MCQ' ||
//                             questions[currentQuestionIndex].questionType === 'TF' ||
//                             questions[currentQuestionIndex].questionType === 'T/F'
//                               ? 'radio'
//                               : 'checkbox'
//                           }
//                           name={questions[currentQuestionIndex].quizQuestionId}
//                           value={option.option}
//                           checked={
//                             selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                           }
//                           onChange={() => handleOptionChange(
//                             questions[currentQuestionIndex].quizQuestionId,
//                             option.option,
//                             questions[currentQuestionIndex].questionType === 'MSQ'
//                           )}
//                           style={{cursor:'pointer'}}
//                         />
//                         {option.option}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="navigation-buttons">
//                   <button
//                     className="previous-button"
//                     onClick={handlePrevious}
//                     disabled={currentQuestionIndex === 0}
//                   >
//                     Previous
//                   </button>
//                   {currentQuestionIndex < questions.length - 1 ? (
//                     <button className="next-button" onClick={handleNext}>
//                       Next
//                     </button>
//                   ) : (
//                     <button className="review-button" onClick={handleSubmit}>
//                       Review
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <p>Loading questions...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';
// import AdminNavbar from './AdminNavbar';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = sessionStorage.getItem("quizId");
//   console.log("quizid",quizId)
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     return storedSelectedOptions ? JSON.parse(storedSelectedOptions) : {};
//   });
//   const learnerattemptid=useSelector(
//     (state)=>state.learnerattempt.attemptId
//   );
//   console.log("learnerattemptid",learnerattemptid)

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   //Clear session storage

//   // const clearQuizSession = () => {
//   //   sessionStorage.removeItem('selectedOptions');
//   //   sessionStorage.removeItem('reviewData');
//   // }

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId =learnerattemptid;

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = learnerattemptid;
//     dispatch(fetchReviewRequest(attemptId));
//     // clearQuizSession();
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className='learner-attemptquiz'>
//       <AdminNavbar/>
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                     <li key={optionIndex}>
//                       <input
//                         type={
//                           questions[currentQuestionIndex].questionType === 'MCQ' ||
//                           questions[currentQuestionIndex].questionType === 'TF' ||
//                           questions[currentQuestionIndex].questionType === 'T/F'
//                             ? 'radio'
//                             : 'checkbox'
//                         }
//                         name={questions[currentQuestionIndex].quizQuestionId}
//                         value={option.option}
//                         checked={
//                           selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                         }
//                         onChange={() => handleOptionChange(
//                           questions[currentQuestionIndex].quizQuestionId,
//                           option.option,
//                           questions[currentQuestionIndex].questionType === 'MSQ'
//                         )}
//                         style={{cursor:'pointer'}}
//                       />
//                       {option.option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {/* {selectAnswerError && <p className="error-message">Error: {selectAnswerError}</p>} */}
//               <div className="navigation-buttons">
//                 <button
//                   className="previous-button"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button className="next-button" onClick={handleNext}>
//                     Next
//                   </button>
//                 ) : (
//                   <button className="review-button" onClick={handleSubmit}>
//                     Review
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = "1cf196c9-e9f7-4224-83be-e2d3dca69976";
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     if (questions && questions.length > 0) {
//       const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//       if (storedSelectedOptions) {
//         setSelectedOptions(JSON.parse(storedSelectedOptions));
//       }
//     }
//   }, [questions]);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = "08dc851b-dafb-4f66-8b5d-d483fd11d01c";

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = "08dc851b-dafb-4f66-8b5d-d483fd11d01c";
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                     <li key={optionIndex}>
//                       <input
//                         type={
//                           questions[currentQuestionIndex].questionType === 'MCQ' ||
//                           questions[currentQuestionIndex].questionType === 'TF' ||
//                           questions[currentQuestionIndex].questionType === 'T/F'
//                             ? 'radio'
//                             : 'checkbox'
//                         }
//                         name={questions[currentQuestionIndex].quizQuestionId}
//                         value={option.option}
//                         checked={
//                           selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                         }
//                         onChange={() => handleOptionChange(
//                           questions[currentQuestionIndex].quizQuestionId,
//                           option.option,
//                           questions[currentQuestionIndex].questionType === 'MSQ'
//                         )}
//                       />
//                       {option.option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {selectAnswerError && <p className="error-message">Error: {selectAnswerError}</p>}
//               <div className="navigation-buttons">
//                 <button
//                   className="previous-button"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button className="next-button" onClick={handleNext}>
//                     Next
//                   </button>
//                 ) : (
//                   <button className="submit-button" onClick={handleSubmit}>
//                     Review
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = "1cf196c9-e9f7-4224-83be-e2d3dca69976";
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     if (storedSelectedOptions) {
//       setSelectedOptions(JSON.parse(storedSelectedOptions));
//     }
//   }, []);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = "08dc8520-e94b-4dc7-87c5-719485f51bce";

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = "08dc8520-e94b-4dc7-87c5-719485f51bce";
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                     <li key={optionIndex}>
//                       <input
//                         type={
//                           questions[currentQuestionIndex].questionType === 'MCQ' ||
//                           questions[currentQuestionIndex].questionType === 'TF' ||
//                           questions[currentQuestionIndex].questionType === 'T/F'
//                             ? 'radio'
//                             : 'checkbox'
//                         }
//                         name={questions[currentQuestionIndex].quizQuestionId}
//                         value={option.option}
//                         checked={
//                           selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                         }
//                         onChange={() => handleOptionChange(
//                           questions[currentQuestionIndex].quizQuestionId,
//                           option.option,
//                           questions[currentQuestionIndex].questionType === 'MSQ'
//                         )}
//                       />
//                       {option.option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {selectAnswerError && <p className="error-message">Error: {selectAnswerError}</p>}
//               <div className="navigation-buttons">
//                 <button
//                   className="previous-button"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button className="next-button" onClick={handleNext}>
//                     Next
//                   </button>
//                 ) : (
//                   <button className="submit-button" onClick={handleSubmit}>
//                     Review
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = "1cf196c9-e9f7-4224-83be-e2d3dca69976";
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   useEffect(() => {
//     const storedSelectedOptions = sessionStorage.getItem('selectedOptions');
//     if (storedSelectedOptions) {
//       setSelectedOptions(JSON.parse(storedSelectedOptions));
//     }
//   }, []);

//   useEffect(() => {
//     sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
//   }, [selectedOptions]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = "08dc8520-e94b-4dc7-87c5-719485f51bce";

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = "08dc8520-e94b-4dc7-87c5-719485f51bce";
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer');
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                     <li key={optionIndex}>
//                       <input
//                         type={
//                           questions[currentQuestionIndex].questionType === 'MCQ' ||
//                           questions[currentQuestionIndex].questionType === 'TF' ||
//                           questions[currentQuestionIndex].questionType === 'T/F'
//                             ? 'radio'
//                             : 'checkbox'
//                         }
//                         name={questions[currentQuestionIndex].quizQuestionId}
//                         value={option.option}
//                         checked={
//                           selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                         }
//                         onChange={() => handleOptionChange(
//                           questions[currentQuestionIndex].quizQuestionId,
//                           option.option,
//                           questions[currentQuestionIndex].questionType === 'MSQ'
//                         )}
//                       />
//                       {option.option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {selectAnswerError && <p className="error-message">Error: {selectAnswerError}</p>}
//               <div className="navigation-buttons">
//                 <button
//                   className="previous-button"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button className="next-button" onClick={handleNext}>
//                     Next
//                   </button>
//                 ) : (
//                   <button className="submit-button" onClick={handleSubmit}>
//                     Review
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = "1cf196c9-e9f7-4224-83be-e2d3dca69976";
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error); // Error state
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   // sessionStorage.setItem("AttemptId", attemptId);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = "08dc851b-dafb-4f66-8b5d-d483fd11d01c";

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];

//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else if (selectedForQuestion.length < 3) {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         } else {
//           alert('You can select a maximum of 3 options.');
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = "08dc851b-dafb-4f66-8b5d-d483fd11d01c";
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer'); // Navigate to the review page
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                     <li key={optionIndex}>
//                       <input
//                         type={
//                           questions[currentQuestionIndex].questionType === 'MCQ' ||
//                           questions[currentQuestionIndex].questionType === 'TF' ||
//                           questions[currentQuestionIndex].questionType === 'T/F'
//                             ? 'radio'
//                             : 'checkbox'
//                         }
//                         name={questions[currentQuestionIndex].quizQuestionId}
//                         value={option.option}
//                         checked={
//                           selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                         }
//                         onChange={() => handleOptionChange(
//                           questions[currentQuestionIndex].quizQuestionId,
//                           option.option,
//                           questions[currentQuestionIndex].questionType === 'MSQ'
//                         )}
//                       />
//                       {option.option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {selectAnswerError && <p className="error-message">Error: {selectAnswerError}</p>} {/* Display error */}
//               <div className="navigation-buttons">
//                 <button
//                   className="previous-button"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button className="next-button" onClick={handleNext}>
//                     Next
//                   </button>
//                 ) : (
//                   <button className="submit-button" onClick={handleSubmit}>
//                     Review
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQuestionsRequest } from '../../../actions/Quiz And Feedback Module/AttemptQuizAction';
// import { fetchReviewRequest } from '../../../actions/Quiz And Feedback Module/ReviewAction';
// import { selectAnswerRequest } from '../../../actions/Quiz And Feedback Module/SelectAnswerAction';
// import { useNavigate } from 'react-router-dom';
// import '../../../Styles/Quiz And Feedback Module/AttemptQuiz.css';

// const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const quizId = "1cf196c9-e9f7-4224-83be-e2d3dca69976";
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const selectAnswerError = useSelector((state) => state.AttemptQuiz.error); // Error state
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleOptionChange = (questionId, optionValue, isMSQ) => {
//     const learnerAttemptId = "08dc845d-55e6-4967-8f9b-2e266f883a58";

//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedOptions = { ...prevSelectedOptions };

//       if (isMSQ) {
//         const selectedForQuestion = updatedOptions[questionId] || [];
//         if (selectedForQuestion.includes(optionValue)) {
//           updatedOptions[questionId] = selectedForQuestion.filter((opt) => opt !== optionValue);
//         } else {
//           updatedOptions[questionId] = [...selectedForQuestion, optionValue];
//         }
//       } else {
//         updatedOptions[questionId] = [optionValue];
//       }

//       // Dispatch action to save the answer
//       dispatch(selectAnswerRequest({
//         learnerAttemptId,
//         quizQuestionId: questionId,
//         selectedOptions: updatedOptions[questionId],
//       }));

//       return updatedOptions;
//     });
//   };

//   const handleSubmit = () => {
//     const attemptId = "08dc845d-55e6-4967-8f9b-2e266f883a58";
//     dispatch(fetchReviewRequest(attemptId));
//     navigate('/reviewanswer'); // Navigate to the review page
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>{questions[currentQuestionIndex].questionNo}. {questions[currentQuestionIndex].question}</h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map((option, optionIndex) => (
//                     <li key={optionIndex}>
//                       <input
//                         type={
//                           questions[currentQuestionIndex].questionType === 'MCQ' ||
//                           questions[currentQuestionIndex].questionType === 'TF' ||
//                           questions[currentQuestionIndex].questionType === 'T/F'
//                             ? 'radio'
//                             : 'checkbox'
//                         }
//                         name={questions[currentQuestionIndex].quizQuestionId}
//                         value={option.option}
//                         checked={
//                           selectedOptions[questions[currentQuestionIndex].quizQuestionId]?.includes(option.option) || false
//                         }
//                         onChange={() => handleOptionChange(
//                           questions[currentQuestionIndex].quizQuestionId,
//                           option.option,
//                           questions[currentQuestionIndex].questionType === 'MSQ'
//                         )}
//                       />
//                       {option.option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {selectAnswerError && <p className="error-message">Error: {selectAnswerError}</p>} {/* Display error */}
//               <div className="navigation-buttons">
//                 <button
//                   className="previous-button"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button className="next-button" onClick={handleNext}>
//                     Next
//                   </button>
//                 ) : (
//                   <button className="submit-button" onClick={handleSubmit}>
//                     Review
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuestionsRequest } from "../../../actions/Quiz And Feedback Module/AttemptQuizAction";
// import "../../../Styles/Quiz And Feedback Module/AttemptQuiz.css";

// export const AttemptQuiz = () => {
//   const dispatch = useDispatch();
//   const quizId = "43588fc6-1eb2-4459-8313-527b4276c596";
//   const questions = useSelector((state) => state.AttemptQuiz.questions);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   useEffect(() => {
//     fetchQuestions(quizId);
//   }, [quizId]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       dispatch(fetchQuestionsRequest(quizId));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleSubmit = () => {
//     // Handle form submission logic here
//     console.log("Quiz submitted");
//   };

//   return (
//     <div className="attempt-quiz-page">
//       <h1 className="quiz-title">Attempt Quiz</h1>
//       <div className="quiz-content">
//         <div className="navbar">
//           {questions && questions.length > 0 ? (
//             questions.map((_, index) => (
//               <button key={index} onClick={() => handleQuestionClick(index)}>
//                 {index + 1}
//               </button>
//             ))
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//         <div className="main-content1">
//           {questions && questions.length > 0 ? (
//             <>
//               <div className="question-container">
//                 <h5>
//                   {questions[currentQuestionIndex].questionNo}.{" "}
//                   {questions[currentQuestionIndex].question}
//                 </h5>
//                 <ul>
//                   {questions[currentQuestionIndex].options.map(
//                     (option, optionIndex) => (
//                       <li key={optionIndex}>
//                         <input
//                           type={
//                             questions[currentQuestionIndex].questionType ===
//                               "MCQ" ||
//                             questions[currentQuestionIndex].questionType ===
//                               "TF" ||
//                             questions[currentQuestionIndex].questionType ===
//                               "T/F"
//                               ? "radio"
//                               : "checkbox"
//                           }
//                           name={questions[currentQuestionIndex].quizQuestionId}
//                           value={option.option}
//                         />
//                         {option.option}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>
//               {currentQuestionIndex === questions.length - 1 && (
//                 <button className="submit-button" onClick={handleSubmit}>
//                   Submit
//                 </button>
//               )}
//             </>
//           ) : (
//             <p>No questions available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttemptQuiz;