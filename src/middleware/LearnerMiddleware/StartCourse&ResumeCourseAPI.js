
import axios from "axios";

const StartCourseResumeCourseAPI =async (id)=>{
    
        try {
            const response = await axios.put(`http://localhost:5199/api/Enrollment/lxp/updateCourseStarted/${id}`);    
        }
        catch (error) {
            console.log(error);
        }
    }
   


export default StartCourseResumeCourseAPI;

