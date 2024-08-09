import React, { useState, useEffect, useRef } from 'react';
import BasicPagination from "../../../../components/Quiz And Feedback Module/QuizComponents/Admin/Pagination";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { IconButton, Tooltip } from '@mui/material';    // modification for  imports quizteam 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import {
  GetOpenEditQuestionModal,
  PostSingleQuestion,
  UpdateQuizQuestionsApi,
} from "../../../../middleware/Quiz And Feedback Module/Admin/QuestionApi";
import { deleteQuizQuestionRequest } from "../../../../actions/Quiz And Feedback Module/Admin/DeleteQuizQuestionAction";
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { FetchQuizQuestionsApi } from '../../../../middleware/Quiz And Feedback Module/Admin/FetchQuizQuestionsApi';
import "../../../../Styles/Quiz And Feedback Module/QuestionTemplate.css";
import { Modal as MuiModal, Box, Typography, TextField, Button as MuiButton } from '@mui/material';
import Swal from "sweetalert2";
import { FormHelperText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';


const QuestionTemplate = () => {
  const quizId = sessionStorage.getItem("quizId");
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async (quizId) => {
    try {
      const data = await FetchQuizQuestionsApi(quizId);
      setQuestions(data);
      const newFilteredQuestions = data.filter(
        (question) =>
          !selectedFilterQuestionType || question.questionType === selectedFilterQuestionType
      );
      setFilteredQuestions(newFilteredQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions(quizId);
  }, [quizId]);


  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    question: "",
    questionType: "",
    options: [],
    correctOptions: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const questionsPerPage = 6;
  const [numCorrectOptions, setNumCorrectOptions] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [numOptions, setNumOptions] = useState(5);
  const [selectedFilterQuestionType, setSelectedFilterQuestionType] = useState('')
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    questionType: "",
    options: ["", "", "", "", "", "", "", ""],
    correctOptions: ["", "", ""],
  });

  const [editedQuestion, setEditedQuestion] = useState({
    question: "",
    options: ["", "", "", "", "", "", "", ""],
    correctOptions: ["", "", ""],
  });

  const navigate = useNavigate();

  const handleDeleteQuestion = async (quizQuestionId) => {
    try {
      await dispatch(deleteQuizQuestionRequest(quizQuestionId));

      setQuestions(prevQuestions => {
        const updatedQuestions = prevQuestions.filter(question => question.quizQuestionId !== quizQuestionId);
        const newTotalPages = Math.ceil(updatedQuestions.length / questionsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        return updatedQuestions;
      });

      setFilteredQuestions(prevFilteredQuestions =>
        prevFilteredQuestions.filter(question => question.quizQuestionId !== quizQuestionId)
      );

      setDeleteQuestionId(null);

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
        title: "Question Deleted Successfully",
        color: 'white'
      });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  useEffect(() => {
    const newFilteredQuestions = questions?.filter(
      (question) =>
        !selectedFilterQuestionType || question.questionType === selectedFilterQuestionType
    );
    setFilteredQuestions(newFilteredQuestions);
    const newTotalPages = Math.ceil(newFilteredQuestions.length / questionsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1); // Set to 1 if newTotalPages is 0
    }
  }, [selectedFilterQuestionType, questions, questionsPerPage]);

  const searchFilteredQuestions = questions?.filter(
    (question) =>
      (question.question.toLowerCase().includes(searchTerm) ||
        (question.questionNo && question.questionNo.toString().includes(searchTerm))) &&
      (!selectedFilterQuestionType || question.questionType === selectedFilterQuestionType)
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = searchFilteredQuestions?.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleOpenEditQuestionModal = async (quizQuestionId) => {
    try {
      const response = await GetOpenEditQuestionModal(quizQuestionId);
      const questionData = response;
      setEditedQuestion({
        quizQuestionId: quizQuestionId,
        question: questionData.question,
        questionType: questionData.questionType,
        options: questionData.options.map((option) => option.option),
        correctOptions: questionData.options
          .filter((option) => option.isCorrect)
          .map((option) => option.option),
      });
      setShowEditQuestionModal(true);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  const handleOpenAddQuestionModal = () => {
    setShowAddQuestionModal(true);
  };
  const handleCloseEditQuestionModal = () => {
    setShowEditQuestionModal(false);
  };



  const handleChange = (index, field, value) => {
    if (field === "correctOptions") {
      setNewQuestion((prevState) => ({
        ...prevState,
        correctOptions: [
          ...prevState.correctOptions.slice(0, index),
          value,
          ...prevState.correctOptions.slice(index + 1),
        ],
      }));
    } else {
      setNewQuestion((prevState) => ({
        ...prevState,
        [field]:
          index === -1
            ? value
            : [
              ...prevState[field].slice(0, index),
              value,
              ...prevState[field].slice(index + 1),
            ],
      }));
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseAddQuestionModal = () => {
    setShowAddQuestionModal(false);
  };

  const handleQuestionTypeChange = (e) => {
    const value = e.target.value;
    setSelectedQuestionType(value);
    setNewQuestion((prevState) => ({
      ...prevState,
      questionType: value,
      options: value === "T/F" ? ["True", "False"] : ["", "", "", ""],
      correctOptions: [],
    }));
    setErrors({
      question: "",
      questionType: "",
      options: [],
      correctOptions: [],
    });
  };

  const validateUpdateQuestion = () => {
    console.log("Starting validation...");
    console.log("Current editedQuestion:", editedQuestion);

    let tempErrors = {
      question: "",
      questionType: "",
      options: [],
      correctOptions: [],
      individualOptions: [],
      individualCorrectOptions: [],
    };
    let isValid = true;

    // Question validation
    if (!editedQuestion.question.trim()) {
      console.log("Question is empty");
      tempErrors.question = "Question is required";
      isValid = false;
    } else if (editedQuestion.question.length > 500) {
      console.log("Question is too long");
      tempErrors.question = "Question should not exceed 500 characters";
      isValid = false;
    }

    // Question type validation
    if (!editedQuestion.questionType) {
      console.log("Question type is empty");
      tempErrors.questionType = "Question type is required";
      isValid = false;
    }

    // Options validation
    if (editedQuestion.questionType === "MCQ" || editedQuestion.questionType === "MSQ") {
      editedQuestion.options.forEach((option, index) => {
        if (!option.trim()) {
          console.log(`Option ${index + 1} is empty`);
          tempErrors.individualOptions[index] = "Option is required";
          isValid = false;
        } else if (option.length > 200) {
          console.log(`Option ${index + 1} is too long`);
          tempErrors.individualOptions[index] = "Option should not exceed 200 characters";
          isValid = false;
        }
      });

      const uniqueOptions = new Set(editedQuestion.options.filter(Boolean).map(opt => opt.trim()));
      if (uniqueOptions.size !== editedQuestion.options.filter(Boolean).length) {
        console.log("Duplicate options found");
        tempErrors.options.push("All options must be unique");
        isValid = false;
      }
    }

    // Correct options validation
    if (editedQuestion.questionType === "MCQ" || editedQuestion.questionType === "T/F") {
      if (!editedQuestion.correctOptions[0]) {
        console.log("Correct option is empty for MCQ or T/F");
        tempErrors.correctOptions[0] = "Correct option is required";
        isValid = false;
      }
    } else if (editedQuestion.questionType === "MSQ") {
      editedQuestion.correctOptions.forEach((correctOption, index) => {
        if (!correctOption) {
          console.log(`Correct option ${index + 1} is empty for MSQ`);
          tempErrors.individualCorrectOptions[index] = "This correct option field is required";
          isValid = false;
        } else if (!editedQuestion.options.includes(correctOption)) {
          console.log(`Correct option ${index + 1} is not a valid option`);
          tempErrors.individualCorrectOptions[index] = "Selected correct option is not a valid option";
          isValid = false;
        }
      });

      if (editedQuestion.correctOptions.filter(Boolean).length < 2) {
        console.log("Not enough correct options for MSQ");
        tempErrors.correctOptions[0] = "At least two correct options are required for MSQ";
        isValid = false;
      }

      const uniqueCorrectOptions = new Set(editedQuestion.correctOptions.filter(Boolean));
      if (uniqueCorrectOptions.size !== editedQuestion.correctOptions.filter(Boolean).length) {
        console.log("Duplicate correct options found");
        tempErrors.correctOptions.push("All correct options must be unique");
        isValid = false;
      }
    }

    console.log("Validation errors:", tempErrors);
    console.log("Is valid:", isValid);

    setErrors(tempErrors);
    return isValid;
  };

  const handleUpdateQuestion = async () => {
    console.log("Starting update process");
    console.log("Edited question:", editedQuestion);

    const { quizQuestionId, questionType, ...updatedQuestion } = editedQuestion;
    const updatedOptions = updatedQuestion.options.map((option, index) => ({
      option,
      isCorrect: updatedQuestion.correctOptions.includes(option),
    }));

    const requestBody = {
      ...updatedQuestion,
      options: updatedOptions,
      questionType: questionType,
      quizId: quizId,
      quizQuestionId: quizQuestionId,
    };

    console.log("Request body:", requestBody);

    if (validateUpdateQuestion()) {
      try {
        const response = await UpdateQuizQuestionsApi(requestBody);
        console.log("API response:", response);

        setQuestions(prevQuestions => {
          const newQuestions = prevQuestions.map(q =>
            q.quizQuestionId === quizQuestionId ? { ...q, ...requestBody } : q
          );
          console.log("Updated questions:", newQuestions);
          return newQuestions;
        });

        handleCloseEditQuestionModal();
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
  };

  const validateField = (fieldName, value, index = null) => {
    let tempErrors = { ...errors };
    switch (fieldName) {
      case "question":
        tempErrors.question = value ? "" : "Question is required";
        break;
      case "options":
        if (index !== null) {
          if (!tempErrors.individualOptions) {
            tempErrors.individualOptions = [];
          }
          tempErrors.individualOptions[index] = value
            ? ""
            : `Option ${index + 1} is required`;
        }
        tempErrors.options = editedQuestion.options.some((option) => option)
          ? ""
          : "option is required";
        break;
      case "correctOptions":
        if (index !== null) {
          if (!tempErrors.individualCorrectOptions) {
            tempErrors.individualCorrectOptions = [];
          }
          tempErrors.individualCorrectOptions[index] = value
            ? ""
            : `Correct Option ${index + 1} is required`;
        }
        tempErrors.correctOptions = editedQuestion.correctOptions.some(
          (option) => option
        )
          ? ""
          : "correct option is required";
        break;
      default:
        break;
    }

    setErrors(tempErrors);
  };
  useEffect(() => {
    const newFilteredQuestions = questions?.filter(
      (question) =>
        !selectedFilterQuestionType || question.questionType === selectedFilterQuestionType
    );
    setFilteredQuestions(newFilteredQuestions);
  }, [selectedFilterQuestionType, questions]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleAddCorrectOption = () => {
    if (numCorrectOptions < 3) {
      setNumCorrectOptions(numCorrectOptions + 1);
      setNewQuestion((prevState) => ({
        ...prevState,
        correctOptions: [...prevState.correctOptions, ""],
      }));
    }
  };

  const handleRemoveCorrectOption = (index) => {
    if (numCorrectOptions > 1) {
      setNumCorrectOptions(numCorrectOptions - 1);
      const updatedCorrectOptions = [...newQuestion.correctOptions];
      updatedCorrectOptions.splice(index, 1);
      setNewQuestion((prevState) => ({
        ...prevState,
        correctOptions: updatedCorrectOptions,
      }));
    }
  };

  const handleAddOption = () => {
    if (numOptions < 8) {
      setNumOptions(numOptions + 1);
      setNewQuestion((prevState) => ({
        ...prevState,
        options: [...prevState.options, ""],
      }));
    }
  };

  const handleRemoveOption = (index) => {
    if (numOptions > 5) {
      setNumOptions(numOptions - 1);
      const updatedOptions = [...newQuestion.options];
      updatedOptions.splice(index, 1);
      setNewQuestion((prevState) => ({
        ...prevState,
        options: updatedOptions,
      }));
    }
  };


  const handleSaveQuestion = async () => {
    let tempErrors = {
      question: "",
      questionType: "",
      options: [],
      correctOptions: [],
    };
    let isValid = true;

    // Question validation
    if (!newQuestion.question.trim()) {
      tempErrors.question = "Question is required";
      isValid = false;
    } else if (newQuestion.question.length > 500) {
      tempErrors.question = "Question should not exceed 500 characters";
      isValid = false;
    }

    // Question type validation
    if (!newQuestion.questionType) {
      tempErrors.questionType = "Question type is required";
      isValid = false;
    }

    // Options validation
    if (newQuestion.questionType === "MCQ" || newQuestion.questionType === "MSQ") {
      newQuestion.options.forEach((option, index) => {
        if (!option.trim()) {
          tempErrors.options[index] = "Option is required";
          isValid = false;
        } else if (option.length > 200) {
          tempErrors.options[index] = "Option should not exceed 200 characters";
          isValid = false;
        }
      });

      const uniqueOptions = new Set(newQuestion.options.filter(Boolean).map(opt => opt.trim()));
      if (uniqueOptions.size !== newQuestion.options.filter(Boolean).length) {
        tempErrors.options.push("All options must be unique");
        isValid = false;
      }
    }

    // Correct options validation
    if (newQuestion.questionType === "MCQ" || newQuestion.questionType === "T/F") {
      if (!newQuestion.correctOptions[0]) {
        tempErrors.correctOptions[0] = "Correct option is required";
        isValid = false;
      }
    } else if (newQuestion.questionType === "MSQ") {
      newQuestion.correctOptions.forEach((correctOption, index) => {
        if (!correctOption) {
          tempErrors.correctOptions[index] = "This correct option field is required";
          isValid = false;
        } else if (!newQuestion.options.includes(correctOption)) {
          tempErrors.correctOptions[index] = "Selected correct option is not a valid option";
          isValid = false;
        }
      });

      if (newQuestion.correctOptions.filter(Boolean).length < 3) {
        tempErrors.correctOptions[0] = "At least three correct options are required for MSQ";
        isValid = false;
      }

      const uniqueCorrectOptions = new Set(newQuestion.correctOptions.filter(Boolean));
      if (uniqueCorrectOptions.size !== newQuestion.correctOptions.filter(Boolean).length) {
        tempErrors.correctOptions.push("All correct options must be unique");
        isValid = false;
      }
    }

    setErrors(tempErrors);

    if (isValid) {
      const requestBody = {
        quizId: quizId,
        question: newQuestion.question,
        questionType: newQuestion.questionType,
        options: newQuestion.options.map((option, index) => ({
          option: option,
          isCorrect:
            newQuestion.questionType === "MCQ" || newQuestion.questionType === "T/F"
              ? newQuestion.correctOptions[0] === option
              : newQuestion.correctOptions.includes(option),
        })),
      };

      try {
        await PostSingleQuestion(requestBody);
        await fetchQuestions(quizId);
        setNewQuestion({
          question: "",
          questionType: "",
          options: ["", "", "", "", "", "", "", ""],
          correctOptions: ["", "", ""]
        });

        handleCloseAddQuestionModal();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'Question added successfully'
        });

      } catch (error) {
        console.error("Error adding question:", error);
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while adding the question!',
        });
      }
    }

  };

  const handleSubmit = () => {
    try {
      navigate(`/reviewquestions`)

    } catch (error) {
      console.error('Error fetching data:', error)
    }

  };

  const handleQuizFeedback = () => {
    navigate(`/quizfeedback`)
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '90vh', // Set a maximum height
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: 'auto', // Enable scrolling
  };



  return (
    <Container >
      <div className='question-template-container'>
        <div className="question-card-footer d-block">
          {questions ? <div><div className='mb-3'>
            <button
              onClick={handleOpenAddQuestionModal}
              className="btn btn-light"
              style={{ color: "white", backgroundColor: "#365486" }}
            >
              Add Individual Question
            </button>
          </div>
            <div>
              <button
                onClick={() => { navigate('/upload') }}
                className="btn btn-light mb-2"
                style={{ color: "white", backgroundColor: "#365486" }}
              >
                Add Bulk Question
              </button>
            </div>
          </div> : <div>
            <button
              onClick={() => { navigate('/upload') }}
              className="btn btn-light mb-2"
              style={{ color: "white", backgroundColor: "#365486" }}
            >
              Add Questions
            </button>
          </div>}


        </div>
        {questions?.length > 0 && (
          <>
            <div className="" style={{ marginBottom: '-200px' }}>
              <div className=" " id="filter">
                <Box sx={{ width: 190 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="questionType"
                      value={selectedFilterQuestionType}
                      label="Question Type"
                      onChange={(e) => setSelectedFilterQuestionType(e.target.value)}
                    >
                      <MenuItem value={""}>All</MenuItem>
                      <MenuItem value={"MCQ"}>MCQ</MenuItem>
                      <MenuItem value={"MSQ"}>MSQ</MenuItem>
                      <MenuItem value={"T/F"}>True/False</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>


              <div style={{ textAlign: 'center' }} >
                <input
                  id="search"
                  type="search"
                  placeholder="Search..."
                  className="search-box"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </>
        )}

        <div className="question-template">
          {error && <p>Error: {error}</p>}
          {currentQuestions?.length > 0 ? (
            <>
              <h5>Uploaded Questions</h5>
              <div style={{ gridColumn: "1 / -1", justifySelf: "end" }}>
                <BasicPagination
                  totalQuestions={filteredQuestions?.length}
                  questionsPerPage={questionsPerPage}
                  page={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
              {currentQuestions.map((question, index) => (
                <div key={index} className="question-card">
                  <div className="question-card-header">
                    <div className="question-type">
                      <span className="badge bg-primary">{question.questionType}</span>
                    </div>
                    <div className="question-actions">
                      <Tooltip title="Edit Question">
                        <IconButton
                          aria-label="Edit question"
                          onClick={() => handleOpenEditQuestionModal(question.quizQuestionId)}
                        >
                          <EditIcon style={{ color: "#4a90e2" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Question">
                        <IconButton aria-label="Delete question" onClick={() => setDeleteQuestionId(question.quizQuestionId)}>
                          <DeleteIcon style={{ color: "#e74c3c" }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                    {deleteQuestionId === question.quizQuestionId && (
                      <div id="popupQuizQuestionDelete">
                        <div id="popup-contentQuizQuestionDelete">
                          <button id="popup-close-buttonQuizQuestionDelete" onClick={() => setDeleteQuestionId(null)}>×</button>
                          <p id='QuizQuestionDelete' style={{ marginTop: "5%" }}>Are you sure you want to delete the feedback?</p>
                          <button onClick={() => handleDeleteQuestion(question.quizQuestionId)} id='delete-btn'>Delete</button>
                          <button onClick={() => setDeleteQuestionId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="question-card-body">
                    <p className="quiz-question-number">Question {question.questionNo}</p>
                    <p className="question-text">{question.question}</p>
                    <div className="options-container">
                      <h6 className="options-title">Options:</h6>
                      <ul className="options-list">
                        {question.options.map((option, optionIndex) => (
                          <li
                            key={optionIndex}
                            className={`option-item ${option.isCorrect ? 'correct-option' : ''}`}
                          >
                            {option.option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>No questions</p>
          )}
        </div>
        {questions?.length > 0 && (

          <div className="d-flex justify-content-end mb-2" style={{ marginTop: 30 }}>
            <Button variant="primary" onClick={handleQuizFeedback} style={{ height: '50px', marginRight: 10 }}>
              Quiz Feedback
            </Button>
            <button onClick={handleSubmit} className="btn btn-light" style={{ color: "white", backgroundColor: "#365486" }}>Proceed to review</button>

          </div>


        )}

        <MuiModal
          open={showAddQuestionModal}
          onClose={handleCloseAddQuestionModal}
          aria-labelledby="add-question-modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography id="add-question-modal-title" variant="h6" component="h2" gutterBottom>
              Add New Question
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
              <FormControl fullWidth margin="normal" error={!!errors.questionType}>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  value={selectedQuestionType}
                  onChange={handleQuestionTypeChange}
                  label="Question Type"
                >
                  <MenuItem value="">Select Question Type</MenuItem>
                  <MenuItem value="MSQ">Multiple Select Question (MSQ)</MenuItem>
                  <MenuItem value="MCQ">Multiple Choice Question (MCQ)</MenuItem>
                  <MenuItem value="T/F">True/False (T/F)</MenuItem>
                </Select>
                {errors.questionType && <FormHelperText>{errors.questionType}</FormHelperText>}
              </FormControl>

              {selectedQuestionType && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Question"
                  variant="outlined"
                  value={newQuestion.question}
                  onChange={(e) => handleChange(-1, "question", e.target.value)}
                  error={!!errors.question}
                  helperText={errors.question}
                />
              )}

              {selectedQuestionType === "MSQ" && (
                <>
                  {[...Array(numOptions)].map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label={`Option ${index + 1}`}
                        variant="outlined"
                        value={newQuestion.options[index] || ""}
                        onChange={(e) => handleChange(index, "options", e.target.value)}
                        error={errors.options && !!errors.options[index]}
                        helperText={errors.options && errors.options[index]}
                      />
                      {index >= 5 && (
                        <IconButton
                          onClick={() => handleRemoveOption(index)}
                          sx={{ ml: 1, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    className='btn-primary'
                    startIcon={<AddIcon />}
                    onClick={handleAddOption}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Add Option
                  </Button>

                  {[...Array(numCorrectOptions)].map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FormControl fullWidth margin="normal" error={errors.correctOptions && !!errors.correctOptions[index]}>
                        <InputLabel id={`correct-option-${index}-label`}>Correct Option {index + 1}</InputLabel>
                        <Select
                          labelId={`correct-option-${index}-label`}
                          value={newQuestion.correctOptions[index] || ""}
                          onChange={(e) => handleChange(index, "correctOptions", e.target.value)}
                          label={`Correct Option ${index + 1}`}
                        >
                          <MenuItem value="">Select Correct Option</MenuItem>
                          {newQuestion.options.filter(Boolean).map((option, optionIndex) => (
                            <MenuItem key={optionIndex} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                        {errors.correctOptions && errors.correctOptions[index] && <FormHelperText>{errors.correctOptions[index]}</FormHelperText>}
                      </FormControl>
                      {index >= 1 && (
                        <IconButton
                          onClick={() => handleRemoveCorrectOption(index)}
                          sx={{ ml: 1, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    className='btn-primary'
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCorrectOption}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Add Correct Option
                  </Button>
                </>
              )}

              {selectedQuestionType === "MCQ" && (
                <>
                  {[...Array(4)].map((_, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      margin="normal"
                      label={`Option ${index + 1}`}
                      variant="outlined"
                      value={newQuestion.options[index] || ""}
                      onChange={(e) => handleChange(index, "options", e.target.value)}
                      error={errors.options && !!errors.options[index]}
                      helperText={errors.options && errors.options[index]}
                    />
                  ))}
                  <FormControl fullWidth margin="normal" error={errors.correctOptions && !!errors.correctOptions[0]}>
                    <InputLabel id="mcq-correct-option-label">Correct Option</InputLabel>
                    <Select
                      labelId="mcq-correct-option-label"
                      value={newQuestion.correctOptions[0] || ""}
                      onChange={(e) => handleChange(0, "correctOptions", e.target.value)}
                      label="Correct Option"
                    >
                      <MenuItem value="">Select Correct Option</MenuItem>
                      {newQuestion.options.filter(Boolean).map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                    {errors.correctOptions && errors.correctOptions[0] && <FormHelperText>{errors.correctOptions[0]}</FormHelperText>}
                  </FormControl>
                </>
              )}

              {selectedQuestionType === "T/F" && (
                <>
                  {[...Array(2)].map((_, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      margin="normal"
                      label={`Option ${index + 1}`}
                      variant="outlined"
                      value={newQuestion.options[index] || ""}
                      onChange={(e) => handleChange(index, "options", e.target.value)}
                      error={errors.options && !!errors.options[index]}
                      helperText={errors.options && errors.options[index]}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  ))}
                  <FormControl fullWidth margin="normal" error={errors.correctOptions && !!errors.correctOptions[0]}>
                    <InputLabel id="tf-correct-option-label">Correct Option</InputLabel>
                    <Select
                      labelId="tf-correct-option-label"
                      value={newQuestion.correctOptions[0] || ""}
                      onChange={(e) => handleChange(0, "correctOptions", e.target.value)}
                      label="Correct Option"
                    >
                      <MenuItem value="">Select Correct Option</MenuItem>
                      {newQuestion.options.filter(Boolean).map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                    {errors.correctOptions && errors.correctOptions[0] && <FormHelperText>{errors.correctOptions[0]}</FormHelperText>}                  </FormControl>
                </>
              )}
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseAddQuestionModal} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveQuestion}
              >
                Save
              </Button>
            </Box>
          </Box>
        </MuiModal>
        <MuiModal
          open={showEditQuestionModal}
          onClose={handleCloseEditQuestionModal}
          aria-labelledby="edit-question-modal-title"
        >
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography id="edit-question-modal-title" variant="h6" component="h2" gutterBottom>
                Edit Question
              </Typography>
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Question"
                  variant="outlined"
                  value={editedQuestion.question}
                  onChange={(e) => {
                    setEditedQuestion({
                      ...editedQuestion,
                      question: e.target.value,
                    });
                    validateField("question", e.target.value);
                  }}
                  error={!!errors.question}
                  helperText={errors.question}
                />
                {editedQuestion.questionType !== "T/F" && editedQuestion.options.map((option, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    margin="normal"
                    label={`Option ${index + 1}`}
                    variant="outlined"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...editedQuestion.options];
                      updatedOptions[index] = e.target.value;
                      setEditedQuestion({
                        ...editedQuestion,
                        options: updatedOptions,
                      });
                      validateField("options", e.target.value);
                    }}
                    error={!!errors.individualOptions && !!errors.individualOptions[index]}
                    helperText={errors.individualOptions && errors.individualOptions[index]}
                  />
                ))}
                {editedQuestion.questionType === "T/F" && editedQuestion.options.map((option, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    margin="normal"
                    label={`Option ${index + 1}`}
                    variant="outlined"
                    value={option}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                ))}
                {errors.options && (
                  <Typography color="error">{errors.options}</Typography>
                )}
                {editedQuestion.correctOptions.map((option, index) => (
                  <FormControl key={index} fullWidth margin="normal" error={!!errors.individualCorrectOptions && !!errors.individualCorrectOptions[index]}>
                    <InputLabel id={`correct-option-${index}-label`}>Correct Option {index + 1}</InputLabel>
                    <Select
                      labelId={`correct-option-${index}-label`}
                      value={option}
                      onChange={(e) => {
                        const updatedCorrectOptions = [...editedQuestion.correctOptions];
                        updatedCorrectOptions[index] = e.target.value;
                        setEditedQuestion({
                          ...editedQuestion,
                          correctOptions: updatedCorrectOptions,
                        });
                        validateField("correctOptions", e.target.value, index);
                      }}
                      label={`Correct Option ${index + 1}`}
                    >
                      <MenuItem value="">
                        <em>Select Correct Option</em>
                      </MenuItem>
                      {editedQuestion.options.map((opt, i) => (
                        <MenuItem key={i} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.individualCorrectOptions && errors.individualCorrectOptions[index] && (
                      <FormHelperText>{errors.individualCorrectOptions[index]}</FormHelperText>
                    )}
                  </FormControl>
                ))}
                {errors.correctOptions && (
                  <Typography color="error">{errors.correctOptions}</Typography>
                )}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <MuiButton onClick={handleCloseEditQuestionModal} sx={{ mr: 1 }}>
                  Cancel
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateQuestion}
                >
                  Save Changes
                </MuiButton>
              </Box>
            </Box>
          </Box>
        </MuiModal>
      </div>
    </Container>
  );
};

export default QuestionTemplate