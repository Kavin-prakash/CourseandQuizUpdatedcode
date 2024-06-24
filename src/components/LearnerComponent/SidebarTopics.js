import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/Learner/Navbarone.css";
import logo from "../../../src/Images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PDFViewer from "./PDFViewer";
import { CiMusicNote1 } from "react-icons/ci";
import { BsFiletypePdf, BsFiletypePpt } from "react-icons/bs";
import { FaFileAlt, FaCheck } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import CourseDescription from "./CourseDescription";
import LearnerAudioViewer from "./LearnerAudioViewer";
import LearnerVideoViewer from "./LearnerVideoViewer";
import { fetchQuizIdRequest } from "../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";
import PptViewerComponent from "./Pptxday";
import { selectCourse, } from "../../actions/LearnerAction/EnrolledCourseAction";
//  import {fetchTopicsRequest} from '../../actions/Course/Topic/FetchTopicsAction'
import { getIndividualEnrollCourseRequest } from '../../actions/LearnerAction/FetchIndividualEnrolledCourseAction';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Row,Col } from "react-bootstrap";
import {  FaBook, FaBookOpen} from "react-icons/fa";
//import { CiMusicNote1 } from "react-icons/ci";
// import { BsFiletypePdf, BsFiletypePpt } from "react-icons/bs";
import { fetchlearnersresultRequest } from "../../actions/Quiz And Feedback Module/Learner/GetResultByLearnerIDAction";
import { fetchlearnerfeedbackresultRequest } from "../../actions/Quiz And Feedback Module/Learner/LearnerFeedbackResultAction";
import { BackButton } from "../../View/Course/BackButton";
 
