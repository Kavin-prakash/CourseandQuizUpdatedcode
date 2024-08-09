
import axios from 'axios';
export const GetTopicFeedbackApi = async (action) => {
 
    try {
      // console.log("gettopic",action);
      // Assuming 'action.payload' contains the data you want to senda
      const response = await axios.get(`http://localhost:5199/api/TopicFeedback/topic/${action}`);
      // console.log('API Response:', response.data.data); // Log the response data
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error.message);
    }

 
};
 