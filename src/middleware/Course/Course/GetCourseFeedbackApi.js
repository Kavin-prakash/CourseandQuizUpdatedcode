
import axios from 'axios';
export const GetCourseFeedbackApi = async (action) => {
 
    try {
      const response = await axios.get(`http://localhost:5199/api/CourseFeedback/course/${action}`);
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error.message);
    }
};
 