import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import courseReducer from '../reducers/courseReducer';
import apiMiddleware from '../middleware/apiMiddleware';
import ForgotPasswordreducer from '../reducers/ForgotPasswordReducer';
import userReducer from '../reducers/loginReducer';
import AllcourseReducer from '../reducers/AllcourseReducer';
import apiviewallcourse from '../middleware/apiviewallcourse';
import loginUser from '../middleware/Admin/apiLogin';
import apiDeletecourse from '../middleware/Admin/apiDeletecourse';
import DeletecourseReducer from '../reducers/Admin/DeletecourseReducer';
import UpdateCourse from '../middleware/Admin/apiUpdatecourse';
import courseupdateReducer from '../reducers/Admin/Updatecourse';
import LearnerReducer from '../reducers/LearnerReducer/Registerreducer';
import {RegisterApi}   from '../middleware/LearnerMiddleware/RegisterApi';
import emailReducer from '../reducers/LearnerReducer/FetchEmailReducer';
import fetchEmailApi from '../middleware/LearnerMiddleware/FetchEmailApi';
import OTPReducer from '../reducers/LearnerReducer/OTPReducer';
import VerifyEmailApi from '../middleware/LearnerMiddleware/VerifyEmailApi';

import LearnerGetCourseReducer from '../reducers/LearnerReducer/LearnerGetCourseReducer';
import LearnerGetCourse from '../middleware/LearnerMiddleware/LearnerGetCourse';

import LearnerPostEnrollReducer from '../reducers/LearnerReducer/LearnerPostEnrollReducer';
import LearnerPostEnroll from '../middleware/LearnerMiddleware/LearnerPostEnroll';

 import enrollCourseApi from "../middleware/LearnerMiddleware/EnrollCourseApi";
 import enrollmentReducer from "../reducers/LearnerReducer/EnrollmentReducer";
import fetchPdfReducer from '../reducers/LearnerReducer/FetchPdfReducer';
import FetchRegisterReducer from '../reducers/LearnerReducer/FetchRegisterReducer';
import { FetchRegisterApi } from '../middleware/LearnerMiddleware/FetchRegisterApi';
import GetUserProfileReducer from '../reducers/LearnerReducer/GetUserProfileReducer';
import UpdateUserProfileReducer from '../reducers/LearnerReducer/UpdateUserProfileReducer';
import fetchProfileData from '../middleware/LearnerMiddleware/GetUserProfileMiddleware';
import { updateUserData } from '../middleware/LearnerMiddleware/UpdateUserProfileMiddleware';
import PasswordChangeReducer from '../reducers/LearnerReducer/PasswordChangeReducer';
import updatePasswordApi from '../middleware/LearnerMiddleware/PasswordChangeApi';
import UnEnrollReducer from '../reducers/LearnerReducer/UnEnrollReducer';
import UnenrollCourseApi from '../middleware/LearnerMiddleware/UnenrollApi';
import LearnerdashboardReducer from '../reducers/LearnerReducer/LearnerdashboardReducer';
import LearnerdashboardApi from '../middleware/LearnerMiddleware/LearnerdashboardApi';
import { CoursebyScoreApi } from '../middleware/LearnerMiddleware/CoursebyScoreApi';
import CoursebyScoreReducer from '../reducers/LearnerReducer/CoursebyScoreReducer';
import {fetchUserData} from '../middleware/LearnerMiddleware/GetUserProfileMiddleware';
import LearnerProgressApi from '../middleware/LearnerMiddleware/LearnerProgressApi';
import LearnerProgressReducer from '../reducers/LearnerReducer/LearnerProgressReducer';
import LearnerScoreProgressBarGraphReducer from '../reducers/LearnerReducer/LearnerScoreProgressBarGraphReducer';
import LearnerScoreProgressBarGraphApi from '../middleware/LearnerMiddleware/LearnerScoreProgressBarGraphApi';
import addWatchTimeReducer from '../reducers/LearnerReducer/WatchTimeReducer';
import watchTimeApi from '../middleware/LearnerMiddleware/WatchTimeMiddleware';




