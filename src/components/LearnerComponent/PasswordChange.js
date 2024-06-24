// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Card, Form, Button } from 'react-bootstrap';
// import { validatePassword } from '../../utils/LearnerValidations/ValidationforPasswordChange';
// import { useSelector, useDispatch } from 'react-redux';
// import { UpdatePasswordRequest } from '../../actions/LearnerAction/PasswordChangeAction';
// import LearnerDashboard from './LearnerDashboard';
// import LearnerNavbar from '../../components/LearnerComponent/LearnerNavbar';
// import '../../Styles/Learner/Password.css';

// const PasswordChange = () => {
//     const [learnerId] = useState(sessionStorage.getItem('UserSessionID'));
//     console.log("learnerid",learnerId );
//     const [oldPassword, setOldPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const dispatch = useDispatch();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const validationErrors = validatePassword(newPassword, oldPassword, confirmPassword);
//         if (validationErrors.length > 0) {
//             setError(validationErrors.join(' '));
//             return;
//         }

//         try {
//             dispatch(UpdatePasswordRequest(learnerId, oldPassword, newPassword));
//         } catch (error) {
//             console.error('Error updating password:', error);
//             setError('Old password is incorrect');
//         }
//     };

//     return (
//         <>
//             <LearnerNavbar />
//             <div className="d-flex justify-content-center align-items-center background_learner" style={{ height: '100vh' }}>
//                 <Card className="custom-card_learner">
//                     <Card.Body>
//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Old Password:</Form.Label>
//                                 <Form.Control
//                                     className="custom-form-control_learner"
//                                     type="password"
//                                     value={oldPassword}
//                                     onChange={(e) => setOldPassword(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>New Password:</Form.Label>
//                                 <Form.Control
//                                     className="custom-form-control_learner"
//                                     type="password"
//                                     value={newPassword}
//                                     onChange={(e) => setNewPassword(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Confirm New Password:</Form.Label>
//                                 <Form.Control
//                                     className="custom-form-control_learner"
//                                     type="password"
//                                     value={confirmPassword}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                 />
//                             </Form.Group>
//                             {error && <p style={{ color: 'red' }}>{error}</p>}
//                             <Button className="custom-button" type="submit">
//                                 Change Password
//                             </Button>
//                         </Form>
//                     </Card.Body>
//                 </Card>
//             </div>
//         </>
//     );
// };

// export default PasswordChange;


























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form, Button } from 'react-bootstrap';
import { validatePassword } from '../../utils/LearnerValidations/ValidationforPasswordChange';
import { useSelector, useDispatch } from 'react-redux';
import { UpdatePasswordRequest } from '../../actions/LearnerAction/PasswordChangeAction';
import LearnerDashboard from './LearnerDashboard';
import LearnerNavbar from '../../components/LearnerComponent/LearnerNavbar';
import '../../Styles/Learner/Password.css';
import { alpha, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import { Padding } from '@mui/icons-material';
import passwordimagegirl from '../../assets/Learner/Reset password-amico.png'
import updatePasswordApi from '../../middleware/LearnerMiddleware/PasswordChangeApi';
import Swal from 'sweetalert2';
 
 
 
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
}
 
 
//   setTimeout(() => {
//     window.location.reload();
//   }, 3000);
// }
 
const PasswordChange = () => {
    const [learnerId] = useState(sessionStorage.getItem('UserSessionID'));
    console.log("learnerid", learnerId);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [validationHidder, setValidationHider]= useState(false);
 
   
 
 
     const handleSubmit = async (e) => {
        e.preventDefault();
       
        const validationErrors = validatePassword(newPassword,oldPassword,confirmPassword);
        if (validationErrors.length > 0) {
          setError(validationErrors.join(' '));
          return;
        }
     
        try {
       
        const message = await updatePasswordApi(learnerId, oldPassword, newPassword);
          if (message === "Old password is incorrect") {
           
            // alertDisplayPasswordFailure();
           
          } else {
            // alert("Password has been updated");
             alertDisplayPasswordSuccess();
           
          }
        } catch (error) {
          console.error('Error updating password:', error);
          setError('Old password is incorrect');
          alertDisplayPasswordFailure();
        }
      };
 
    return (
       
        <>
           <LearnerNavbar />
            <div className='container-fluid' style={{ display: 'flex', height: '100vh', flexDirection: 'row' }}>
 
 
 
                <div className='image-container' style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={passwordimagegirl} alt="passwordimage" style={{ maxHeight: "100%", maxWidth: "90%" }} />
                </div>
 
 
 
                <div className='container-fluid' style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
 
 
                    <Form style={{ width: '100%', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)', padding: '40px' }} onSubmit={handleSubmit}>
 
 
                        <h3 className='d-flex justify-content-center' style={{ fontSize: "x-large" }}>Reset  Password</h3>
 
 
                        <h6 className='d-flex justify-content-center mt-4' style={{ fontFamily: "revert" }}>You can now reset your password</h6>
 
                        <div className='d-flex justify-content-center mt-5'>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', width: 500 }}>
                                <PasswordRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField fullWidth id="input-with-sx" label="Old password" variant="standard" type='password' style={{ color: "#2962ff'" }} value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)} />
                            </Box>
                        </div>
                        <div className='d-flex justify-content-center mt-5'>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', width: 500 }}>
                                <PasswordRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField fullWidth id="input-with-sx" label="New password" variant="standard" type='password' value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)} />
                            </Box>
                        </div>
                        <div className='d-flex justify-content-center mt-5'>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', width: 500 }}>
                                <PasswordRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField fullWidth id="input-with-sx" label="Confirm new password" variant="standard" type='password' value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Box>
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            <div className='container d-flex justify-content-center'>
                            <div className=' d-flex justify-content-center mt-3'>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </div>
                            </div>
                           
                           
 
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            <Button className="custom-button" type="submit" >
                                Change Password
                            </Button>
                            </div>
 
                    </Form>
                </div>
            </div>
 
        </>
    );
};
 
export default PasswordChange;
 