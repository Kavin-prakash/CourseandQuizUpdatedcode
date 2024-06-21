import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import '../../../Styles/Admin/Loginpage.css';
import Relevantz from '../../../assets/Admin/Images/Relevantz.png'
import loginUser from '../../../middleware/Admin/apiLogin'
import { Link } from 'react-router-dom';
import { emailRegex, passwordRegex, validationMessages } from '../../../utils/Admin/Validation';
import { loginRequest, loginPasswordMessage, loginEmaildMessage, successdata } from '../../../actions/Admin/loginAction';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoginUser from '../../../middleware/Admin/apiLogin';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
const Loginpage = () => {


  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const navigates = useNavigate();

  const isSuccessadmin = useSelector((state) => state.user.isSuccessadmin);

  const isSuccessuser = useSelector((state) => state.user.isSuccessuser)

  const [altermessage, setAlertmessage] = useState(false);


  // Handle the function for the navigation

  const handlnavigation = (path) => {
    setAlertmessage(true);

    const timer = setTimeout(() => {
      setAlertmessage(false)
      navigate(path);
    }, 1000);

    return () => clearTimeout(timer);
  }

  // useEffect(() => {
  //   if (isSuccessadmin) {
  //     handlnavigation('/admindashboard'); // Navigate to the next page on success
  //   }
  // }, [isSuccessadmin]);


  useEffect(() => {
    if (isSuccessuser) {
      handlnavigation('/LearnerDashboard'); // Navigate to the next page on success
    }
  }, [isSuccessuser]);



  const [passwordfailuremessage, setpasswordfailureAlertmessage] = useState(false)

  const isPasswordMessage = useSelector((state) => state.user.failuremessage);

  console.log("passwordmessage", isPasswordMessage);

  useEffect(() => {
    let timer;
    if (isSuccessadmin) {
      setAlertmessage(true);
      timer = setTimeout(() => {
        setAlertmessage(false);
        navigate('/admindashboard');
      }, 2000);


    }
    return () => clearTimeout(timer);

  }, [isSuccessadmin, navigate]);



  useEffect(() => {
    let times;
    if (isPasswordMessage) {
      setpasswordfailureAlertmessage(true);
      times = setTimeout(() => {
        setpasswordfailureAlertmessage(false);
        const data = "invalid password";
        dispatch(loginPasswordMessage(data));
      }, 2000);
    }
    return () => clearTimeout(times);
  }, [isPasswordMessage]);


  // Email Faliliure Messare

  const isEmailfailuremessage = useSelector((state) => state.user.emailfailuremessage)

  console.log("emailmessage", isEmailfailuremessage);


  const [emailfailurealertmessage, setEmailfailurealertmessage] = useState(false);


  useEffect(() => {
    let emailmessgeclosingtime;

    if (isEmailfailuremessage) {
      setEmailfailurealertmessage(true);

      emailmessgeclosingtime = setTimeout(() => {
        setEmailfailurealertmessage(false);
      }, 2000);



    }
    return () => clearTimeout(emailmessgeclosingtime)
  }, [isEmailfailuremessage]);




  // debugger 

  const StoreLoginResposeData = useSelector((state) => state.user.user)

  console.log("StoreLoginResposeData", StoreLoginResposeData);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  // Check if StoreLoginResposeData is not null before destructuring
  if (StoreLoginResposeData != null) {
    const { email, password, role, getLearnerId } = StoreLoginResposeData;

    // Proceed with the navigation if both email and password are true
    if (email === true && password === true && role === "Admin") {
      const adminId = getLearnerId;
      //   // Store user ID in session
      sessionStorage.setItem('AdmminSessionId', adminId);
      sessionStorage.setItem('Role', role);
      // window.alert("successfully Loged Message")
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title:"Welcome!! Back Admin , Successfully Logged In"
      });


      dispatch(successdata(false));

      setTimeout(() => {
        navigate('/home');

      }, 2000);
    }
    else if (email === true && password === true && role === "Learner") {

      const learnerId = getLearnerId;
      sessionStorage.setItem('UserSessionID', learnerId);
      // window.alert("successfully Loged Message")

      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Welcome Back !!! Futures of Earth,Continue Your Learning."
      });



      dispatch(successdata(false));

      setTimeout(() => {
        navigate('/LearnerDashboard');

      }, 2000);
    }

    else if (email === false && password === false) {
      // window.alert("Please Enter the valid Email Id")
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Please Enter Valid Email"
      });

      dispatch(successdata(false));
      console.log("Please Enter the valid Email Id");
    }

    else if (email === true && password === false) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Please Enter correct Password"
      });

      // setAlertMessage("Please Enter the correct Password")
      // setShowAlert(true);
      dispatch(successdata(false));
      console.log("Please Enter the correct Password");
    }
  }






  const onSubmit = (data) => {
    dispatch(loginRequest(data));
    console.log("onsubmit", data);

    // <loginUser data={data}/>

    // <LoginUser data={data}/>
    // LoginUser(data);

    // try {
    //   const response = await axios.post("http://localhost:5199/api/Login/LoginLearner", data)

    //   console.table("consolerespone", response.data)
    // }
    // catch (error) {
    //   console.error("Error:", error);
    // }



    // <loginUser data={data}/>
  };


  return (
    <>
      <div className='login-app'>
        <div className='login-container'>
          <div className="loginform-container">
            <div className="login-header">
              <img src={Relevantz} alt="Logo" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                {showAlert && <Alert severity="error">{alertMessage}</Alert>}
              </div>
              <div style={{ marginTop: '5px' }}>

                <input
                  {...register('email', {
                    required: validationMessages.email.required,
                    pattern: {
                      value: emailRegex,
                      message: validationMessages.email.pattern
                    }
                  })}
                  type='text'
                  placeholder='Email'
                />
              </div>
              <p>{errors.email?.message}</p>
              <div>
                <input
                  {...register('password', {
                    required: validationMessages.password.required,
                    minLength: {
                      value: passwordRegex  ,
                      message: validationMessages.password.minLength
                    },
                    pattern: {
                      value: passwordRegex,
                      message: validationMessages.password.pattern
                    }
                  })}
                  type='password'
                  placeholder='Password'
                />
                <p>{errors.password?.message}</p>
              </div>
              <Link to={'/email'} >Forgot password?</Link>
              <div className='button-login'>
                <button className='btn' >Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginpage;