import {
    CREATE_ATTEMPT_REQUEST,
    CREATE_ATTEMPT_SUCCESS,
    CREATE_ATTEMPT_FAILURE,
    CREATE_ATTEMPT_STATUS
  } from '../../../actions/Quiz And Feedback Module/Learner/AttemptQuizAction';
 
const initialState = {
  attemptId:null,
  loading: false,
  error: null,
  isRequesting:false,
};
 
const LearnerAttemptQuizIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ATTEMPT_REQUEST:
      return { ...state, loading: true };
    case CREATE_ATTEMPT_SUCCESS:
      console.log("LearnerAttemptQuizId Reducer", action.payload);
      return { ...state, loading: false, attemptId: action.payload };
    case CREATE_ATTEMPT_FAILURE:
      return { ...state, loading: false, error: action.payload };
      case CREATE_ATTEMPT_STATUS:
        return{
          ...state,
          isRequesting:action.payload,
        }
    default:
      return state;
  }
};
 

export default LearnerAttemptQuizIdReducer

