

// // After clearing the reloading  error for unenroll



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import "../../Styles/Learner/GetEnrollment.css";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchenrollCourse, selectCourse, } from "../../actions/LearnerAction/EnrolledCourseAction";
// import { Link } from "react-router-dom";
// // import { Button, Navbar, Row } from "react-bootstrap";
// import logo from '../../../src/Images/logo.png'
// import LearnerNavbar from '..//../components/LearnerComponent/LearnerNavbar';
// // import { unenrollRequest } from "../../actions/LearnerAction/UnenrollAction";
// import LearnerProgressApi from "../../middleware/LearnerMiddleware/LearnerProgressApi";
// import LinearProgress from '@mui/material/LinearProgress';
// // import Dialog from '@material-ui/core/Dialog';
// // import DialogActions from '@material-ui/core/DialogActions';
// // import DialogContent from '@material-ui/core/DialogContent';
// // import DialogContentText from '@material-ui/core/DialogContentText';
// // import DialogTitle from '@material-ui/core/DialogTitle';
// // import Button from '@mui/material/Button'

// import { DialogActions } from '@mui/material';
// import { Button } from '@mui/material';
// import { DialogContent } from '@mui/material';
// import { DialogContentText } from '@mui/material';
// import { Dialog } from '@mui/material';
// import { DialogTitle } from '@mui/material';
// import UnenrollCourseApi from "../../middleware/LearnerMiddleware/UnenrollApi";
// import Swal from "sweetalert2";
// import { BeatLoader } from 'react-spinners';


// // import Navbar1 from "../LearnerComponent/Navbar1";

// const GetEnrollment = () => {



//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();
//   const id = sessionStorage.getItem('UserSessionID')
//   const [open, setOpen] = React.useState(false);
//   const [progress, setProgress] = useState(60);
//   const [courseCompletionPercentages, setCourseCompletionPercentages] = useState({});
//   //const id = "482a2888-c470-4f1e-b7c0-4bb725d8ff6a"; // The specific learnerId
//   const viewcourse = useSelector((state) => state.enroll.course[0]);
//   const [startedCourses, setStartedCourses] = useState(() => {
//     const savedCourses = localStorage.getItem('startedCourses');
//     return savedCourses ? JSON.parse(savedCourses) : {};
//   });


//   const [courses, setCourses] = useState([]);

//   const learnerId = sessionStorage.getItem('UserSessionID'); // Retrieve learner ID from session storage

//   const enrollmentId = JSON.parse(sessionStorage.getItem('enrolled'));
//   //const enrollmentId = sessionStorage.getItem("enrolled");
//   console.log("enrollement id dashbaord", enrollmentId);
//   const selectedprogress = useSelector((state) => state);
//   console.log("selectedprogress", selectedprogress);

//   useEffect(() => {
//     dispatch(fetchenrollCourse(id));
//   }, [dispatch]);

//   const [enrollmentcourseid, setenrollmentcourseid] = useState();

//   useEffect(() => {
//     fetchprogress(learnerId, enrollmentId);
//   }, [learnerId, enrollmentId]);


//   const handleClickOpen = () => {
//     setOpen(true);
//   };


//   const handleClose = () => {
//     setOpen(false);
//   };

//   const fetchprogress = async (learnerId, enrollmentId) => {
//     try {
//       console.log("enrole success", learnerId, enrollmentId);
//       const data = await LearnerProgressApi(learnerId, enrollmentId);
//       console.log("course percentage", data);

//       // Create an object to store the courseCompletionPercentage for each course
//       const progressData = data.reduce((acc, item) => {
//         acc[item.courseId] = item.courseCompletionPercentage;
//         return acc;
//       }, {});

//       setCourseCompletionPercentages(progressData);
//       setProgress(data);
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   console.log("sjfgjhg", courseCompletionPercentages);

//   const navigate = useNavigate();

//   const handleNavigation = (course) => (e) => {
//     e.preventDefault();
//     console.log(course.enrolledCourseId);
//     dispatch(selectCourse(course)); // Dispatch the selectCourse action with the selected course
//     setStartedCourses(prevState => {
//       const updatedCourses = { ...prevState, [course.enrolledCourseId]: true };
//       localStorage.setItem('startedCourses', JSON.stringify(updatedCourses));
//       return updatedCourses;
//     });

