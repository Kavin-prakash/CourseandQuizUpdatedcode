// import React, { useEffect, useState } from 'react';
// import { connect, useDispatch, useSelector } from 'react-redux';
// import '../../Styles/Learner/LearnerCourse.css';
// import { getCoursesRequest } from '../../actions/LearnerAction/LearnerGetCourseAction';
// import { enrollRequest } from '../../actions/LearnerAction/LearnerPostEnrollAction';
// import enrollmentMiddleware from '../../middleware/LearnerMiddleware/LearnerPostEnroll';
// import { fetchenrollCourse, selectCourse, } from "../../actions/LearnerAction/EnrolledCourseAction";
// import Swal from 'sweetalert2';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Modal from '@mui/material/Modal';
// import Stack from '@mui/material/Stack';
 
 
// const CourseComponent = ({  loading, error, search }) => {
//   const courses = useSelector((state) => state.fetchcourse.courses);
//   const Enrolledcourseslength = useSelector((state) => state.enroll.course[0]);
//   const dispatch = useDispatch();
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [isEnrolled, setIsEnrolled] = useState(new Set());
//   const learnerId = sessionStorage.getItem('UserSessionID'); // Retrieve learner ID from session storage
//   const [open, setOpen] = useState(false);
 
// const alertdisplayenrollment =() =>{
//   const Toast = Swal.mixin({   toast: true,  background:'#5e55df', position: "top",
//     showConfirmButton: false,   timer: 3000,   timerProgressBar: true,
//       didOpen: (toast) => {     toast.onmouseenter = Swal.stopTimer;
//             toast.onmouseleave = Swal.resumeTimer;   } });
//             Toast.fire({   icon: "success", iconColor:'white' , title: "Enrolled successfully",customClass:{
//               popup:'custom-toast'
//             }});
//           }
 
// useEffect(() => {
//     dispatch(getCoursesRequest(learnerId));
//   }, [dispatch, learnerId]);
 
//   useEffect(() => {
//     dispatch(fetchenrollCourse(learnerId));
//   }, [learnerId]);
 
//   useEffect(() => {
//     setFilteredCourses(
//       courses.filter(course =>
//         course.title.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, courses]);
 
 
//   useEffect(() => {
//     if (Enrolledcourseslength) {
//       const enrolledCourseIds = new Set();
//       Enrolledcourseslength.forEach(enrolledCourse => {
//         enrolledCourseIds.add(enrolledCourse.enrolledCourseId);
//       });
//       setIsEnrolled(enrolledCourseIds);
//     }
//   }, [Enrolledcourseslength]);
 
//   const handleOpen = (course) => {
//     setOpen(true);
//     setSelectedCourse(course);
//   };
 
//   const handleClose = () => {
//     setOpen(false);
//   };
 
//   const handleEnrollCourse = (courseId) => {
//     const maxCourses = 3;
//  // const learnercourses = enrollmentMiddleware.filter(course => course.learnerId === learnerId);
 
//     // if (learnerCourses.length >= maxCourses) {
//     //   alert('You have reached the course enrollment limit!');
//     //   return;
//     // }
//     if (Enrolledcourseslength && typeof Enrolledcourseslength.length === 'number') {
//       //console.log("enrolled course length in coursecomponent", Enrolledcourseslength.length);
//       if (Enrolledcourseslength.length >= maxCourses) {
//         alert('You have reached the course enrollment limit!');
//         return;
//       }
//     } else {
//       console.log("Enrolledcourseslength is undefined or does not have a length property");
//     }
//     enrollmentMiddleware(courseId, learnerId).then(() => {
//       // alert('Enrollment successful!');
//       alertdisplayenrollment();
//        setIsEnrolled(prevIsEnrolled => new Set([...prevIsEnrolled, courseId]));
//        handleClose();
//      });

//   if (loading) {
//     return <div>Loading...</div>;
//   }
 
//   if (filteredCourses.length === 0) {
//     return <div><h3>No results found.</h3></div>;
//   }
 
