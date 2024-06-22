import LearnerNavbar from '../LearnerComponent/LearnerNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import * as React from 'react';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getCoursesRequest } from '../../actions/LearnerAction/LearnerGetCourseAction';
import { enrollRequest } from '../../actions/LearnerAction/LearnerPostEnrollAction';
import '../../Styles/Learner/LearnerCourse.css';
import { FetchuserDataRequest } from '../../actions/LearnerAction/FetchRegisterAction';
import '../../Styles/Learner/LearnerDashboard.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import IconButton from '@mui/material/IconButton';
import { indigo } from '@mui/material/colors';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import { TopicScoreApi } from '../../middleware/LearnerMiddleware/TopicScoreApi';
import LinearProgress from '@mui/material/LinearProgress';
import { FetchDashboardRequest } from '../../actions/LearnerAction/LearnerdashboardAction';
import { LineChart } from '@mui/x-charts';
import { getUserProfileRequest } from '../../actions/LearnerAction/GetUpdateUserProfileAction';
import { FetchLearnerProgressRequest } from '../../actions/LearnerAction/FetchLearnerProgressAction';
import LearnerProgressApi from '../../middleware/LearnerMiddleware/LearnerProgressApi';
import LearnerScoreProgressBarGraph from './LearnerScoreProgressBarGraph';
import profile1 from '../../Images/profile1.png';
import { useNavigate } from 'react-router-dom';
import { Center, background } from '@chakra-ui/react';
import { Block } from '@mui/icons-material';
import Lxp3 from '../../Images/LXP3.png';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import CircularProgress from '@mui/joy/CircularProgress';
// import { useCountUp } from 'use-count-up';
import lxp1 from '../../Images/lxp1.jpg';
import { fetchenrollCourse, selectCourse, } from "../../actions/LearnerAction/EnrolledCourseAction";



