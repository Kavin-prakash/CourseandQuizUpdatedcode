import axios from "axios";
const API_URL = "http://localhost:5199/api/CourseFeedback/question";

export const CourseFeedbackApi = async (action) => {
   
  try {
    console.log("post", action);
    const response = await axios.post(API_URL, action);
    console.log("API Response:", response.data.data); 
  } catch (error) {
    console.error("API Error:", error.message);
  }

};