// }
 
//   return (
//     <div>
     
//       <div className="container-fluid" id="Servicemain">
//         <div className="row" id="course-container">
//           {filteredCourses.map((course, index) => (
//             <div className="col-sm-3 allcourse" key={index}>
//               <Card id='course-card_Learner'>
//                 <CardMedia
//                   id='coure-inside_Learner'
//                   component="img"
//                   sx={{ width: 150, marginLeft: 0 }}
//                   image={course.thumbnailimage}
//                   alt={course.title}
//                 />
//                 <Box >
//                   <CardContent id='course-content_Learner' >
//                   <div id='course-typo_Learner'>
//                     <Typography component="div" variant="h5" id='course-name_Learner'>
//                       Course: {course.title}
//                     </Typography>
//                     <Typography variant="subtitle1" color="text.secondary" component="div" id='course-name_Learner'>
//                       Level: {course.level}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" component="div" >
//                       Category: {course.catagory}
//                     </Typography>
//                     <Button onClick={() => handleOpen(course)}>View More</Button>
//                     </div>
//                   </CardContent>
//                 </Box>
//               </Card>
//               <Modal
//                 open={open && selectedCourse && selectedCourse.courseId === course.courseId}
//                 onClose={handleClose}
//                 aria-labelledby="course-modal-title"
//                 aria-describedby="course-modal-description"
//               >
//                 <Box sx={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   width: 400,
//                   bgcolor: 'background.paper',
//                   border: '2px solid #000',
//                   boxShadow: 24,
//                   pt: 2,
//                   px: 4,
//                   pb: 3,
//                 }}>
//                   <Typography id="course-modal-title" variant="h6" component="h2">{course.title}</Typography>
//                   <Typography id="course-modal-description" variant="body1" color="text.secondary">
//                     {course.description}
//                   </Typography>
//                   <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//                     <Button onClick={handleClose}>Close</Button>
//                     <Button
//                       className="btn btn-lg"
//                       onClick={() => handleEnrollCourse(course.courseId)}
//                       disabled={isEnrolled.has(course.courseId)} // Disable if course is in the enrolledCourseIds set
//                     >
//                       {isEnrolled.has(course.courseId) ? 'Enrolled' : 'Enroll'}
//                     </Button>
//                   </Stack>
//                 </Box>
//               </Modal>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
 
 
 
// export default CourseComponent;





















import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../Styles/Learner/LearnerCourse.css';
// import {  } from '../../actions/LearnerAction/LearnerGetCourseAction';
 import { getCoursesRequest } from '../../actions/LearnerAction/LearnerGetCourseAction';
import { enrollRequest } from '../../actions/LearnerAction/LearnerPostEnrollAction';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import LearnerNavbar from '../LearnerComponent/LearnerNavbar';
import enrollmentMiddleware from '../../middleware/LearnerMiddleware/LearnerPostEnroll';
import { fetchenrollCourse, selectCourse, } from "../../actions/LearnerAction/EnrolledCourseAction";
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton'; 
import CircularProgress from '@mui/material/CircularProgress';

