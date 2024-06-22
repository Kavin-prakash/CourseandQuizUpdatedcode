// import axios from 'axios';
// import { UPDATE_PASSWORD_REQUEST, UpdatePasswordFailure, UpdatePasswordSuccess } from '../../actions/LearnerAction/PasswordChangeAction';
 
 
 
// const updatePasswordApi = ({ dispatch }) => (next) => async (action) => {
 
//   if (action.type === UPDATE_PASSWORD_REQUEST) {
//     const learnerId = action.payload.learnerId;
//     const oldPassword = action.payload.oldPassword;
//     const newPassword = action.payload.newPassword;
 
//     if (!learnerId) {
//       console.error('API ERROR: learnerId is undefined');
//       dispatch(UpdatePasswordFailure("CourseId is undefined."));
//       return next(action);
 
//     }
//     try {
//       const response = await axios.put(`http://localhost:5199/lxp/learner/updatePassword?learnerId=${learnerId}&oldPassword=${oldPassword}&newPassword=${newPassword}`);
//       if (response.status == 200) {
 
//         dispatch(UpdatePasswordSuccess(response.data))
//         alert('Password has been successfully updated.');
//         window.location.reload();
//       }
//       else {
//         console.error("no data received");
//         alert("password updation fail");
//       }
//     }
//     catch (error) {
//       console.error("api error", error.responce ? error.responce.data.data : error.message);
//       dispatch(UpdatePasswordFailure(error.message))
//       alert("password update failed");
//     }
 
//     return next(action);
//   }
// };
// export default updatePasswordApi;









import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UPDATE_PASSWORD_REQUEST, UpdatePasswordFailure, UpdatePasswordSuccess } from '../../actions/LearnerAction/PasswordChangeAction';
 
 
let isAlertShown = false;
 
 
 
const alertDisplayPasswordSuccess = () => {
 
  const Toast = Swal.mixin({
    toast: true, background: '#11cb00', position: "top",
    showConfirmButton: false, timer: 3000, timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "success", iconColor: 'white', title: "Password Change Successfully", customClass: {
      popup: 'custom-toast'
    }
  });
 
 
 
  setTimeout(() => {
    // window.location.reload();
   
  }, 3000);
}
 
 
const alertDisplayPasswordFailure = () => {
 
 
  const Toast = Swal.mixin({
    toast: true, background: 'red', position: "top",
    showConfirmButton: false, timer: 3000, timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "error", iconColor: 'white', title: "Password update failed ", customClass: {
      popup: 'custom-toast'
    }
  });
 
 
 
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}
 
const updatePasswordApi = ({ dispatch }) => (next) => async (action) => {
 
 
 
  if (action.type === UPDATE_PASSWORD_REQUEST) {
    const learnerId = action.payload.learnerId;
    const oldPassword = action.payload.oldPassword;
    const newPassword = action.payload.newPassword;
 
    if (!learnerId) {
      console.error('API ERROR: learnerId is undefined');
      dispatch(UpdatePasswordFailure("CourseId is undefined."));
      return next(action);
 
    }
    // debugger
    try {
      // http://localhost:5199/lxp/learner/updatePassword?learnerId=6491b690-dd02-44b8-9653-7d440a900539&oldPassword=Sanjai%4012345&newPassword=Password%4012345

      const response = await axios.put(`http://localhost:5199/lxp/learner/updatePassword?learnerId=${learnerId}&oldPassword=${oldPassword}&newPassword=${newPassword}`);
    
      if (response.status == 200) {
 
        dispatch(UpdatePasswordSuccess(response.data))
        // alert('Password has been successfully updated.');
        // window.location.reload();
        alertDisplayPasswordSuccess();
 
      }
      else {
        // console.error("no data received");
        // alert("password updation fail");
        // alert("password update failed");
      }
    }
    catch (error) {
 
      console.error("api error", error.responce ? error.responce.data.data : error.message);
      dispatch(UpdatePasswordFailure(error.message))
 

 
      if (!isAlertShown) {
       
        // alertDisplayPasswordFailure();   
        // alert("failed to updare") 
        // alertDisplayPasswordFailure();  
        alertDisplayPasswordFailure();         
       
        isAlertShown = true; // Set the flag to true after showing the alert
        setTimeout(() => {
          // window.location.reload();
          // alertDisplayPasswordFailure();
          
        }, 3000);
      }
 
    }
 
  }
  return next(action);
};
export default updatePasswordApi;
 