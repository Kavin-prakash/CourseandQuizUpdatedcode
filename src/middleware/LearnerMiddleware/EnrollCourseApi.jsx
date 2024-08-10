import { FETCH_LEARNER_COURSE, fetchenrollsuccess } from "../../actions/LearnerAction/EnrolledCourseAction";
import axios from "axios";
 
const enrollCourseApi=({dispatch})=>(next)=>async(action)=>{
    if(action.type===FETCH_LEARNER_COURSE){
        try{
            console.log("Enrolll course",action.payload);
            const response= await axios.get(`http://localhost:5199/lxp/enroll/${action.payload}/course/topic`);
            console.log('Enroll CourseList',response.data);
            console.log('courselist',response.data.data[0].enrollmentId);
            const enrollmentIds = response.data.data.map(item => item.enrollmentid);
 
            // Convert to JSON string
             const enrollmentIdsJson = JSON.stringify(enrollmentIds);
 
             // Set session storage
            sessionStorage.setItem('enrolled', enrollmentIdsJson);
            //sessionStorage.setItem('enrolled',EnrollmentId);
 
            dispatch(fetchenrollsuccess(response.data.data));
           
        }
        catch(error){
            console.log(error);
        }
    }
    return next(action)
}
 
export default enrollCourseApi;