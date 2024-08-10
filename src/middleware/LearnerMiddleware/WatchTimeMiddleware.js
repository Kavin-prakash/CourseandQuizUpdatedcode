import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {WATCH_TIME_STATUS,WATCH_TIME_REQUEST,watchTimeSuccess,watchTimeFailure, watchTimeExists} from '../../actions/LearnerAction/WatchTimeAction'
 
  
 
 
const watchTimeApi = ({ dispatch,getState}) => (next) =>async (action) => {


 
  if (action.type === WATCH_TIME_REQUEST ) {

  const ReducerData = getState().watchTime;

if (!ReducerData.isRequesting) {
    dispatch({ type: WATCH_TIME_STATUS, payload: true });
    try {
      console.log("check action",action.payload);
      const response = await axios.post(`http://localhost:5199/lxp/course/learner/learnerprogress`,action.payload);
      console.log('API Response data:', response.data); // Log the response data
      if(response.data.statusCode==412){
        dispatch( watchTimeExists());
      }
      else{
        dispatch(watchTimeSuccess(response.data.data)); // Dispatch success action with the response data
        console.log("successfullresponse",response.data.data)
      }
 
    }
    catch (error) {
      console.error('API Error:', error.message);
      dispatch(watchTimeFailure(error.message));
    } finally{
      dispatch({type:WATCH_TIME_STATUS,payload:false})
      }
    }
}
  return next(action);
};
 
export default watchTimeApi;