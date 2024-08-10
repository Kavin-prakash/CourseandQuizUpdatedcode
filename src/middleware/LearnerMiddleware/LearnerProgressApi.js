import axios from 'axios'; 
const LearnerProgressApi = async (learnerId, enrollmentIds) => {
     try {
       const completionPercentages = []; // Initialize an empty array to store percentages
   
       for (const enrollmentId of enrollmentIds) {
         const response = await axios.get(`http://localhost:5199/api/LearnerProgress/course-completion-percentage/${learnerId}/${enrollmentId}`);
         completionPercentages.push(response.data); // Store the percentage in the array
       }
   
       console.log("learnerprogress", completionPercentages);
       return completionPercentages;
     } catch (error) {
     }
   }
   export default  LearnerProgressApi;
 
