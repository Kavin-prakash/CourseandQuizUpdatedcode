import axios from "axios";
const API_URL = "http://localhost:5199/api/CourseFeedback";
export const GetByIDCourseFeedbackApi = async (action) => {
  try {
    console.log("fetch course feedback", action);
    const url = `${API_URL}/${action}`;
    const response = await axios.get(url);
    console.log("Get API Response:", response.data.data); // Log the response data
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.message);
  }

};

export default GetByIDCourseFeedbackApi
