import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
import { useNavigate } from 'react-router-dom';
import QuestionNavigationBar from './QuestionNavigationBar';
import { Container } from 'react-bootstrap';
import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";


const ReviewAnswers = ({ attemptId }) => {
const dispatch = useDispatch();
const navigate = useNavigate();
const reviewDataFromStore = useSelector((state) => state.Review.reviewData);  
const questionsFromStore = useSelector((state) => state.AttemptQuiz.questions);
const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
const AttemptId = reviewDataFromStore?.learnerAttemptId;

const [showPopup, setShowPopup] = useState(false);
const [selectedQuestion, setSelectedQuestion] = useState(0);
const [localReviewData, setLocalReviewData] = useState(null);
const [localQuestions, setLocalQuestions] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);
const [unansweredError, setUnansweredError] = useState(false);

// Initialize state from sessionStorage or fetch data
useEffect(() => {
    const storedReviewData = sessionStorage.getItem('reviewData');
    const storedQuestions = sessionStorage.getItem('questions');
    const quizId = sessionStorage.getItem('quizId');

    if (storedReviewData) {
        setLocalReviewData(JSON.parse(storedReviewData));
    } else if (attemptId) {
        dispatch(fetchReviewRequest(attemptId));
    }

    if (storedQuestions) {
        setLocalQuestions(JSON.parse(storedQuestions));
    } else if (quizId) {
        dispatch(fetchQuestionsRequest(quizId));
    }
}, [dispatch, attemptId]);

// Update sessionStorage and local state when reviewData changes
useEffect(() => {
    if (reviewDataFromStore) {
        sessionStorage.setItem('reviewData', JSON.stringify(reviewDataFromStore));
        setLocalReviewData(reviewDataFromStore);
    }
}, [reviewDataFromStore]);

// Update sessionStorage and local state when questions change
useEffect(() => {
    if (questionsFromStore.length > 0) {
        sessionStorage.setItem('questions', JSON.stringify(questionsFromStore));
        setLocalQuestions(questionsFromStore);
    }
}, [questionsFromStore]);

// Prevent accidental page unload
useEffect(() => {
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // For most browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
}, []);

const handleSubmit = () => {
    const allAnswered = localQuestions.every(question => {
        const response = localReviewData.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
        return response && response.selectedOptions && response.selectedOptions.length > 0;
    });

    if (!allAnswered) {
        setUnansweredError(true);
        return;
    }

    if (AttemptId && !isSubmitting) {
        setIsSubmitting(true);
        dispatch(submitAttemptRequest(AttemptId)).then(() => {
            setIsSubmitting(false);
            navigate('/learnerscorepage');
        }).catch(() => {
            setIsSubmitting(false);
        });
        setShowPopup(false);
    } else {
        console.error("Attempt ID is missing or submission is already in progress");
    }
};

const handleNavigate = () => {
    navigate('/attemptquiz');
};

const handleSelectQuestion = (index) => {
    setSelectedQuestion(index);
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const data = localReviewData;

if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
    return <p>No data available.</p>;
}

