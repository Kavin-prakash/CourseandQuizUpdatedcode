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
import { Button } from '@mui/material';
import { DialogContent } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import UnenrollCourseApi from "../../middleware/LearnerMiddleware/UnenrollApi";
import Swal from "sweetalert2";
import { BeatLoader } from 'react-spinners';
import { Modal} from 'react-bootstrap';
 
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
 
// bootstrap modal
return (
  <div className="page-container_Mycourse">
  <LearnerNavbar />
  {/* <div className="title-bar">My Courses</div> */}
  <div className="course-grid_Mycourse">
    {courses.map((course, index) => (
      <div className="course-card_Mycourse" key={index}>
        <div className="course-header_Mycourse">
          <img className="course-image_Mycourse" src={course.thumbnailimage}  alt="Course Thumbnail" />
          <div className="course-title-container_Mycourse">
            <h3 className="course-title_Mycourse">{course.enrolledCoursename}</h3>
          </div>
        </div>
        <div className="course-content_Mycourse">
          <p className="course-details_Mycourse"><strong>Category:</strong> {course.enrolledcoursecategory}</p>
          <p className="course-details_Mycourse"><strong>Level:</strong> {course.enrolledcourselevels}</p>
       
          <div className="progress-bar_Mycourse">
            <div
              className="progress-fill_Mycourse"
              style={{width: `${courseCompletionPercentages[course.courseId] || 0}%`}}
            ></div>
          </div>
          <div className="button-container_Mycourse">
            <button className="button_Mycourse unenroll" onClick={() => { handleClickOpen(); setenrollmentcourseid(course.enrollmentid) }}>
              Unenroll
            </button>
            <button className="button_Mycourse start" onClick={handleNavigation(course)}>
              {startedCourses[course.enrolledCourseId] ? 'Resume Course' : 'Start Course'}
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
  <Modal centered backdrop="static" show={open} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to unenroll the course?</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button id="Learnerbuttonmodal" variant="secondary" onClick={handleClose}>No</Button>
                <Button id="Learnerbuttonmodal" variant="primary" onClick={handleUnenroll(enrollmentcourseid)}>Yes</Button>
              </Modal.Footer>
            </Modal>
</div>
 
);
 
};
 
 
 
export default GetEnrollment;