//     // navigate(`/ViewTopics`);
//     navigate(`/ViewTopics/${course.enrolledCourseId}`);
//   };


//   useEffect(() => {
//     // Update the local state when the Redux state changes
//     setCourses(viewcourse);
//   }, [viewcourse]);

//   // const handleUnenroll = (enrollid) => async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     await UnenrollCourseApi(enrollid);
//   //     // Dispatch an action to update the 'viewcourse' in your Redux state

//   //     handleClose();

//   //     const Toast = Swal.mixin({
//   //       toast: true, background: '#21903d', position: "top",
//   //       showConfirmButton: false, timer: 2000, timerProgressBar: true,
//   //       didOpen: (toast) => {
//   //         toast.onmouseenter = Swal.stopTimer;
//   //         toast.onmouseleave = Swal.resumeTimer;
//   //       }
//   //     });
//   //     Toast.fire({
//   //       icon: "success", iconColor: 'white', title: "Course UnEnrolled Successfully!!", customClass: {
//   //         popup: 'Unenrolled-Success-Message'
//   //       }
//   //     });


//   //     // Update the local state to remove the unenrolled course

//   //     // dispatch(fetchenrollCourse(id));
//   //   } catch (error) {
//   //     console.error(error);
//   //   } finally {
//   //     await setCourses(prevCourses => prevCourses.filter(course => course.enrollmentid !== enrollid));
//   //     dispatch(fetchenrollCourse(id));
//   //     // setCourses(viewcourse);

//   //     // window.location.reload();
//   //     setTimeout(()=>{
//   //       window.location.reload();
//   //     },2000)
           
//   //         }
    
//   //   }







  
//   const handleUnenroll = (enrollid) => async (e) => {
//     e.preventDefault();
//     try {
//       await UnenrollCourseApi(enrollid);
//       handleClose();
//       const Toast = Swal.mixin({
//         toast: true,
//         background: '#21903d',
//         position: "top",
//         showConfirmButton: false,
//         timer: 1500,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//           toast.onmouseenter = Swal.stopTimer;
//           toast.onmouseleave = Swal.resumeTimer;
//         }
//       });
//       Toast.fire({
//         icon: "success",
//         iconColor: 'white',
//         title: "Course UnEnrolled Successfully!!",
//         customClass: {
//           popup: 'Unenrolled-Success-Message'
//         }
//       });
//     } catch (error) {
//       console.error(error);
//     } finally {
//       await setCourses(prevCourses => prevCourses.filter(course => course.enrollmentid !== enrollid));
//       dispatch(fetchenrollCourse(id));
     
//       setTimeout(() => {
//         setIsLoading(true);
//         window.location.reload();
//       }, 2000)
//     }
//   };

//   // if (isLoading) {
//   //   return <BeatLoader style={{marginLeft:""}} color={"#123abc"} loading={isLoading} size={150} />;
//   // }

//   if (isLoading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <BeatLoader color={"#123abc"} loading={isLoading} size={50} />; 
//       </div>
//     );
//   }







//   return (
//     <div>



//       <LearnerNavbar />


     



//       <div className=" d-block" id='box_learner'>

    
      
    
//         {courses && courses.map((course, index) => (

//           <Link key={index} id="Card_learner">
//             <Card
//               style={{ height: '300px', backgroundColor: "#e6eefb" }}
//               id="Card_learner"

//             >

//               <CardContent id="cardcontent_learner">
//                 <div className="card-hori d-flex">
//                   <div>
//                     <img
//                       id="thumbnail"
//                       src={course.thumbnailimage}
//                       alt="Course Thumbnail"
//                       height={150}
//                       width={100}
//                     />
//                     <Typography variant="h5" component="h2">
//                       {course.enrolledCoursename}
//                     </Typography>
//                   </div>

//                   <div id="coursedetails">