function SidebarTopics() {
  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
 
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [learnerfeedbacks, setlearnerfeedbacks] = useState([false]);
  const [topics, setTopics] = useState();
  const [topic, setTopic] = useState();
 
 
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
 
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
 
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
 
 
  const { courseId } = useParams();
  const [topicId, settopicId] = useState();
  const selectedCourseSelector = useSelector((state) => state.fetchEnrolledIndividualCourse.individualcourse);
  const [selectedCourse, setselectedCourse] = useState();
  const quiz = useSelector((state) => state.quizId.quizId);
  const[quizId, setQuizId] = useState();
 
 
  useEffect(()=>{
    setQuizId(quiz);
  },[quiz])
  console.log("one", quizId);
  // const id = sessionStorage.getItem('UserSessionID')
  // const viewcourse = useSelector((state) => state.enroll.course[0]);
  const userId = sessionStorage.getItem("UserSessionID");
  const learneridresult = sessionStorage.getItem("UserSessionID");
  const learnerquiz = useSelector((state) => state.learnersresult.learnersfeedbackresultdetails);
  const learnertopicfeedback = useSelector((state) => state.learnerfeedbackresult.learnersfeedbackresultdetails?.isTopicFeedbackSubmitted);
 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pdf = useSelector((state) => state.fetchPdf.material);
  const quizresult = useSelector((state)=> state.learnersresult.learnersresultdetails)
  console.log("check", quizresult);
  useEffect(() => {
    dispatch(getIndividualEnrollCourseRequest(courseId));
 
  }, [courseId])
 
  useEffect(() => {
    setselectedCourse(selectedCourseSelector);
  }, [selectedCourseSelector])
 
  useEffect(() => {
    console.log("ssss", selectedCourse);
  }, [selectedCourse]);
  const [folders, setFolders] = useState([
    {
      name: selectedCourse ? selectedCourse.enrolledCoursename : "Loading...",
      isOpen: false,
      topics: selectedCourse && selectedCourse.topics
        ? selectedCourse.topics.map((topic) => ({
          name: topic.topicName,
          topicid: topic.topicId,
          isQuiz:topic.isQuiz,
            isFeedBack:topic.isFeedBack,
          isOpen: false,
          materials: topic.materials
            ? topic.materials.map((material) => ({
              materialId: material.materialId,
              materialname: material.materialName,
              materiallink: material.material,
              materialType: material.materialType,
            }))
            : [],
        }))
        : [],
    },
  ]);
 
  useEffect(() => {
    setFolders([
      {
        name: selectedCourse ? selectedCourse.enrolledCoursename : "Loading...",
        isOpen: false,
        topics: selectedCourse && selectedCourse.topics
          ? selectedCourse.topics.map((topic) => ({
            name: topic.topicName,
            topicid: topic.topicId,
            isOpen: false,
            isQuiz:topic.isQuiz,
            isFeedBack:topic.isFeedBack,
            materials: topic.materials
              ? topic.materials.map((material) => ({
                materialId: material.materialId,
                materialname: material.materialName,
                materiallink: material.material,
                materialType: material.materialType,
              }))
              : [],
          }))
          : [],
      },
    ])
  }, [selectedCourse])
 
  useEffect(() => {
    console.log(folders);
  }, [folders]);
 
  const [selectedComponent, setSelectedComponent] = useState(
    <CourseDescription courseId={courseId} />
  );
  const [openedMaterials, setOpenedMaterials] = useState(new Set());
  const [completedTopics, setCompletedTopics] = useState(() => {
    const storedCompletedTopics = sessionStorage.getItem(
      `completedTopics_${userId}`
    );
    return storedCompletedTopics
      ? new Set(JSON.parse(storedCompletedTopics))
      : new Set();
  });
 
  useEffect(() => {
    const storedOpenedMaterials = sessionStorage.getItem(
      `openedMaterials_${userId}`
    );
    if (storedOpenedMaterials) {
      setOpenedMaterials(new Set(JSON.parse(storedOpenedMaterials)));
    }
  }, [userId]);
 
  const saveOpenedMaterials = (openedMaterials) => {
    sessionStorage.setItem(
      `openedMaterials_${userId}`,
      JSON.stringify(Array.from(openedMaterials))
    );
  };
 
  const saveCompletedTopics = (completedTopics) => {
    sessionStorage.setItem(
      `completedTopics_${userId}`,
      JSON.stringify(Array.from(completedTopics))
    );
  };
 
  // useEffect(() => {
  // fetchquizid()
  // }, [topicId]);
 
  const fetchquizid = async (topicindex) => {
    console.log("handleAddQuiz called with topicId:", folders[0].topics[topicindex].topicid);
    settopicId(folders[0].topics[topicindex].topicid);
    await dispatch(fetchQuizIdRequest(folders[0].topics[topicindex].topicid));
  }; //change
 
  // const getCourseDetails = () =>{
  //   try{
  //     console.log("ghdgf");
  //   dispatch(getIndividualEnrollCourseRequest(courseId))
  //   }catch(error){
  //     console.log(error);
  //   }
  // }
 
  console.log("selected course",selectedCourseSelector);
  console.log("selected topics",selectedCourseSelector.topics);
 
 
  // useEffect(()=>{
  //   setTopics(selectedCourseSelector.topics)
  // },[]);
 
 
 
  const toggleFolder = (index) => {
    const updatedFolders = [...folders];
    updatedFolders[index].isOpen = !updatedFolders[index].isOpen;
    setFolders(updatedFolders);
    console.log("folder",selectedCourseSelector.topics);
    setTopics(selectedCourseSelector.topics)
  };
 
  console.log("topics :", topics);
 
 
  const toggleTopic = async (folderIndex, topicIndex, e) => {
    e.stopPropagation();
   
    if (
      topicIndex > 0 &&
      !completedTopics.has(folders[folderIndex].topics[topicIndex - 1].name)
    ) {
      alert("Please complete the quiz for the previous topic before proceeding.");
      return;
    }
 
    const updatedFolders = [...folders];
    updatedFolders[folderIndex].topics = updatedFolders[folderIndex].topics.map(
      (topic, index) => ({
        ...topic,
        isOpen: index === topicIndex,
      })
    );
    setFolders(updatedFolders);
 
    const topic = topics[0]
    console.log("which topic", topic);
    setTopic(topic)
   
 
    // const topicId = folders[folderIndex].topics[topicIndex].topicid;
    // console.log("give feed index", topicId, learneridresult);
 
 
 
    // try {
    //   // Fetch quizId first
    //   await fetchquizid(topicIndex);
    //   // Now use the fetched quizId in subsequent dispatches
    //   await dispatch(fetchlearnerfeedbackresultRequest(topicId, learneridresult));
    //   console.log("quiqui", learneridresult, quizId);
    //   await dispatch(fetchlearnersresultRequest(learneridresult, quizId));
    // } catch (error) {
    //   console.error("Error in toggleTopic:", error);
    // }
  };
 
  console.log("true",topic);
 
 
 
 
  const opencontent = (type, materiallink, materialId, materialname) => {
    console.log("io" , type);
    console.log("link" , materiallink);
    //console.log("material",materialName)
    setOpenedMaterials((prevOpenedMaterials) => {
      const updatedMaterials = new Set(prevOpenedMaterials);
      updatedMaterials.add(materialId);
      saveOpenedMaterials(updatedMaterials);
      return updatedMaterials;
    });
    switch (type) {
      case "PPT":
        setSelectedComponent(
          <PptViewerComponent material={materiallink} materialId={materialId} materialName={materialname} />
        );
        break;
      case "PDF":
        setSelectedComponent(
          <PDFViewer material={materiallink} materialId={materialId} />
        );
        break;
      case "AUDIO":
        setSelectedComponent(
          <LearnerAudioViewer material={materiallink} materialId={materialId} materialName={materialname} />
        );
        break;
      case "VIDEO":
        setSelectedComponent(
          <LearnerVideoViewer material={materiallink} materialId={materialId} materialName={materialname} />
        );
        break;
      default:
        break;
    }
  };
 
  const areAllMaterialsOpened = (materials) => {
    return materials.every((material) => openedMaterials.has(material.materialId));
  };
 
  const [feedbackGiven, setFeedbackGiven] = useState(false);
 
  const completeTopic = (topicName, topicId) => {
    debugger;
    setCompletedTopics((prevCompletedTopics) => {
      const updatedCompletedTopics = new Set(prevCompletedTopics);
      updatedCompletedTopics.add(topicName);
      saveCompletedTopics(updatedCompletedTopics);
      sessionStorage.setItem("topicId", topicId);
      navigate("/instruction");
      return updatedCompletedTopics;
    });
  };
 
  const giveFeedback = () => {
    setFeedbackGiven(true);
    sessionStorage.setItem("topicId", topicId);
    navigate("/topicfeedbackquestion");
  };
 
 
  console.log("feedback n quiz result", learnertopicfeedback, learnerquiz);
 
 
  console.log("is fedd", learnerfeedbacks);
 
  useEffect(() => { setlearnerfeedbacks(learnertopicfeedback); }, [learnertopicfeedback]);
 
 
 
  return (
    <>
    <Row className="learner_courseView_navbar">
    <AppBar position="static" id="learner_courseView_navbar" >
      {/* <Container maxWidth="xl" className="learner_courseView_navbar"> */}
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              marginLeft:'20px',
            }}
          >
            LXP
          </Typography>
 
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
             
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Course Name</Typography>
                </MenuItem>
           
            </Menu>
          </Box> */}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              marginLeft:'20px',
            }}
          >
            LXP
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end',marginRight:"100px" }} >
    <Button onClick={() => navigate(-1)}
   variant="contained"
        sx={{ my: 2, color: 'white', display: 'block' }}
        id="learner_courseView_backbtn"
    >Back</Button>
 
 
