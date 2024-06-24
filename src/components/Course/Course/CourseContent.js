// import React, { useState, useEffect } from "react";
// import {
//   FaPlay,
//   FaVideo,
//   FaMusic,
//   FaFilePdf,
//   FaFilePowerpoint,
//   FaFileAlt,
//   FaEdit,
//   FaTrash,
// } from "react-icons/fa";
// // import '../../../style/Course/Material/CourseContent.css';
// import '../../../Styles/Course/Material/CourseContent.css';
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// // import { fetchCategoryRequest, fetchLevelRequest } from "../../../action/Course/Course/AddCourseAction";
// // import {fetchCourseTopic} from '../../../actions/Course/Topic/AddTopicAction'
// import { Modal } from "react-bootstrap";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Button, CardActionArea, CardActions } from '@mui/material';
// import { Row, Col, Container } from "react-bootstrap";
// // import { fetchCourseRequest } from "../../../action/Course/Course/FetchCouseDetailsAction";
// import { fetchCourseRequest } from '../../../actions/Course/Course/FetchCouseDetailsAction';
// import { LogoDev } from "@mui/icons-material";

// // import CourseCreationForm from "./Content_Page";
// const Content = () => {
//           {/* mano changes */}

//   const {id} = useParams();
//           {/* stop mano changes */}

//   //const [content,setContent]=useState([]);
//   const dispatch = useDispatch();
//   // const courseid = useSelector((state) => state.addcourse.course_id);
//   const course = useSelector((state) => state.fetchindividualCourse.courses);
//   console.log("Course", course);
//   // console.log("content", courseid);
//           {/* mano changes */}

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchCourseRequest(id));
//     }
//     // console.log("asdfgh", courseid);
//   }
//     , [id]);

//           {/* stop mano changes */}

//   //id=courseid;
//   const navigate = useNavigate();
//   const iscourse = useSelector((state) => state.fetchindividualCourse.isNavigate)
//           {/* mano changes */}


//   const handleAddTopic = (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     if (iscourse) {
//       navigate(`/addtopic/${id}`)
//     }


//   }
//           {/* stop mano changes */}

//   const divStyle = {
//     boxShadow: '0px 4px 8px #23275c', // Replace #yourShadowColor with your color
//   };
//   return (
//     <>
//       <Container style={divStyle} className="mt-5">
//         <Row className="mt-1">
//           <Col md={3} xs={3}></Col>
//           <Col md={6} xs={6}>
//             <Card sx={{ maxWidth: 800 }}>
//               <CardActionArea>
//                 <CardMedia
//                   style={{ objectFit: 'fill' }}
//                   component="img"
//                   height="300"
//                   image={course.thumbnail}
//                   alt="Course-Thumbnail"
//                 />
//                 <CardContent>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {course.title}
//                   </Typography>
//                   <Typography variant="caption" display="block">
//                     {/* mano changes */}
//                     Category : {course.category}
//                     {/* stop mano changes */}

//                   </Typography>
//                   <Typography variant="caption" display="block">
//                     Level : {course.level}
//                   </Typography>
//                   <Typography variant="caption" display="block">
//                     Duration : {course.duration} hrs
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {course.description}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//               <CardActions>
//                 <Button size="small" color="primary" onClick={handleAddTopic}>
//                   Add Topic
//                 </Button>
//               </CardActions>
//             </Card>
//           </Col>
//           <Col md={3} xs={3}></Col>
//         </Row>
//       </Container>

//     </>
//   );
// };
// export default Content;
//==========================================================================
import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaVideo,
  FaMusic,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Row, Col, Container } from "react-bootstrap";
