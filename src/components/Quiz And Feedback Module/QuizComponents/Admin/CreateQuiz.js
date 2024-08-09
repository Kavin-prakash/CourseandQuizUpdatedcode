import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IconButton, Stack, Tooltip } from '@mui/material';    // modification for  imports quizteam 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ImFolderUpload } from "react-icons/im";
import { FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Form, Card, OverlayTrigger } from 'react-bootstrap';
import "../../../../Styles/Quiz And Feedback Module/CreateQuiz.css";
import {
    ValidationQuizTitle,
    ValidationDuration,
    ValidationGrade,
    ValidationAttempts,
} from "../../../../utils/Quiz And Feedback Module/ValidationCreateQuiz";
import { DeleteQuizDetails } from "../../../../middleware/Quiz And Feedback Module/Admin/api";
import { GetQuizDetails } from "../../../../middleware/Quiz And Feedback Module/Admin/FetchQuizApi";
import { useNavigate } from "react-router-dom";
import { editQuizDetailsRequest } from "../../../../actions/Quiz And Feedback Module/Admin/EditQuizAction";
import QuestionTemplateView from "../../../../View/Quiz And Feedback Module/QuestionTemplateView";
import { fetchQuizIdFailure } from "../../../../actions/Quiz And Feedback Module/Admin/FetchQuizIdAction";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import CreateQuizApi from "../../../../middleware/Quiz And Feedback Module/Admin/CreateQuizApi";
import { useSelector } from "react-redux";
import { Modal as MuiModal, Box, Typography, TextField, Button as MuiButton } from '@mui/material';
import { fetchTopicsRequest } from "../../../../actions/Course/Topic/FetchTopicsAction";