</Box>
 
 
 
          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
             
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Progress</Typography>
                </MenuItem>
             
            </Menu>
          </Box> */}
        </Toolbar>
      {/* </Container> */}
    </AppBar>
    </Row>
    <Row>
      <Col md={10} xs={8} className="content">
       {selectedComponent}
      </Col>
      <Col md={2} xs={4} style={{ color: 'white',backgroundColor:'#EEF5FF',height:'100vh'}}>
      <Row className="d-flex">
  <Row className="side">
    <ul className="tree">
      {folders.map((folder, folderIndex) => (
        <li style={{cursor:"pointer"}} key={folderIndex} className={`folder ${folder.isOpen ? "open" : ""}`}>
          <div onClick={() => toggleFolder(folderIndex)}>
            {folder.isOpen ? <FaBookOpen /> : <FaBook />} {folder.name}
          </div>
          {folder.isOpen && (
            <ul style={{cursor:"pointer"}}>
              {folder.topics?.map((topic, topicIndex) => (
                <li key={topicIndex} className={`folder ${topic.isOpen ? "open" : ""}`}>
                  <div onClick={(e) =>  toggleTopic(folderIndex, topicIndex, e) }>
                    {topic.isOpen ? <FaBookOpen /> : <FaBook />} {topic.name}
                  </div>
                  {topic.isOpen && (
                    <ul>
                      {topic.materials.map((content, contentIndex) => (
                        <li key={contentIndex} className="file" onClick={(e) => {
                          e.stopPropagation();
                          opencontent(content.materialType, content.materiallink, content.materialId, content.materialname);
                        }}>
                          {content.materialType === "VIDEO" ? (
                            <CiYoutube className="icon" style={{ color: "blue", fontSize: "20px" }} />
                          ) : content.materialType === "AUDIO" ? (
                            <CiMusicNote1 className="icon" style={{ color: "blue" }} />
                          ) : content.materialType === "TEXT" ? (
                            <FaFileAlt className="icon" style={{ color: "red" }} />
                          ) : content.materialType === "PDF" ? (
                            <BsFiletypePdf className="icon" style={{ color: "red" }} />
                          ) : (
                            <BsFiletypePpt className="icon" style={{ color: "red" }} />
                          )}
                          {content.materialname}
                          {openedMaterials.has(content.materialId) && (
                            <FaCheck className="icon" style={{ color: "green", marginLeft: "5px" }} />
                          )}
                        </li>
                      ))}
                        {/* <button
                              className="btn btn-primary"
                              disabled={topic.isQuiz}
                              onClick={() => giveFeedback(topic.topicid)}
                            >
                              {topic.isQuiz === true ? "Take Quiz" : "Take Quiz"}
                            </button> */}
{/*
                            <button
                              className="btn btn-primary"
                              disabled={topic.isFeedBack}
                              onClick={() => giveFeedback(topic.topicid)}
                            >
                              {topic.isFeedBack === true ? "Give Feedback" : "Feedback Given"}
                            </button> */}
                            {/* <button
  className="btn btn-primary"
  disabled
  onClick={() => giveFeedback(topic.topicid)}
>
  {topic.isQuiz ? "Quiz Taken" : "Take Quiz"}
</button> */}
{topic.isQuiz==true?
<button  className="btn btn-primary"
  onClick={() => completeTopic(topic.topicName,topic.topicid)}>
Take Quiz
</button>:<><button  className="btn btn-primary"
  disabled>
Take Quiz
</button></>}
 
 
{topic.isFeedBack?<button
  className="btn btn-primary"
 
  onClick={() => giveFeedback(topic.topicid)}
>
  {topic.isFeedBack ? "Feedback Given" : "Give Feedback"}
</button>:<button
  className="btn btn-primary"
  disabled
  onClick={() => giveFeedback(topic.topicid)}
>
  {topic.isFeedBack ? "Feedback Given" : "Give Feedback"}
</button>}
                     
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </Row>
</Row>
 
 
 
 
      </Col>
    </Row>
     
     
    </>
 
  );
}
 
export default SidebarTopics;
 