//                     <Typography color="textSecondary"><h3> COURSE DESCRIPTION :</h3>
//                       {course.enrolledcoursedescription}
//                     </Typography>
//                     <div id='level'>
//                       <Typography color="textSecondary"><h5>Category : {course.enrolledcoursecategory}</h5>
//                       </Typography>
//                       <Typography color="textSecondary"><h5>Level :  {course.enrolledcourselevels}</h5>
//                       </Typography>
//                       <LinearProgress
//                         variant='determinate'
//                         value={courseCompletionPercentages[course.courseId] || 0}
//                         sx={{ height: 10, borderRadius: 5, marginTop: 1, Width: '100%', flexGrow: 1 }}
//                       >
//                         <Typography variant='body2' component="div" sx={{ marginLeft: 1 }}>
//                           {`${courseCompletionPercentages[course.enrolledCourseId] || 0}%`}
//                         </Typography>
//                       </LinearProgress><p>{courseCompletionPercentages[course.enrolledCourseId]}%</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//               <Button style={{ marginLeft: "5%", backgroundColor: "midnightblue" }} variant="contained" color="error" onClick={() => { handleClickOpen(); setenrollmentcourseid(course.enrollmentid) }}>
//                 Unenroll
//               </Button>
//               <Dialog
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogTitle id="alert-dialog-title">{"Are you sure want to unenroll the course?"}</DialogTitle>
//                 <DialogContent>
//                   {/* <DialogContentText id="alert-dialog-description">
//             Let Google help apps determine location. This means sending anonymous location data to
//             Google, even when no apps are running.
//           </DialogContentText> */}
//                 </DialogContent>
//                 <DialogActions>
//                   <Button color="primary" onClick={handleClose}>
//                     No
//                   </Button>
//                   <Button color="primary" onClick={handleUnenroll(enrollmentcourseid)} >
//                     Yes
//                   </Button>
//                 </DialogActions>
//               </Dialog>

//               <Button style={{ marginLeft: "2%", backgroundColor: "midnightblue" }} onClick={handleNavigation(course)} variant="contained" >
//                 {/* Change the button text based on whether the course has been started */}
//                 {startedCourses[course.enrolledCourseId] ? 'Resume Course' : 'Start Course'}
//               </Button>

//             </Card>
//           </Link>

//         ))
//         }
//       </div>
//     </div>

//   );
// };

// export default GetEnrollment;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "../../Styles/Learner/GetEnrollment.css";
import LearnerNavbar from '..//../components/LearnerComponent/LearnerNavbar';
import { useDispatch, useSelector } from "react-redux";
import { fetchenrollCourse, selectCourse } from "../../actions/LearnerAction/EnrolledCourseAction";
import { Link } from "react-router-dom";
// import LearnerNavbar from "../../components/LearnerComponent/LearnerNavbar";
import LearnerProgressApi from "../../middleware/LearnerMiddleware/LearnerProgressApi";
import LinearProgress from '@mui/material/LinearProgress';
import { DialogActions } from '@mui/material';
import { Button } from '@mui/material';0
import { DialogContent } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import UnenrollCourseApi from "../../middleware/LearnerMiddleware/UnenrollApi";
import Swal from "sweetalert2";
import { BeatLoader } from 'react-spinners';