const MotionCard = motion(Card);
export const Home = () => {
    const quizId = sessionStorage.getItem('quizId');
    const topicId = sessionStorage.getItem('topicId');
    const courseId = sessionStorage.getItem('courseId');
    const selectorTopicsDetail = useSelector((state) => state.fetchTopic.topics[0]);

    // const [viewCourse, setViewCourse] = useState([course])
    console.log("course", selectorTopicsDetail);
    const [showQuestions, setShowQuestions] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [passMark, setPassMark] = useState('');
    const [attemptsAllowed, setAttemptsAllowed] = useState('');
    const [error, setError] = useState('');
    const [errorduration, setErrorDuration] = useState('');
    const [errormark, setErrormark] = useState('');
    const [errorattempts, setErrorAttempt] = useState('');
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showQuizEditModal, setShowQuizEditModal] = useState(false);
    const [showQuizDeleteModal, setShowQuizDeleteModal] = useState(false);
    const [inputQuizTitle, setInputQuizTitle] = useState('');
    const [errordeletequiz, setErrorDeleteQuiz] = useState('');
    const [formComplete, setFormComplete] = useState(false);
    const [editErrors, setEditErrors] = useState({
        nameOfQuiz: '',
        duration: '',
        passMark: '',
        attemptsAllowed: ''
      });
    const [quizDetails, setQuizDetails] = useState({
        topicId: topicId,
        nameOfQuiz: '',
        duration: '',
        passMark: '',
        attemptsAllowed: ''
    });
    const [quizData, setQuizData] = useState({
        topicId: topicId,
        courseId: 'course',
        nameOfQuiz: '',
        duration: '',
        passMark: '',
        attemptsAllowed: ''
    });

    const [currentTopic, setCurrentTopic] = useState(null);

    console.log("courseId:", courseId);

    const [isQuizEditable, setIsQuizEditable] = useState(!quizId);

    console.log("create page Id: ", quizId, topicId);

    useEffect(() => {
        dispatch(fetchTopicsRequest(courseId));
    }, [dispatch, courseId]);

    useEffect(() => {
        fetchQuizData(quizId);
    }, []);

    useEffect(() => {
        if (selectorTopicsDetail?.topics) {
            const topic = selectorTopicsDetail.topics.find(topic => topic.topicId === topicId);
            setCurrentTopic(topic);
        }
        // Find the correct topic
    }, [selectorTopicsDetail, topicId]);

    const validateEditFields = () => {
        let isValid = true;
        const newErrors = {...editErrors};
    
        if (!quizData.nameOfQuiz.trim()) {
          newErrors.nameOfQuiz = 'Quiz title is required';
          isValid = false;
        } else {
          newErrors.nameOfQuiz = '';
        }
    
        if (!quizData.duration) {
          newErrors.duration = 'Duration is required';
          isValid = false;
        } else {
          newErrors.duration = '';
        }
    
        if (!quizData.passMark) {
          newErrors.passMark = 'Grade to be secured is required';
          isValid = false;
        } else {
          newErrors.passMark = '';
        }
    
        if (!quizData.attemptsAllowed) {
          newErrors.attemptsAllowed = 'Attempts allowed is required';
          isValid = false;
        } else {
          newErrors.attemptsAllowed = '';
        }
    
        setEditErrors(newErrors);
        return isValid;
      };


    const handleUploadClick = async (e) => {
        e.preventDefault();
        console.log("quiz details:", quizDetails);
        // dispatch(setQuizDetailsRequest(quizDetails));
        await CreateQuizApi(quizDetails)
        navigate('/upload');
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleQuizTitleChange = (e) => {
        ValidationQuizTitle(e.target.value, setError, setQuizTitle);
        handleQuizChange(e);
    };

    const handleInputChange = (e) => {
        ValidationDuration(e.target.value, setDuration, setErrorDuration);
        handleQuizChange(e);
    };

    const handlemarkChange = (e) => {
        ValidationGrade(e.target.value, setPassMark, setErrormark);
        handleQuizChange(e);
    };

    const handleattemptsChange = (e) => {
        ValidationAttempts(e.target.value, setAttemptsAllowed, setErrorAttempt);
        handleQuizChange(e);
    };

    const handleOpenAddQuestionModal = () => {
        setShowAddQuestionModal(true);
    };

    const handleCloseQuizEditModal = () => {
        setShowQuizEditModal(false);
    }

    const handleCloseQuizDeleteModal = () => {
        setShowQuizDeleteModal(false);
    }

    const handleOpenQuizEditModal = () => {
        setShowQuizEditModal(true);
    }

    const handleOpenQuizDeleteModal = () => {
        setShowQuizDeleteModal(true);
    }

    const handleQuizChange = (e) => {
        const updatedQuizDetails = { ...quizDetails, [e.target.name]: e.target.value };
        setQuizDetails(prevDetails => ({
            ...prevDetails,
            [e.target.name]: e.target.value
        }));
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
        setFormComplete(isFormComplete(updatedQuizDetails));
    };

    const isFormComplete = (details) => {
        return (
            details.nameOfQuiz.trim() !== '' &&
            Number(details.duration) > 0 &&
            Number(details.passMark) > 0 &&
            Number(details.attemptsAllowed) > 0
        );
    };

    const handleDurationChange = (e) => {
        setDuration('SET_DURATION', e.target.value);
    };

    const handleGradeChange = (e) => {
        setPassMark('SET_PASSMARK', e.target.value);
    };

    const fetchQuizData = async (quizId) => {
        try {
            const data = await GetQuizDetails(quizId);
            sessionStorage.setItem('quizName', data.nameOfQuiz);
            setQuizData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleUpdateQuiz = () => {
        if (validateEditFields()) {
          const updatedQuizData = {
            quizId: quizId,
            nameOfQuiz: quizData.nameOfQuiz,
            duration: parseInt(quizData.duration),
            attemptsAllowed: parseInt(quizData.attemptsAllowed),
            passMark: parseInt(quizData.passMark)
          };
          console.log("update", updatedQuizData);
          dispatch(editQuizDetailsRequest(updatedQuizData));
          handleCloseQuizEditModal();
          const Toast = Swal.mixin({
            className: "swal2-toast",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2000,
            background: 'green',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Quiz Updated Successfully",
            color: 'white'
          });
        }
      };

    const handleDeleteQuiz = (quizId) => {
        setShowQuestions(false);
        console.log('Entered Title:', inputQuizTitle);
        console.log('Actual Quiz Title:', quizData.nameOfQuiz);

        if (inputQuizTitle === quizData.nameOfQuiz) {
            DeleteQuizDetails(quizId);
            const Toast = Swal.mixin({
                className: "swal2-toast",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                background: 'green',
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Quiz deleted successfully",
                color: 'white'
            });
            // alert('Quiz deleted successfully');
            handleCloseQuizDeleteModal();
            setTimeout(() => {
                navigate(`/coursecontent/${courseId}`)
            }, 2000);
            dispatch(fetchQuizIdFailure(topicId))
        } else {
            setErrorDeleteQuiz('The QuizTitle you entered does not match !');
        }
    };

    const handleQuizTitle = (event) => {
        setInputQuizTitle(event.target.value);
    };



    const handleNavigate = () => {
        sessionStorage.removeItem("quizId");
        sessionStorage.removeItem("topicId");
        navigate(`/coursecontent/${courseId}`)
        dispatch(fetchQuizIdFailure(topicId))
    }

    const handleQuizFeedback = () => {
        navigate(`/quizfeedback`)
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };
    
      const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      };

    return (
        <Container fluid className="create-quiz-container bg-light py-5">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <Row className="justify-content-end mb-4">
            <Col xs="auto">
              <Button variant="secondary" onClick={handleNavigate}>
                Back
              </Button>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <MotionCard className="mb-4 shadow-sm" variants={fadeInUp}>
                <Card.Header as="h5" className="bg-primary text-white">Course Details</Card.Header>
                <Card.Body>
                  <Form style={{fontSize:12}}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course:</Form.Label>
                      <Form.Control type="text" value={selectorTopicsDetail?.courseTitle} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Topic:</Form.Label>
                      <Form.Control type="text" value={currentTopic?.topicName} readOnly />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </MotionCard>
              
              <MotionCard className="mb-4 shadow-sm" variants={fadeInUp}>
                <Card.Header as="h5" className="bg-info text-white">On this page, you can:</Card.Header>
                <Card.Body>
                  <ul className="list-unstyled" style={{fontSize:12}}>
                    <li>✓ View and manage the entire quiz</li>
                    <li>✓ Navigate to quiz feedback or proceed to review questions</li>
                    <li>✓ View and manage the quiz questions</li>
                    <li>✓ Use search or filter options to view questions</li>
                    <li>✓ Use the "Proceed" button at the bottom to move to the next step</li>
                  </ul>
                </Card.Body>
              </MotionCard>
            </Col>
            
            <Col md={6}>
              <MotionCard className="shadow-sm" variants={fadeInUp}>
                <Card.Header as="h5" className="bg-success text-white d-flex justify-content-between align-items-center">
                  Quiz Details
                  <div>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit quiz</Tooltip>}>
                      <IconButton onClick={handleOpenQuizEditModal} size="small">
                        <EditIcon style={{ color: "white" }} />
                      </IconButton>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete quiz</Tooltip>}>
                      <IconButton onClick={handleOpenQuizDeleteModal} size="small">
                        <DeleteIcon style={{ color: "white" }} />
                      </IconButton>
                    </OverlayTrigger>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Quiz Title<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="nameOfQuiz"
                        value={quizData.nameOfQuiz}
                        readOnly={!isQuizEditable}
                        onChange={handleQuizTitleChange}
                        isInvalid={!!error}
                      />
                      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Duration<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={quizData.duration}
                        readOnly={!isQuizEditable}
                        onChange={handleInputChange}
                        isInvalid={!!errorduration}
                      />
                      <Form.Control.Feedback type="invalid">{errorduration}</Form.Control.Feedback>
                    </Form.Group>
  
                    <Form.Group className="mb-3">
                      <Form.Label>Grade to be secured<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="passMark"
                        value={quizData.passMark}
                        readOnly={!isQuizEditable}
                        onChange={handlemarkChange}
                        isInvalid={!!errormark}
                      />
                      <Form.Control.Feedback type="invalid">{errormark}</Form.Control.Feedback>
                    </Form.Group>
  
                    <Form.Group className="mb-3">
                      <Form.Label>Attempts Allowed<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="attemptsAllowed"
                        value={quizData.attemptsAllowed}
                        readOnly={!isQuizEditable}
                        onChange={handleattemptsChange}
                        isInvalid={!!errorattempts}
                      />
                      <Form.Control.Feedback type="invalid">{errorattempts}</Form.Control.Feedback>
                    </Form.Group>
  
                    {!quizId && (
                      <div className="text-center mt-4">
                        <Button
                          type="submit"
                          variant="primary"
                          onClick={handleUploadClick}
                          disabled={!formComplete}
                        >
                          <FaUpload className="me-2" /> Add Question
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </MotionCard>
            </Col>
          </Row>
  
          {showQuestions && quizId && (
            <MotionCard className="mt-4 shadow-sm" variants={fadeInUp}>
              <Card.Header as="h5" className="bg-warning">Question Preview</Card.Header>
              <Card.Body >
                <QuestionTemplateView />
              </Card.Body>
            </MotionCard>
          )}
  
          {/* Delete Quiz Modal */}
          <MuiModal
            open={showQuizDeleteModal}
            onClose={handleCloseQuizDeleteModal}
            aria-labelledby="delete-quiz-modal-title"
          >
            <Box sx={modalStyle}>
              <Typography id="delete-quiz-modal-title" variant="h6" component="h2" gutterBottom>
                Delete Quiz
              </Typography>
              <Typography variant="body1" gutterBottom>
                All the quiz related data will be removed permanently. <br />
                To confirm deletion, please type the quiz title:
                <br />
                <strong>"{quizData.nameOfQuiz}"</strong>
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Enter the Quiz Title"
                onChange={handleQuizTitle}
                error={!!errordeletequiz}
                helperText={errordeletequiz}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={handleCloseQuizDeleteModal} className="me-2">
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteQuiz(quizId)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </MuiModal>
  
          {/* Edit Quiz Modal */}
          <MuiModal
      open={showQuizEditModal}
      onClose={handleCloseQuizEditModal}
      aria-labelledby="edit-quiz-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography id="edit-quiz-modal-title" variant="h6" component="h2" gutterBottom>
          Edit Quiz
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Quiz Title"
          variant="outlined"
          name="nameOfQuiz"
          value={quizData.nameOfQuiz}
          onChange={(e) => { handleQuizTitleChange(e); handleQuizChange(e) }}
          error={!!editErrors.nameOfQuiz}
          helperText={editErrors.nameOfQuiz}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Duration (minutes)"
          variant="outlined"
          type="number"
          name="duration"
          value={quizData.duration}
          onChange={(e) => { handleDurationChange(e); handleQuizChange(e); handleInputChange(e) }}
          error={!!editErrors.duration}
          helperText={editErrors.duration}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Grade to be Secured"
          variant="outlined"
          type="number"
          name="passMark"
          value={quizData.passMark}
          onChange={(e) => { handleGradeChange(e); handleQuizChange(e); handlemarkChange(e) }}
          error={!!editErrors.passMark}
          helperText={editErrors.passMark}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Attempts Allowed"
          variant="outlined"
          type="number"
          name="attemptsAllowed"
          value={quizData.attemptsAllowed}
          onChange={(e) => { handleQuizChange(e); handleattemptsChange(e) }}
          error={!!editErrors.attemptsAllowed}
          helperText={editErrors.attemptsAllowed}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={handleCloseQuizEditModal} className="me-2">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateQuiz}
          >
            Update
          </Button>
        </Box>
      </Box>
    </MuiModal>
        </motion.div>
      </Container>
    );
};

export default Home;