// quiz-learnerflow
import AttemptQuizReducer from "../reducers/Quiz And Feedback Module/Learner/AttemptQuizReducer";
import QuizInstructionReducer from "../reducers/Quiz And Feedback Module/Learner/QuizInstructionReducer";
import { QuizInstructionApi } from "../middleware/Quiz And Feedback Module/Learner/QuizInstructionApi";
import LearnerAttemptQuizIdReducer from "../reducers/Quiz And Feedback Module/Learner/LearnerAttemptQuizIdReducer.js";
import LearnerAttemptQuizIdApi from "../middleware/Quiz And Feedback Module/Learner/LearnerAttemptQuizIdApi.js";
import GetLearnerIDReducer from "../reducers/Quiz And Feedback Module/Learner/GetLearnerIDReducer.js";
import GetLearnerIDApi from "../middleware/Quiz And Feedback Module/Learner/GetLearnerIDApi.js";
import reviewReducer from "../reducers/Quiz And Feedback Module/Learner/ReviewReducer";
import reviewApi from "../middleware/Quiz And Feedback Module/Learner/ReviewApi";
import { fetchQuestionsMiddleware } from "../middleware/Quiz And Feedback Module/Learner/AttemptQuizApi";
import SelectAnswerReducer from "../reducers/Quiz And Feedback Module/Learner/SelectAnswerReducer";
import submitAttemptReducer from "../reducers/Quiz And Feedback Module/Learner/SubmitAttemptReducer";
import { selectAnswerMiddleware } from "../middleware/Quiz And Feedback Module/Learner/SelectAnswerApi";
import submitAttemptMiddleware from "../middleware/Quiz And Feedback Module/Learner/SubmitAttemptMiddleware";
import LearnerScorePageReducer from "../reducers/Quiz And Feedback Module/Learner/LearnerScorePageReducer";
import LearnerScorePageApi from "../middleware/Quiz And Feedback Module/Learner/LearnerScorePageApi";
import FetchTopicFeedbackQuestionReducer from "../reducers/Quiz And Feedback Module/Learner/FetchTopicFeedbackQuestionReducer";
import { FetchTopicFeedbackQuestionApi } from "../middleware/Quiz And Feedback Module/Learner/FetchTopicFeedbackQuestionApi";
import TopicFeedbackResponseReducer from "../reducers/Quiz And Feedback Module/Learner/TopicFeedbackResponseReducer.js";
import { TopicFeedbackResponseApi } from "../middleware/Quiz And Feedback Module/Learner/TopicFeedbackResponseApi.js";
import FetchQuizFeedbackQuestionReducer from '../reducers/Quiz And Feedback Module/Learner/FetchQuizFeedbackQuestionReducer';
import { FetchQuizFeedbackQuestionApi } from '../middleware/Quiz And Feedback Module/Learner/FetchQuizFeedbackQuestionApi';
import QuizFeedbackResponseReducer from "../reducers/Quiz And Feedback Module/Learner/QuizFeedbackResponseReducer.js";
import { QuizFeedbackResponseApi } from "../middleware/Quiz And Feedback Module/Learner/QuizFeedbackResponseApi.js";












const rootReducer = combineReducers({
  passwordchangereducer : PasswordChangeReducer,
 
  updateuserprofile:UpdateUserProfileReducer,
  forgotPassword: ForgotPasswordreducer,
  user: userReducer,
  course: courseReducer,
  allcourse: AllcourseReducer,
  deletecourse: DeletecourseReducer,
  updatecourse:courseupdateReducer,
  learner:LearnerReducer,
  email:emailReducer,
  otp:OTPReducer,
  fetchcourse: LearnerGetCourseReducer,
  enrolledCourses:LearnerPostEnrollReducer,
  fetchPdf: fetchPdfReducer,
  enroll: enrollmentReducer,
  fetchlearner: FetchRegisterReducer,
  unenroll: UnEnrollReducer,
  learnerdashboard:LearnerdashboardReducer,
  coursebyscore : CoursebyScoreReducer,
  scoreProgressBarGraph:LearnerScoreProgressBarGraphReducer,
  watchTime:addWatchTimeReducer,
  // courseprogress: LearnerProgressReducer,
  // getUseProfile: GetUserProfileReducer,



  //quizmodule-learner
    //Learner side
    fetchlearnerid: GetLearnerIDReducer,
    AttemptQuiz: AttemptQuizReducer,
    Review: reviewReducer,
    SelectAnswer: SelectAnswerReducer,
    SubmitAttempt: submitAttemptReducer,
    learnerscore: LearnerScorePageReducer,
    fetchquizinstruction: QuizInstructionReducer,
    learnerattempt: LearnerAttemptQuizIdReducer,
    fetchtopicfeedbackquestion: FetchTopicFeedbackQuestionReducer,
    TopicFeedbackResponse: TopicFeedbackResponseReducer,
    fetchquizfeedbackquestion:FetchQuizFeedbackQuestionReducer,
    QuizFeedbackResponse: QuizFeedbackResponseReducer,
});


const store = createStore(

  rootReducer,
  applyMiddleware(thunk,   apiMiddleware,apiviewallcourse,loginUser,apiDeletecourse,UpdateCourse,RegisterApi,fetchEmailApi,VerifyEmailApi,LearnerGetCourse,LearnerPostEnroll,enrollCourseApi,FetchRegisterApi,updatePasswordApi,updateUserData, UnenrollCourseApi,LearnerdashboardApi,CoursebyScoreApi,LearnerScoreProgressBarGraphApi,
    watchTimeApi,
       //quiz-learner flow
       GetLearnerIDApi,
       fetchQuestionsMiddleware,
       reviewApi,
       selectAnswerMiddleware,
       submitAttemptMiddleware,
       LearnerScorePageApi,
       FetchTopicFeedbackQuestionApi,
       TopicFeedbackResponseApi,
       FetchQuizFeedbackQuestionApi,
       QuizFeedbackResponseApi,
       QuizInstructionApi,
       LearnerAttemptQuizIdApi, 
    
    
    
    
    )
);

export default store;

