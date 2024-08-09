import axios from "axios";
export const DeleteCourseFeedbackApi = async (action) => {
      try {
        const API_URL = `http://localhost:5199/api/CourseFeedback/${action}`;
        console.log("delete course feedback", action);
        const response = await axios.delete(API_URL);
        console.log("Delete course feedback API Response:", response.data); // Log the response data
      } catch (error) {
        console.error("API Error:", error.message);
      }

  };

export default DeleteCourseFeedbackApi;