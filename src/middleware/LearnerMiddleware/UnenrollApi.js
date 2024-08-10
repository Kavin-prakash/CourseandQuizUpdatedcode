import axios from "axios";

const UnenrollCourseApi =async (id)=>{
    
        try {
            const response = await axios.delete(`http://localhost:5199/api/Enrollment/lxp/enroll/delete/${id}`);
                response.then(()=>{ 

                })
            console.log('deletelist', response.data);
            console.log('courselist', response.data);
        }
        catch (error) {
            console.log(error);
        }
    }
   


export default UnenrollCourseApi;