return (
    <div>
        <TopBar />
        <Container fluid style={{ marginTop: "700px" }}>
            <div className="review-answers-container">
                <br />
                <div className="question-navigation-bar">
                    <QuestionNavigationBar
                        questions={localQuestions}
                        selectedOptions={data.questionResponses.reduce((acc, response) => {
                            acc[response.quizQuestionId] = response.selectedOptions || [];
                            return acc;
                        }, {})}
                        currentQuestionIndex={selectedQuestion}
                        onQuestionClick={handleSelectQuestion}
                    />
                </div>

                <div className="review-answers-content">
                    {localQuestions.map((question, index) => {
                        const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
                        return (
                            <div
                                key={question.quizQuestionId}
                                id={`question-${index}`}
                                className="review-question-container"
                            >
                                <h5>{index + 1}: {question.question}</h5>
                                <ul className="question-options">
                                    {question.options.map((option, optionIndex) => (
                                        <li key={optionIndex}>
                                            <input
                                                type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
                                                name={question.quizQuestionId}
                                                value={option.option}
                                                checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
                                                readOnly
                                                style={{ cursor: "pointer" }} className="option-type"
                                            />
                                            &nbsp; &nbsp;
                                            {option.option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}

                    <div className="button-container">
                        <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
                        <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
                    </div>

                    {showPopup && (
                        <div className="reviewanswers-popup">
                            <div className="popup-content">
                                <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
                                <br />
                                {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
                                <p className='submit-quiz'>Are you sure you want to submit?</p>
                                <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
                                <button onClick={() => setShowPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {submitLoading && <p>Submitting...</p>}
                    {submitSuccess && <p>Submitted successfully!</p>}
                </div>
            </div>
        </Container>
    </div>
);
};

export default ReviewAnswers;




















// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewDataFromStore = useSelector((state) => state.Review.reviewData);
//     const questionsFromStore = useSelector((state) => state.AttemptQuiz.questions);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewDataFromStore?.learnerAttemptId;

//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [localQuestions, setLocalQuestions] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);

//     // Initialize state from sessionStorage or fetch data
//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         const storedQuestions = sessionStorage.getItem('questions');
//         const storedAttemptId = sessionStorage.getItem('learnerAttemptId');
//         const quizId = sessionStorage.getItem('quizId');

//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         } else if (storedAttemptId) {
//             dispatch(fetchReviewRequest(storedAttemptId));
//         }

//         if (storedQuestions) {
//             setLocalQuestions(JSON.parse(storedQuestions));
//         } else if (quizId) {
//             dispatch(fetchQuestionsRequest(quizId));
//         }
//     }, [dispatch, attemptId]);

//     // Update sessionStorage and local state when reviewData changes
//     useEffect(() => {
//         if (reviewDataFromStore) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewDataFromStore));
//             setLocalReviewData(reviewDataFromStore);
//         }
//     }, [reviewDataFromStore]);

//     // Update sessionStorage and local state when questions change
//     useEffect(() => {
//         if (questionsFromStore.length > 0) {
//             sessionStorage.setItem('questions', JSON.stringify(questionsFromStore));
//             setLocalQuestions(questionsFromStore);
//         }
//     }, [questionsFromStore]);

//     // Prevent accidental page unload
//     useEffect(() => {
//         const handleBeforeUnload = (event) => {
//             event.preventDefault();
//             event.returnValue = ''; // For most browsers
//         };

//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//             window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//     }, []);

//     const handleSubmit = () => {
//         const allAnswered = localQuestions.every(question => {
//             const response = localReviewData.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });

//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }

//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };

//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };

//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//     };

//     const data = localReviewData;

//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }

//     return (
//         <div>
//             <TopBar />
//             <Container fluid style={{ marginTop: "700px" }}>
//                 <div className="review-answers-container">
//                     <br />
//                     <div className="question-navigation-bar">
//                         <QuestionNavigationBar
//                             questions={localQuestions}
//                             selectedOptions={data.questionResponses.reduce((acc, response) => {
//                                 acc[response.quizQuestionId] = response.selectedOptions || [];
//                                 return acc;
//                             }, {})}
//                             currentQuestionIndex={selectedQuestion}
//                             onQuestionClick={handleSelectQuestion}
//                         />
//                     </div>

//                     <div className="review-answers-content">
//                         {localQuestions.map((question, index) => {
//                             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                             return (
//                                 <div
//                                     key={question.quizQuestionId}
//                                     id={`question-${index}`}
//                                     className="review-question-container"
//                                 >
//                                     <h5>{index + 1}: {question.question}</h5>
//                                     <ul className="question-options">
//                                         {question.options.map((option, optionIndex) => (
//                                             <li key={optionIndex}>
//                                                 <input
//                                                     type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                     name={question.quizQuestionId}
//                                                     value={option.option}
//                                                     checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                     readOnly
//                                                     style={{ cursor: "pointer" }} className="option-type"
//                                                 />
//                                                   &nbsp; &nbsp;
//                                                 {option.option}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             );
//                         })}

//                         <div className="button-container">
//                             <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                             <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                         </div>

//                         {showPopup && (
//                             <div className="reviewanswers-popup">
//                                 <div className="popup-content">
//                                     <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//                                     <br />
//                                     {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                     <p className='submit-quiz'>Are you sure you want to submit?</p>
//                                     <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                     <button onClick={() => setShowPopup(false)}>Cancel</button>
//                                 </div>
//                             </div>
//                         )}

//                         {submitLoading && <p>Submitting...</p>}
//                         {submitSuccess && <p>Submitted successfully!</p>}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default ReviewAnswers;



























// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewDataFromStore = useSelector((state) => state.Review.reviewData);
//     const questionsFromStore = useSelector((state) => state.AttemptQuiz.questions);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewDataFromStore?.learnerAttemptId;

//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [localQuestions, setLocalQuestions] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);

//     // Initialize state from sessionStorage or fetch data
//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         const storedQuestions = sessionStorage.getItem('questions');
//         const quizId = sessionStorage.getItem('quizId');

//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         }

//         if (storedQuestions) {
//             setLocalQuestions(JSON.parse(storedQuestions));
//         } else if (quizId) {
//             dispatch(fetchQuestionsRequest(quizId));
//         }
//     }, [dispatch, attemptId]);

//     // Update sessionStorage and local state when reviewData changes
//     useEffect(() => {
//         if (reviewDataFromStore) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewDataFromStore));
//             setLocalReviewData(reviewDataFromStore);
//         }
//     }, [reviewDataFromStore]);

//     // Update sessionStorage and local state when questions change
//     useEffect(() => {
//         if (questionsFromStore.length > 0) {
//             sessionStorage.setItem('questions', JSON.stringify(questionsFromStore));
//             setLocalQuestions(questionsFromStore);
//         }
//     }, [questionsFromStore]);

//     // Prevent accidental page unload
//     useEffect(() => {
//         const handleBeforeUnload = (event) => {
//             event.preventDefault();
//             event.returnValue = ''; // For most browsers
//         };

//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//             window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//     }, []);

//     const handleSubmit = () => {
//         const allAnswered = localQuestions.every(question => {
//             const response = localReviewData.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });

//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }

//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };

//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };

//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//     };

//     const data = localReviewData;

//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }

//     return (
//         <div>
//             <TopBar />
//             <Container fluid style={{ marginTop: "700px" }}>
//                 <div className="review-answers-container">
//                     <br />
//                     <div className="question-navigation-bar">
//                         <QuestionNavigationBar
//                             questions={localQuestions}
//                             selectedOptions={data.questionResponses.reduce((acc, response) => {
//                                 acc[response.quizQuestionId] = response.selectedOptions || [];
//                                 return acc;
//                             }, {})}
//                             currentQuestionIndex={selectedQuestion}
//                             onQuestionClick={handleSelectQuestion}
//                         />
//                     </div>

//                     <div className="review-answers-content">
//                         {localQuestions.map((question, index) => {
//                             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                             return (
//                                 <div
//                                     key={question.quizQuestionId}
//                                     id={`question-${index}`}
//                                     className="review-question-container"
//                                 >
//                                     <h5>{index + 1}: {question.question}</h5>
//                                     <ul className="question-options">
//                                         {question.options.map((option, optionIndex) => (
//                                             <li key={optionIndex}>
//                                                 <input
//                                                     type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                     name={question.quizQuestionId}
//                                                     value={option.option}
//                                                     checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                     readOnly
//                                                     style={{ cursor: "pointer" }} className="option-type"
//                                                 />
//                                                   &nbsp; &nbsp;
//                                                 {option.option}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             );
//                         })}

//                         <div className="button-container">
//                             <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                             <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                         </div>

//                         {showPopup && (
//                             <div className="reviewanswers-popup">
//                                 <div className="popup-content">
//                                     <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//                                     <br />
//                                     {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                     <p className='submit-quiz'>Are you sure you want to submit?</p>
//                                     <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                     <button onClick={() => setShowPopup(false)}>Cancel</button>
//                                 </div>
//                             </div>
//                         )}

//                         {submitLoading && <p>Submitting...</p>}
//                         {submitSuccess && <p>Submitted successfully!</p>}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default ReviewAnswers;




















// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewData = useSelector((state) => state.Review.reviewData);
//     const questions = useSelector((state) => state.AttemptQuiz.questions);
//     const loading = useSelector((state) => state.Review.loading);
//     const error = useSelector((state) => state.Review.error);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitError = useSelector((state) => state.SubmitAttempt.error);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewData?.learnerAttemptId;
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [localQuestions, setLocalQuestions] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);

//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         const storedQuestions = sessionStorage.getItem('questions');
//         const quizId = sessionStorage.getItem('quizId');

//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         }

//         if (storedQuestions) {
//             setLocalQuestions(JSON.parse(storedQuestions));
//         } else if (quizId) {
//             dispatch(fetchQuestionsRequest(quizId));
//         }
//     }, [dispatch, attemptId]);

//     useEffect(() => {
//         if (reviewData) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
//             setLocalReviewData(reviewData);
//         }
//     }, [reviewData]);

//     useEffect(() => {
//         if (questions.length > 0) {
//             sessionStorage.setItem('questions', JSON.stringify(questions));
//             setLocalQuestions(questions);
//         }
//     }, [questions]);

//     useEffect(() => {
//         const handleBeforeUnload = (event) => {
//             event.preventDefault();
//             event.returnValue = ''; // For most browsers
//         };

//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//             window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//     }, []);

//     const handleSubmit = () => {
//         const allAnswered = localQuestions.every(question => {
//             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });

//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }

//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };

//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };

//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//     };

//     const data = localReviewData || reviewData;

//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }

//     return (
//         <div>
//             <TopBar />
//             <Container fluid style={{ marginTop: "700px" }}>
//                 <div className="review-answers-container">
//                     <br />
//                     <div className="question-navigation-bar">
//                         <QuestionNavigationBar
//                             questions={localQuestions}
//                             selectedOptions={data.questionResponses.reduce((acc, response) => {
//                                 acc[response.quizQuestionId] = response.selectedOptions || [];
//                                 return acc;
//                             }, {})}
//                             currentQuestionIndex={selectedQuestion}
//                             onQuestionClick={handleSelectQuestion}
//                         />
//                     </div>

//                     <div className="review-answers-content">
//                         {localQuestions.map((question, index) => {
//                             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                             return (
//                                 <div
//                                     key={question.quizQuestionId}
//                                     id={`question-${index}`}
//                                     className="review-question-container"
//                                 >
//                                     <h5>{index + 1}: {question.question}</h5>
//                                     <ul className="question-options">
//                                         {question.options.map((option, optionIndex) => (
//                                             <li key={optionIndex}>
//                                                 <input
//                                                     type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                     name={question.quizQuestionId}
//                                                     value={option.option}
//                                                     checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                     readOnly
//                                                     style={{ cursor: "pointer" }} className="option-type"
//                                                 />
//                                                   &nbsp; &nbsp;
//                                                 {option.option}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             );
//                         })}

//                         <div className="button-container">
//                             <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                             <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                         </div>

//                         {showPopup && (
//                             <div className="reviewanswers-popup">
//                                 <div className="popup-content">
//                                     <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//                                     <br />
//                                     {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                     <p className='submit-quiz'>Are you sure you want to submit?</p>
//                                     <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                     <button onClick={() => setShowPopup(false)}>Cancel</button>
//                                 </div>
//                             </div>
//                         )}

//                         {submitLoading && <p>Submitting...</p>}
//                         {submitSuccess && <p>Submitted successfully!</p>}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default ReviewAnswers;




















// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewData = useSelector((state) => state.Review.reviewData);
//     const questions = useSelector((state) => state.AttemptQuiz.questions);
//     const loading = useSelector((state) => state.Review.loading);
//     const error = useSelector((state) => state.Review.error);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitError = useSelector((state) => state.SubmitAttempt.error);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewData?.learnerAttemptId;
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);

//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         const storedQuizId = sessionStorage.getItem("quizId");

//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         }

//         if (storedQuizId) {
//             dispatch(fetchQuestionsRequest(storedQuizId));
//         }
//     }, [dispatch, attemptId]);

//     useEffect(() => {
//         if (reviewData) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
//             setLocalReviewData(reviewData);
//         }
//     }, [reviewData]);

//     useEffect(() => {
//         const handleBeforeUnload = (event) => {
//             event.preventDefault();
//             event.returnValue = ''; // For most browsers
//         };

//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//             window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//     }, []);

//     const handleSubmit = () => {
//         const allAnswered = questions.every(question => {
//             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });

//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }

//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };

//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };

//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//     };

//     const data = localReviewData || reviewData;

//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }

//     return (
//         <div>
//             <TopBar />
//             <Container fluid style={{ marginTop: "700px" }}>
//                 <div className="review-answers-container">
//                     <br />
//                     <div className="question-navigation-bar">
//                         <QuestionNavigationBar
//                             questions={questions}
//                             selectedOptions={data.questionResponses.reduce((acc, response) => {
//                                 acc[response.quizQuestionId] = response.selectedOptions || [];
//                                 return acc;
//                             }, {})}
//                             currentQuestionIndex={selectedQuestion}
//                             onQuestionClick={handleSelectQuestion}
//                         />
//                     </div>

//                     <div className="review-answers-content">
//                         {questions.map((question, index) => {
//                             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                             return (
//                                 <div
//                                     key={question.quizQuestionId}
//                                     id={`question-${index}`}
//                                     className="review-question-container"
//                                 >
//                                     <h5>{index + 1}: {question.question}</h5>
//                                     <ul className="question-options">
//                                         {question.options.map((option, optionIndex) => (
//                                             <li key={optionIndex}>
//                                                 <input
//                                                     type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                     name={question.quizQuestionId}
//                                                     value={option.option}
//                                                     checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                     readOnly
//                                                     style={{ cursor: "pointer" }} className="option-type"
//                                                 />
//                                                   &nbsp; &nbsp;
//                                                 {option.option}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             );
//                         })}

//                         <div className="button-container">
//                             <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                             <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                         </div>

//                         {showPopup && (
//                             <div className="reviewanswers-popup">
//                                 <div className="popup-content">
//                                     <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//                                     <br />
//                                     {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                     <p className='submit-quiz'>Are you sure you want to submit?</p>
//                                     <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                     <button onClick={() => setShowPopup(false)}>Cancel</button>
//                                 </div>
//                             </div>
//                         )}

//                         {submitLoading && <p>Submitting...</p>}
//                         {submitSuccess && <p>Submitted successfully!</p>}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default ReviewAnswers;

















// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewData = useSelector((state) => state.Review.reviewData);
//     const questions = useSelector((state) => state.AttemptQuiz.questions);
//     const loading = useSelector((state) => state.Review.loading);
//     const error = useSelector((state) => state.Review.error);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitError = useSelector((state) => state.SubmitAttempt.error);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewData?.learnerAttemptId;
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);

//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         }
//         dispatch(fetchQuestionsRequest(sessionStorage.getItem("quizId")));
//     }, [dispatch, attemptId]);

//     useEffect(() => {
//         if (reviewData) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
//             setLocalReviewData(reviewData);
//         }
//     }, [reviewData]);

//     useEffect(() => {
//         const handleBeforeUnload = (event) => {
//           event.preventDefault();
//           // setShowModal(true);
//         };
    
//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//           window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//       }, []);

//     const handleSubmit = () => {
//         const allAnswered = questions.every(question => {
//             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });

//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }

//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };

//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };

//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//     };

//     const data = localReviewData || reviewData;

//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }

//     return (
//         <div>
//             <TopBar />
//             <Container fluid style={{ marginTop: "700px" }}>
//                 <div className="review-answers-container">
//                     <br />
//                     <div className="question-navigation-bar">
//                         <QuestionNavigationBar
//                             questions={questions}
//                             selectedOptions={data.questionResponses.reduce((acc, response) => {
//                                 acc[response.quizQuestionId] = response.selectedOptions || [];
//                                 return acc;
//                             }, {})}
//                             currentQuestionIndex={selectedQuestion}
//                             onQuestionClick={handleSelectQuestion}
//                         />
//                     </div>

//                     <div className="review-answers-content">
//                         {questions.map((question, index) => {
//                             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                             return (
//                                 <div
//                                     key={question.quizQuestionId}
//                                     id={`question-${index}`}
//                                     className="review-question-container"
//                                 >
//                                     <h5>{index + 1}: {question.question}</h5>
//                                     <ul className="question-options">
//                                         {question.options.map((option, optionIndex) => (
//                                             <li key={optionIndex}>
//                                                 <input
//                                                     type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                     name={question.quizQuestionId}
//                                                     value={option.option}
//                                                     checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                     readOnly
//                                                     style={{ cursor: "pointer" }} className="option-type"
//                                                 />
//                                                   &nbsp; &nbsp;
//                                                 {option.option}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             );
//                         })}

//                         <div className="button-container">
//                             <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                             <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                         </div>

//                         {showPopup && (
//                             <div className="reviewanswers-popup">
//                                 <div className="popup-content">
//                                     <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//                                     <br />
//                                     {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                     <p className='submit-quiz'>Are you sure you want to submit?</p>
//                                     <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                     <button onClick={() => setShowPopup(false)}>Cancel</button>
//                                 </div>
//                             </div>
//                         )}

//                         {submitLoading && <p>Submitting...</p>}
//                         {submitSuccess && <p>Submitted successfully!</p>}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default ReviewAnswers;












// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewData = useSelector((state) => state.Review.reviewData);
//     const questions = useSelector((state) => state.AttemptQuiz.questions);
//     const loading = useSelector((state) => state.Review.loading);
//     const error = useSelector((state) => state.Review.error);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitError = useSelector((state) => state.SubmitAttempt.error);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewData?.learnerAttemptId;
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);

//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         }
//         dispatch(fetchQuestionsRequest(sessionStorage.getItem("quizId")));
//     }, [dispatch, attemptId]);

//     useEffect(() => {
//         if (reviewData) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
//             setLocalReviewData(reviewData);
//         }
//     }, [reviewData]);

//     const handleSubmit = () => {
//         const allAnswered = questions.every(question => {
//             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });

//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }

//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };

//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };

//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     };

//     const data = localReviewData || reviewData;

//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }

//     return (
//         <div>
//             <TopBar />
//             <Container fluid style={{ marginTop: "700px" }}>
//                 <div className="review-answers-container">
//                     <br />
//                     <div className="question-navigation-bar">
//                         <QuestionNavigationBar
//                             questions={questions}
//                             selectedOptions={data.questionResponses.reduce((acc, response) => {
//                                 acc[response.quizQuestionId] = response.selectedOptions || [];
//                                 return acc;
//                             }, {})}
//                             currentQuestionIndex={selectedQuestion}
//                             onQuestionClick={handleSelectQuestion}
//                         />
//                     </div>

//                     <div className="review-answers-content">
//                         {questions.map((question, index) => {
//                             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                             return (
//                                 <div
//                                     key={question.quizQuestionId}
//                                     id={`question-${index}`}
//                                     className="review-question-container"
//                                 >
//                                     <h5>{index + 1}: {question.question}</h5>
//                                     <ul className="question-options">
//                                         {question.options.map((option, optionIndex) => (
//                                             <li key={optionIndex}>
//                                                 <input
//                                                     type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                     name={question.quizQuestionId}
//                                                     value={option.option}
//                                                     checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                     readOnly
//                                                     style={{ cursor: "pointer" }} className="option-type"
//                                                 />
//                                                   &nbsp; &nbsp;
//                                                 {option.option}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             );
//                         })}

//                         <div className="button-container">
//                             <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                             <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                         </div>

//                         {showPopup && (
//                             <div className="popup">
//                                 <div className="popup-content">
//                                     <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//                                     <br />
//                                     {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                     <p className='submit-quiz'>Are you sure you want to submit?</p>
//                                     <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                     <button onClick={() => setShowPopup(false)}>Cancel</button>
//                                 </div>
//                             </div>
//                         )}

//                         {submitLoading && <p>Submitting...</p>}
//                         {submitSuccess && <p>Submitted successfully!</p>}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default ReviewAnswers;





















// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReviewRequest } from '../../../../actions/Quiz And Feedback Module/Learner/ReviewAction';
// import { fetchQuestionsRequest } from '../../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
// import { submitAttemptRequest } from '../../../../actions/Quiz And Feedback Module/Learner/SubmitAttemptAction';
// import '../../../../Styles/Quiz And Feedback Module/Learner/ReviewAnswers.css';
// import { useNavigate } from 'react-router-dom';
// import QuestionNavigationBar from './QuestionNavigationBar';
// import { Container } from 'react-bootstrap';
// import TopBar from "../../../Quiz And Feedback Module/QuizComponents/Learner/TopBar";

 
// const ReviewAnswers = ({ attemptId }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const reviewData = useSelector((state) => state.Review.reviewData);
//     const questions = useSelector((state) => state.AttemptQuiz.questions);
//     const loading = useSelector((state) => state.Review.loading);
//     const error = useSelector((state) => state.Review.error);
//     const submitLoading = useSelector((state) => state.SubmitAttempt.loading);
//     const submitError = useSelector((state) => state.SubmitAttempt.error);
//     const submitSuccess = useSelector((state) => state.SubmitAttempt.success);
//     const AttemptId = reviewData?.learnerAttemptId;
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);
//     const [localReviewData, setLocalReviewData] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [unansweredError, setUnansweredError] = useState(false);
 
//     useEffect(() => {
//         const storedReviewData = sessionStorage.getItem('reviewData');
//         if (storedReviewData) {
//             setLocalReviewData(JSON.parse(storedReviewData));
//         } else if (attemptId) {
//             dispatch(fetchReviewRequest(attemptId));
//         }
//         dispatch(fetchQuestionsRequest(sessionStorage.getItem("quizId")));
//     }, [dispatch, attemptId]);
 
//     useEffect(() => {
//         if (reviewData) {
//             sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
//             setLocalReviewData(reviewData);
//         }
//     }, [reviewData]);
 
//     const handleSubmit = () => {
//         const allAnswered = questions.every(question => {
//             const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId);
//             return response && response.selectedOptions && response.selectedOptions.length > 0;
//         });
 
//         if (!allAnswered) {
//             setUnansweredError(true);
//             return;
//         }
 
//         if (AttemptId && !isSubmitting) {
//             setIsSubmitting(true);
//             dispatch(submitAttemptRequest(AttemptId)).then(() => {
//                 setIsSubmitting(false);
//                 navigate('/learnerscorepage');
//             }).catch(() => {
//                 setIsSubmitting(false);
//             });
//             setShowPopup(false);
//         } else {
//             console.error("Attempt ID is missing or submission is already in progress");
//         }
//     };
 
//     const handleNavigate = () => {
//         navigate('/attemptquiz');
//     };
 
//     const handleSelectQuestion = (index) => {
//         setSelectedQuestion(index);
//         const questionElement = document.getElementById(`question-${index}`);
//         if (questionElement) {
//             questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     };
 
//     const data = localReviewData || reviewData;
 
//     if (!data || !Array.isArray(data.questionResponses) || data.questionResponses.length === 0) {
//         return <p>No data available.</p>;
//     }
 
//     return (
//         <div>
//             <TopBar/>
//         <Container fluid style={{marginTop:"700px"}}>
//         <div>
//             {/* <AdminNavbar /> */}
//             <div className="review-answers-container">
//                 <br />
//                 <div className="question-navigation-bar">
//                     <QuestionNavigationBar
//                         questions={questions}
//                         selectedOptions={data.questionResponses.reduce((acc, response) => {
//                             acc[response.quizQuestionId] = response.selectedOptions || [];
//                             return acc;
//                         }, {})}
//                         currentQuestionIndex={selectedQuestion}
//                         onQuestionClick={handleSelectQuestion}
//                     />
//                 </div>
 
//                 <div className="review-answers-content">
//                     {questions.map((question, index) => {
//                         const response = data.questionResponses.find(q => q.quizQuestionId === question.quizQuestionId) || {};
//                         return (
//                             <div
//                                 key={question.quizQuestionId}
//                                 id={`question-${index}`}
//                                 className="review-question-container"
//                             >
//                                 <h5>{index + 1}: {question.question}</h5>
//                                 <ul className="question-options">
//                                     {question.options.map((option, optionIndex) => (
//                                         <li key={optionIndex}>
//                                             <input
//                                                 type={question.questionType === 'MSQ' ? 'checkbox' : 'radio'}
//                                                 name={question.quizQuestionId}
//                                                 value={option.option}
//                                                 checked={Array.isArray(response.selectedOptions) ? response.selectedOptions.includes(option.option) : response.selectedOptions === option.option}
//                                                 readOnly
//                                                 style={{ cursor: "pointer" }} className="option-type"
//                                             />
//                                               &nbsp; &nbsp;
//                                             {option.option}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         );
//                     })}
 
//                     <div className="button-container">
//                         <button className="review-previous-button" onClick={handleNavigate}>Previous Page</button>
//                         <button className="review-submit-button" onClick={() => setShowPopup(true)}>Submit</button>
//                     </div>
 
//                     {/* {showPopup && (
//                         <div className="popup">
//                             <div className="popup-content">
//                                 {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//                                 <p>Are you sure you want to submit?</p>
//                                 <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//                                 <button onClick={() => setShowPopup(false)}>Cancel</button>
//                             </div>
//                         </div>
//                     )} */}
                   
//                     {showPopup && (
//     <div className="popup">
//         <div className="popup-content">
//             <button className="popup-close-button" onClick={() => setShowPopup(false)}>×</button>
//             <br/>
//             {unansweredError && <p className="error-message">Please answer all questions before submitting.</p>}
//             <p className='submit-quiz'>Are you sure you want to submit?</p>
//             <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
//             <button onClick={() => setShowPopup(false)}>Cancel</button>
//         </div>
//     </div>
// )}
 
//                     {submitLoading && <p>Submitting...</p>}
//                     {submitSuccess && <p>Submitted successfully!</p>}
//                 </div>
//             </div>
//         </div>
//         </Container>
//         </div>
//     );
// };
 
// export default ReviewAnswers;