const LearnerDashboard = ({ enrolledCourses, loading, error, search }) => {
  const courses = useSelector((state) => state.fetchcourse.courses);
  const dispatch = useDispatch();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const selectedStream = useSelector((state) => state.fetchlearner.userData.stream);
  const [profilePic, setProfilePic] = useState("https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg");
  const [progress, setProgress] = useState(60);
  const [scoreData, setScoreData] = useState([]);
  const learnerId = sessionStorage.getItem('UserSessionID'); // Retrieve learner ID from session storage
  const selectedcount = useSelector((state) => state.learnerdashboard.dashboard);
  console.log("selectedcount", selectedcount);
  // const selectedenrollcount = useSelector((state) => state.learnerdashboard.dashboard.enrolledCourseCount);
  // console.log("selectedenrollcount",selectedenrollcount);
  const selectedenrollcount = selectedcount.enrolledCourseCount || 0;
  const selectedinprogresscount = selectedcount.inProgressCount || 0;
  const selectcompletecount = selectedcount.completedCount || 0;
  const navigate = useNavigate();
  const [TopicId] = useState("2df47ffa-3fc0-44c7-b869-c403f5542150");
  const [isLoading, setIsLoading] = useState(false);
  const viewcourse = useSelector((state) => state.enroll.course[0]);
  console.log("viewcourse", viewcourse)

  // const [LearnerId] = useState("6bdbab27-c637-48ff-850e-2cf9eb700a40");

  const selectedprogress = useSelector((state) => state);
  console.log("selectedprogress", selectedprogress);

  const profilePhoto = sessionStorage.getItem("userData");
  console.log("userData", profilePhoto)


  const enrollmentId = sessionStorage.getItem("enrolled");
  console.log("enrolleddashbaord", enrollmentId);

  const firstname = useSelector((state) => state.fetchlearner.userData.firstName);
  console.log("firstname", firstname);

  const lastname = useSelector((state) => state.fetchlearner.userData.lastName);
  console.log("lastname", lastname);

  const dob = useSelector((state) => state.fetchlearner.userData.dob);
  console.log("dob", dob);

  const contactNumber = useSelector((state) => state.fetchlearner.userData.contactNumber);
  console.log("contactNumber", contactNumber);

  const email = useSelector((state) => state.fetchlearner.userData.email);
  console.log("email", email);



  useEffect(() => {
    fetchData((learnerId));

  }, [dispatch]);

  useEffect(() => {
    fetchCourseScores(learnerId, TopicId);
  }, [learnerId, TopicId]);

  useEffect(() => {
    fetchprogress(learnerId, enrollmentId);
  }, [learnerId, enrollmentId]);

  useEffect(() => {
    dispatch(fetchenrollCourse(learnerId));
  }, [learnerId]);

  useEffect(() => {
    if (selectedStream) {
      const streams = selectedStream.split(', ');
      setFilteredCourses(courses.filter(course => streams.map(stream => stream.toLowerCase()).includes(course.title.toLowerCase())));
    } else {
      setFilteredCourses(courses);
    }
  }, [selectedStream, courses]);


  const [open, setOpen] = useState(false);

  const handleOpen = (course) => {
    setOpen(true);
    setSelectedCourse(course);
  };
  const fetchCourseScores = async (learnerId) => {
    const scores = await TopicScoreApi(learnerId);
    setScoreData(scores);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = async (learnerId) => {
    try {
      dispatch(getCoursesRequest(learnerId));
      await
        dispatch(FetchDashboardRequest(learnerId));
      await
        dispatch(FetchuserDataRequest(learnerId));
      await
        dispatch(getUserProfileRequest(learnerId));


    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleCardClick = (status) => {
    navigate('/LearnerenrolledCourse', { state: { status } });
  };


  const fetchprogress = async (learnerId, enrollmentId) => {
    try {
      console.log("enrole success", learnerId, enrollmentId);
      const data = await LearnerProgressApi(learnerId, enrollmentId);
      setProgress(data);

    }
    catch (error) {
      console.error("Error fetching data", error);
    }
  }



  const handleEnrollCourse = (courseId) => {
    const maxCourses = 3;
    const learnerCourses = enrolledCourses.filter(course => course.learnerId === learnerId);

    if (learnerCourses.length >= maxCourses) {
      alert('You have reached the course enrollment limit!');
      return;
    }

    const alreadyEnrolled = enrolledCourses.some(course => course.courseId === courseId && course.learnerId === learnerId);

    if (alreadyEnrolled) {
      alert('You have already enrolled in this course!');
      return;
    }

    try {
      dispatch(enrollRequest(courseId, learnerId));
    }
    catch (error) {
      console.error("Enrollment error:", error);
      alert('Failed to enroll in the course.Please try again later.');
    }

  };

  const isEnrolled = (courseId) => {
    if (!Array.isArray(enrolledCourses)) {
      console.error("enrolledCourses is not an array", enrolledCourses);
      return false;
    }
    return enrolledCourses.some(course => course.courseId === courseId && course.learnerId === learnerId);
  };

  const style = {
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
  };



  if (loading) {
    return <div>Loading...</div>;
  }




  return (
    <div>
      <LearnerNavbar />
      < container fluid style={{ marginLeft: 2 }}>
        <div className='background-container_learner'>
          <div className="container-fluid ">
            <div className="row" id='allcont'>
              <div className=" justify-content-center col-4 " style={{ height: '650px' }}>
                <div id='profile-card'  >
                  {/* <div className="position-relative"> */}
                  {profilePhoto ? <img src={profilePhoto} className=" rounded-circle mt-2 mx-auto" alt="" style={{ width: '70px', height: '70px' }} id='card-img-top' /> : <img src={profile1} className=" rounded-circle mt-5 mx-auto" alt="" style={{ width: '70px', height: '70px' }} id='card-img-top' />}
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-pic-upload"
                    style={{ display: 'none' }}
                    onChange={handleProfilePicChange}
                  />
                  <Typography component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", textAlign: "Center", fontSize: "1.5rem", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                    {(`Hello ${firstname} !!!`)}
                  </Typography>
                  <div style={{ marginTop: 30 }}>
                    <div className='d-flex learner_detail' style={{ backgroundColor: 'white', marginTop: 5, marginLeft: 30 }}>
                      <Typography className='me-3' component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        <BadgeOutlinedIcon />
                      </Typography>
                      <Typography component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        {(` ${firstname} ${lastname}`)}
                      </Typography>
                    </div>
                    <div className='d-flex learner_detail' style={{ backgroundColor: 'white', marginTop: 20, marginLeft: 30 }}>
                      <Typography className='me-3' component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        <CakeOutlinedIcon />
                      </Typography>

                      <Typography component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        {(` ${dob} `)}
                      </Typography>
                    </div>
                    <div className='d-flex learner_detail' style={{ backgroundColor: 'white', marginTop: 20, marginLeft: 30 }}>
                      <Typography className='me-3' component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        <CallOutlinedIcon />
                      </Typography>

                      <Typography component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        {(` ${contactNumber} `)}
                      </Typography>
                    </div>
                    <div className='d-flex learner_detail' style={{ backgroundColor: 'white', marginTop: 20, marginLeft: 30 }}>
                      <Typography className='me-3' component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        <AlternateEmailOutlinedIcon />
                      </Typography>

                      <Typography component="div" variant="h6" id='profile-name' sx={{ color: "#27235C", fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }} >
                        {(` ${email} `)}
                      </Typography>
                    </div>
                  </div>
                  <div class="overallprogress-card_learner">
                    <div class=" rounded-lg p-5 progresscard_learner">
                      <h1 class="h6 font-weight-bold text-center mb-4 progressheading_learner ">Overall progress</h1>
                      <div class="progress mx-auto" data-value='80'>
                        <span class="progress-left">
                          <span class="progress-bar border-primary"></span>
                        </span>
                        <span class="progress-right">

                        </span>
                        <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                          <div class="h2 font-weight-bold">80<sup class="small">%</sup></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                {/* </div> */}
              </div>
              <div className='col-8'>
                <div className='d-flex'>
                  <div className='' id=''>
                    <Card id='count-card' sx={{ backgroundColor: ' #f0f0f0', display: 'Block' }}>
                      <Typography component="div" variant="h6" id='count-name' >
                        Enrolled Course
                      </Typography>
                      <Box className='count-inside d-flex ' onClick={() => handleCardClick('enrolled')} >
                        <IconButton className='count-icons' >
                          <SchoolRoundedIcon sx={{ color: indigo[900], fontSize: 30 }} >
                          </SchoolRoundedIcon>
                        </IconButton>
                        <div id='count-number' >
                          {selectedenrollcount}
                        </div>
                      </Box>
                    </Card>
                  </div>

                  <div className=''>
                    <Card id='count-card' sx={{ backgroundColor: ' #f0f0f0' }}>
                      <Typography component="div" variant="h6" id='count-name' >
                        InProgress Course
                      </Typography>
                      <Box className='count-inside d-flex' onClick={() => handleCardClick('inprogress')}>
                        <IconButton className='count-icons' >
                          <DownloadingRoundedIcon sx={{ color: indigo[900], fontSize: 30 }} >
                          </DownloadingRoundedIcon>
                        </IconButton>
                        <div id='count-number'>
                          {selectedinprogresscount}
                        </div>
                      </Box>
                    </Card>
                  </div>
                  <div className=''>
                    <Card id='count-card' sx={{ backgroundColor: ' #f0f0f0' }}>
                      <Typography component="div" variant="h6" id='count-name' >
                        Completed Course
                      </Typography>
                      <Box className='count-inside d-flex' onClick={() => handleCardClick('completed')}>
                        <IconButton className='count-icons' >
                          <MilitaryTechRoundedIcon sx={{ color: indigo[900], fontSize: 30 }} >
                          </MilitaryTechRoundedIcon>
                        </IconButton>
                        <div id='count-number'>
                          {selectcompletecount}
                        </div>
                      </Box>
                    </Card>
                  </div>
                </div>
                <div className='chart-container d-flex'>
                  <div>
                    <b id='count-scoreprogress' style={{ fontSize: "20px", width: '500px' }}> Score Progress </b>
                    <LearnerScoreProgressBarGraph />
                  </div>
                  {/* <div class="col-xl-3 col-lg-6 mb-4 overallprogress-card_learner">
                    <div class=" rounded-lg p-5 shadow progresscard_learner">
                      <h1 class="h6 font-weight-bold text-center mb-4 progressheading_learner ">Overall progress</h1>
                      <div class="progress mx-auto" data-value='80'>
                        <span class="progress-left">
                          <span class="progress-bar border-primary"></span>
                        </span>
                        <span class="progress-right">
                        
                        </span>
                        <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                          <div class="h2 font-weight-bold">80<sup class="small">%</sup></div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div>
                    <h3 id='count-recommend_Learner' >Ongoing Courses</h3>
                    {viewcourse && viewcourse.map((course, index) => (
                      <div class="proj-progress-card shadow" style={{ margin: 50, width: 400, height: 120 }}>

                        <div key={index} class="d-flex" style={{ margin: 10 }}>
                          <div >
                            <img
                              id="thumbnail"
                              src={course.thumbnailimage}
                              alt="Course Thumbnail"
                              style={{ width: '90px', height: '90px' }}

                            />
                          </div>
                          <div class="enroll-dashboard_learner" style={{ display: 'block', marginLeft: '30px' }}>
                            <h6>  {course.enrolledCoursename}</h6>
                            <h5 class="m-b-30 f-w-700">89%</h5>

                            <div class="enroll_progress">
                              <div class="enroll_progress-bar bg-c-green" style={{ width: 85 }}></div>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))
                    }
                  </div>


                </div>
              </div>
            </div>

            <div className='row' id='recommend-container' >
              <div className=''>
                <h3 id='    '  style={{color:'#27235C'}}>Recommended Courses</h3>
              </div>
              <div className='d-flex'>
                {filteredCourses.map((course, index) => (
                  <div id="rec-course" key={index} >
                    <Card id='course-card' onClick={() => handleCardClick('enrolled')} >
                      <CardMedia
                        className='course-inside_Learner'
                        component="img"
                        sx={{ width: 150 }}
                        image={course.thumbnailimage}
                        alt={course.title}
                      />
                      <CardContent id='course-content' >
                        <div id='course-typo'>
                          <Typography component="div" variant="h5" id='course-name'>
                            Course: {course.title}
                          </Typography>
                          <Typography variant="h6" component="div" id='course-name' >
                            Level: {course.level}
                          </Typography>
                          <Typography variant="subtitle1" component="div" id='course-name'>
                            Category: {course.catagory}
                          </Typography>
                          {/* <Button onClick={() => handleOpen(course)}>View More</Button> */}
                        </div>
                      </CardContent>

                    </Card>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </container>
    </div>

  );
};

const mapStateToProps = (state) => ({
  enrolledCourses: state.enrolledCourses.enrolledCourses || [], // Ensure it's an array
  loading: state.enrolledCourses.loading,
  error: state.enrolledCourses.error,
});

export default connect(mapStateToProps)(LearnerDashboard);