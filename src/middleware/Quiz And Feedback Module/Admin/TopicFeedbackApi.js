import axios from "axios";
const API_URL = "http://localhost:5199/api/TopicFeedback/question";



export const TopicFeedbackApi = async (action) => {
   
  try {
    console.log("post", action);
    // Assuming 'action.payload' contains the data you want to senda
    const response = await axios.post(API_URL, action);
    console.log("API Response:", response.data.data); // Log the response data
  } catch (error) {
    console.error("API Error:", error.message);
  }

};
