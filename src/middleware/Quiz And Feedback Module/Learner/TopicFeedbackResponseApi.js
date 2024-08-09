import axios from "axios";
import {
    topicfeedbackresponseSuccess,
    topicfeedbackresponseFailure,
    topicfeedbackresponserequest,
    TOPICFEEDBACKRESPONSE_SUCCESS,
    TOPICFEEDBACKRESPONSE_REQUEST,
  } from "../../../actions/Quiz And Feedback Module/Learner/TopicFeedbackResponseAction.js";
 
const API_URL = "http://localhost:5199/api/FeedbackResponse/AddTopicFeedbackResponses";
export const TopicFeedbackResponseApi =async (action) => {
      try {
        console.log("post", action);
        // Assuming 'action.payload' contains the data you want to senda
        const response = await axios.post(API_URL, action);
        console.log("API Response:", response.data); // Log the response data
      } catch (error) {
        console.error("API Error:", error.message);
      }

  };