const CourseComponent = ({ loading, error, search }) => {
  const courses = useSelector((state) => state.fetchcourse.courses);
  const Enrolledcourseslength = useSelector((state) => state.enroll.course[0]);
  const dispatch = useDispatch();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(new Set());
  const learnerId = sessionStorage.getItem('UserSessionID'); // Retrieve learner ID from session storage
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const alertsuccess = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const alertdisplayenrollment = () => {
    const Toast = Swal.mixin({
      toast: true,
      background: '#21903d',
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
      iconColor: 'white',
      title: "Enrolled successfully",
      customClass: {
        popup: 'custom-toast'
      }
    });

    // Set a flag in localStorage indicating the user has just enrolled
    localStorage.setItem('justEnrolled', 'true');

    // Reload the page after 2 seconds
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    dispatch(getCoursesRequest(learnerId));
  }, [dispatch, learnerId]);

  useEffect(() => {
    dispatch(fetchenrollCourse(learnerId));
  }, [learnerId]);

  useEffect(() => {
    setFilteredCourses(courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, courses]);

  useEffect(() => {
    if (Enrolledcourseslength) {
      const enrolledCourseIds = new Set();
      Enrolledcourseslength.forEach(enrolledCourse => {
        enrolledCourseIds.add(enrolledCourse.enrolledCourseId);
      });
      setIsEnrolled(enrolledCourseIds);
    }
  }, [Enrolledcourseslength]);

  // On the page that's being reloaded
  useEffect(() => {
    // Check if the user has just enrolled
    if (localStorage.getItem('justEnrolled') === 'true') {
      // Clear the flag
      localStorage.removeItem('justEnrolled');
      setIsLoading(false);

      // Navigate to "/LearnerenrolledCourse" after a delay
      setTimeout(() => {
        navigate("/LearnerenrolledCourse");
      }, 1000);
    }
  }, []);

  const handleOpen = (course) => {
    setOpen(true);
    setSelectedCourse(course);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEnrollCourse = (courseId) => {
    const maxCourses = 3;
  
    if (Enrolledcourseslength && typeof Enrolledcourseslength.length === 'number') {
      if (Enrolledcourseslength.length >= maxCourses) {
        const Toast = Swal.mixin({
          toast: true,
          background: 'red',
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
  
        Toast.fire({
          icon: "error",
          iconColor: 'white',
          title: "You have reached the course enrollment limit!",
          customClass: {
            popup: 'custom-toast'
          }
        });
  
        return;
      }
    }
  
    // Show the loader
    setIsLoading(true);
  
    enrollmentMiddleware(courseId, learnerId).then(() => {
      alertdisplayenrollment();
      setIsEnrolled(prevIsEnrolled => new Set([...prevIsEnrolled, courseId]));
      handleClose();
    });
  };
  

  if (isLoading) {
    return <CircularProgress />; // Return a CircularProgress component when isLoading is true
  }


  if (filteredCourses.length === 0) {
    return <div><h3>No results found.</h3></div>;
  }
return (
  <div>
   
    <div className="container-fluid" id="Servicemain">
      <div className="row" id="course-container">
        {filteredCourses.map((course, index) => (
          <div className="col-sm-3 allcourse" key={index}>
            <Card id='course-card_Learner'>
              <CardMedia
                id='coure-inside_Learner'
                component="img"
                sx={{ width: 150, marginLeft: 0 }}
                image={course.thumbnailimage}
                alt={course.title}
              />
              <Box >
                <CardContent id='course-content_Learner' >
                <div id='course-typo_Learner'>
                  <Typography component="div" variant="h5" id='course-name_Learner'>
                    Course: {course.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div" id='course-name_Learner'>
                    Level: {course.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div" >
                    Category: {course.catagory}
                  </Typography>
                  <Button onClick={() => handleOpen(course)}>View More</Button>
                  </div>
                </CardContent>
              </Box>
            </Card>
            <Modal
              open={open && selectedCourse && selectedCourse.courseId === course.courseId}
              onClose={handleClose}
              aria-labelledby="course-modal-title"
              aria-describedby="course-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                pt: 2,
                px: 4,
                pb: 3,
              }}>
                <Typography id="course-modal-title" variant="h6" component="h2">{course.title}</Typography>
                <Typography id="course-modal-description" variant="body1" color="text.secondary">
                  {course.description}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button onClick={handleClose}>Close</Button>
                  <Button
                    className="btn btn-lg"
                    onClick={() => handleEnrollCourse(course.courseId)}
                    disabled={isEnrolled.has(course.courseId)} // Disable if course is in the enrolledCourseIds set
                  >
                    {isEnrolled.has(course.courseId) ? 'Enrolled' : 'Enroll'}
                  </Button>
                </Stack>
              </Box>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default CourseComponent;