const GetEnrollment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const id = sessionStorage.getItem('UserSessionID')
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = useState(60);
  const [courseCompletionPercentages, setCourseCompletionPercentages] = useState({});
  const viewcourse = useSelector((state) => state.enroll.course[0]);
  const [startedCourses, setStartedCourses] = useState(() => {
    const savedCourses = localStorage.getItem('startedCourses');
    return savedCourses ? JSON.parse(savedCourses) : {};
  });
  const [courses, setCourses] = useState([]);
  const learnerId = sessionStorage.getItem('UserSessionID');
  const enrollmentId = JSON.parse(sessionStorage.getItem('enrolled'));

  useEffect(() => {
    dispatch(fetchenrollCourse(id));
  }, [dispatch]);

  const [enrollmentcourseid, setenrollmentcourseid] = useState();

  useEffect(() => {
    fetchprogress(learnerId, enrollmentId);
  }, [learnerId, enrollmentId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchprogress = async (learnerId, enrollmentId) => {
    try {
      const data = await LearnerProgressApi(learnerId, enrollmentId);
      const progressData = data.reduce((acc, item) => {
        acc[item.courseId] = item.courseCompletionPercentage;
        return acc;
      }, {});
      setCourseCompletionPercentages(progressData);
      setProgress(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const navigate = useNavigate();

  const handleNavigation = (course) => (e) => {
    e.preventDefault();
    dispatch(selectCourse(course));
    setStartedCourses(prevState => {
      const updatedCourses = { ...prevState, [course.enrolledCourseId]: true };
      localStorage.setItem('startedCourses', JSON.stringify(updatedCourses));
      return updatedCourses;
    });
    navigate(`/ViewTopics/${course.enrolledCourseId}`);
  };

  useEffect(() => {
    setCourses(viewcourse);
  }, [viewcourse]);

  const handleUnenroll = (enrollid) => async (e) => {
    e.preventDefault();
    try {
      await UnenrollCourseApi(enrollid);
      handleClose();
      const Toast = Swal.mixin({
        toast: true,
        background: '#21903d',
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        iconColor: 'white',
        title: "Course UnEnrolled Successfully!!",
        customClass: {
          popup: 'Unenrolled-Success-Message'
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      //await setCourses(prevCourses => prevCourses.filter(course => course.enrollmentid !== enrollid));
      dispatch(fetchenrollCourse(id));
      setTimeout(() => {
        setIsLoading(true);
        window.location.reload();
      }, 2000)
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <BeatLoader color={"#123abc"} loading={isLoading} size={50} />
      </div>
    );
  }

  // if (courses.length === 0) {
  //   return (
  //     <div>
  //       {/* <LearnerNavbar /> */}
  //       <h2>No courses are enrolled.</h2>
  //     </div>
  //   );
  // }

  if (!courses || courses.length === 0) {
    return (
      <div>
        <LearnerNavbar />
        <h2 style={{marginTop:"5%",marginLeft:"7%"}}>"No courses here yet? Let's change that! Dive into a 
        world of knowledge and start your learning journey today. Remember, the best investment you can ever
         make is in yourself. Enroll in a course now and take the first step towards your future success!"
</h2>
      </div>
    );
}

  return (
    <div id="learner-body">



      <LearnerNavbar />


     



      <div className=" d-block" id='box_learner'>

    
      
    
        {courses && courses.map((course, index) => (

          <Link key={index} id="Card_learner">
            <Card 
             

            >

              <CardContent id="cardcontent_learner">
                <div className="card-hori d-flex">
                  <div >
                    <img style={{height:"25vh"}}
                      id="thumbnail"
                      src={course.thumbnailimage}
                      alt="Course Thumbnail"
                 
                    />
                    <Typography variant="h5" component="h2">
                      {course.enrolledCoursename}
                    </Typography>
                  </div>

                  <div id="coursedetails">

                    <Typography color="textSecondary"><h3> COURSE DESCRIPTION :</h3>
                      {course.enrolledcoursedescription}
                    </Typography>
                    <div id='level'>
                      <Typography color="textSecondary"><h5>Category : {course.enrolledcoursecategory}</h5>
                      </Typography>
                      <Typography color="textSecondary"><h5>Level :  {course.enrolledcourselevels}</h5>
                      </Typography>
                      <LinearProgress
                        variant='determinate'
                        value={courseCompletionPercentages[course.courseId] || 0}
                        sx={{ height: 10, borderRadius: 5, marginTop: 1, Width: '100%', flexGrow: 1 }}
                      >
                        <Typography variant='body2' component="div" sx={{ marginLeft: 1 }}>
                          {`${courseCompletionPercentages[course.enrolledCourseId] || 0}%`}
                        </Typography>
                      </LinearProgress><p>{courseCompletionPercentages[course.enrolledCourseId]}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <Button id="Learnerbuttonone" style={{ marginLeft: "5%", backgroundColor: "midnightblue" }} variant="contained" color="error" onClick={() => { handleClickOpen(); setenrollmentcourseid(course.enrollmentid) }}>
                Unenroll
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Are you sure want to unenroll the course?"}</DialogTitle>
                <DialogContent>
                  {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                  <Button id="Learnerbuttonone" color="primary" onClick={handleClose}>
                    No
                  </Button>
                  <Button id="Learnerbuttonone" color="primary" onClick={handleUnenroll(enrollmentcourseid)} >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>

              <Button id="Learnerbuttonone" style={{  backgroundColor: "midnightblue" }} onClick={handleNavigation(course)} variant="contained" >
                {/* Change the button text based on whether the course has been started */}
                {startedCourses[course.enrolledCourseId] ? 'Resume Course' : 'Start Course'}
              </Button>

            </Card>
          </Link>

        ))
        }
      </div>
    </div>

  );
};

export default GetEnrollment;