import { fetchCourseRequest } from '../../../actions/Course/Course/FetchCouseDetailsAction';
import { LogoDev } from "@mui/icons-material";
import { FaHandPointRight } from "react-icons/fa";
//-------------------------------
import { RESET_THE_SUBMITTED_MESSGAE, createTopicsRequest,RESET_EXISTED_MESSAGE } from '../../../actions/Course/Topic/AddTopicAction';
import { validateTopicForm } from '../../../utils/Course/Topic/AddTopicValidation';
// import { fetchTopicsRequest } from '../../../action/Course/Topic/FetchTopicsAction';
import { fetchTopicsRequest } from '../../../actions/Course/Topic/FetchTopicsAction';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Alert } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import AddTopic from "../Topic/AddTopic";
import Swal from "sweetalert2";
// import '../../../style/Course/Material/CourseContent.css';
import '../../../Styles/Course/Material/CourseContent.css'
//-----------------------------
const Content = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  //const courseid = useSelector((state) => state.addcourse.course_id);
  const course = useSelector((state) => state.fetchindividualCourse.courses);
  const navigate = useNavigate();
  const iscourse = useSelector((state) => state.fetchindividualCourse.isNavigate);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseRequest(id));
    }
  }, [id]);

  // const handleAddTopic = (e) => {
  //   e.preventDefault();
  //   if (iscourse) {
  //     navigate(`/addtopic/${courseid}`);
  //   }
  // };

  const handleToggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // const divStyle = {
  //   boxShadow: '0px 4px 8px #23275c',
  //   height: '400px',
  //   width: '1200px',backgroundColor:'#DDDDDD'

  // };
  //**************************************************************************************************** */
  sessionStorage.setItem("userName", "Mano");
  //end
  //const navigate=useNavigate();
  const [errors, setErrors] = useState({});
  //const dispatch = useDispatch();
  //const { id } = useParams();
  //const [courseId,setCourseId]=useState(props.courseId??"273a1881-adb6-498c-9c35-5ba7d4b0c64b")
  // const Id=id;
  //console.log("topic inside courseId",Id);

  const [open, setOpen] = React.useState(false);
  const [topics, setTopics] = useState({

    courseId: id,
    name: "",
    description: "",
    createdBy: "Mano"

  });
  const isExist = useSelector((state) => state.Topic.isExisted);
  const [existMsg, setExistMsg] = useState('');
  useEffect(() => {
    if (isExist) {
      // setExistMsg('Topic already exists');
      // const timer = setTimeout(() => {
      //   setExistMsg('');
      // }, 5000);

      // return () => clearTimeout(timer);
      const Toast = Swal.mixin({
        
        customClass:'topic-created-success-messgae',
        toast: true, position: "top", showConfirmButton: false,
        timer: 3000, timerProgressBar: true, didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer; }
      });
      Toast.fire({ icon: "warning", title: "Topic already exists" });
      dispatch({ type: RESET_EXISTED_MESSAGE })
    }
  }, [isExist])

  const addSuccessState = useSelector((state) => state.Topic.isSubmitted);

  const [successMsg, setSuccessMsg] = useState('')
  useEffect(() => {
    if (addSuccessState) {

      // setSuccessMsg('Topic added successfully');
      const Toast = Swal.mixin({
        
        customClass:'topic-created-success-messgae',
        toast: true, position: "top", showConfirmButton: false,
        timer: 3000, timerProgressBar: true, didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer; }
      });
      Toast.fire({ icon: "success", title: "Topic created Successfuly" });

      dispatch({ type: RESET_THE_SUBMITTED_MESSGAE });

      const timer = setTimeout(() => {
        setSuccessMsg('');

      }, 7000);

      // Clear the timeout if the component unmounts

      return () => clearTimeout(timer);



    }
  }, [addSuccessState])

  //const[topics,setTopics]=useState([]);

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    // window.location.reload();
    setOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("createdispatch", topics);
    const isFormValid = validateTopicForm(topics, setErrors);

    if (isFormValid) {
      try {
        dispatch(createTopicsRequest(topics))
        dispatch(fetchTopicsRequest(id));

        handleClose();


      } catch (error) {
        console.error('Error creating course:', error);
      }
    }
    setTopics({
      courseId: id,
      name: "",
      description: "",
      createdBy: sessionStorage.getItem("userName")

    });



    // navigate('/savedtopics')
    // handleClose();


  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // const {name,description,isactive}=e.target;
    setTopics({ ...topics, [name]: value });
  }


  const handleClick = () => {
    AddTopic(); // Call the AddTopic function
  };
  return (


    //-----------------
    <Container>
      <Row className="mt-1">
        {!open && successMsg && (
          <Alert severity="success" className="mt-3">
            {successMsg}
          </Alert>
        )}
        {!open && existMsg && (
          <Alert severity="warning" className="mt-3">
            {existMsg}
          </Alert>
        )}

        <Col md={12} xs={12} >
          <Card sx={{ display: 'flex', maxWidth: 1200, marginLeft: '100px', marginTop: '60px', marginRight: '100px', width: '1500px', height: '380px', fontSize: '18px',boxShadow: '0px 4px 8px #23275c', }}>
            <CardMedia
              style={{ objectFit: 'cover', width: '40%' }}
              component="img"
              height="380"

              image={course.thumbnail}
              alt="Course-Thumbnail"
            />
            <CardContent sx={{ flex: 1, width: '80%' }}>
              <Typography gutterBottom variant="h4" component="div">
                <b>{course.title}</b>


              </Typography>

              <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                <b>Category:</b> {course.category}
              </Typography>
              <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                <b>Level:</b> {course.level}
              </Typography>
              <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                <b>Duration: </b>{course.duration} hrs
              </Typography>
              <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                <b>Course Description: </b>
                {course.description ? (isExpanded ? course.description : `${course.description.substring(0, 100)}...`) : 'No description available'}
              </Typography>
              {course.description && course.description.length > 100 && (
                <Button size="small" color="primary" onClick={handleToggleDescription}>
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Button>
              )}

              <div style={{ marginLeft: '120px' }}>



                <button type="button" class="btn btn-primary" onClick={handleClickOpen} style={{ paddingLeft: '60px', paddingRight: '60px', color: 'blue', backgroundColor: 'white', marginLeft: '350px', marginTop: '15px' }}>Add Topics</button>
              </div>
              {/* <CardActions>
                <Button size="small" color="primary" onClick={handleAddTopic}>
                  Add Topic
                </Button>
              </CardActions> */}
              <br />

              <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: 'form',
                  onSubmit: handleSubmit,
                }}
              >
                <DialogTitle className='dialog-clr'>Add Topics</DialogTitle>
                <DialogContent className='dialog-content'>

                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Course Topic"
                    type="longtext"
                    fullWidth
                    variant="standard"
                    value={topics.name}
                    onChange={handleInputChange}
                    style={{ fontWeight: '700px' }}
                  // onChange={(e) => setTopics({ ...topics, name: e.target.value })}
                  // style={{margin:'10px'}}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                  <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    fullWidth
                    value={topics.description}
                    onChange={handleInputChange}

                    // onChange={(e) => setTopics({ ...topics,description: e.target.value })}
                    style={{ marginTop: '45px' }}

                  />
                  {errors.description && <p className="error">{errors.description}</p>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" >Save</Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>

        </Col>
      </Row>

    </Container>
  );
};

export default Content;