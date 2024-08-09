import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaPlus, FaFileExcel, FaInfoCircle, FaTrash } from "react-icons/fa";
import { Button, Container, Row, Col } from 'react-bootstrap';
import Swal from "sweetalert2";
import { Modal as MuiModal, Box, Typography, TextField, Button as MuiButton, List, ListItem, ListItemText, AppBar, Toolbar, Paper, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { fetchQuizIdRequest } from "../../../../actions/Quiz And Feedback Module/Admin/FetchQuizIdAction";
import { BulkUploadQuestion, PostSingleQuestion } from '../../../../middleware/Quiz And Feedback Module/Admin/QuestionApi';
import Exceltemplate from "../../../../assets/Quiz And Feedback Module/ExcelTemplate/Bulk upload format.xlsx";
import { FormHelperText } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { IconButton, Stack, Tooltip } from '@mui/material';

const PageWrapper = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const ContentContainer = styled(Box)`
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Section = styled(Paper)`
  flex: 1;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
  display: flex;
  flex-direction: column;
`;

// const Card = styled(Paper)`
//   padding: 2rem;
//   border-radius: 15px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//   background: white;
//   flex: 1;
// `;

const DropZone = styled(motion.div)`
  border: 3px dashed #3f51b5;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f0f4f8;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #e8eaf6;
  }
`;

// const StyledCard = styled(Card)`
//   padding: 2rem;
//   border-radius: 15px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//   background: white;
// `;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;

const FileList = styled(List)`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const FileItem = styled(ListItem)`
  background-color: #e8eaf6;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

const StyledAppBar = styled(AppBar)`
  position: static;
  background-color: #3f51b5;
  margin-bottom: 1rem;
`;

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background-color: white;
  box-shadow: 24px 24px 48px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
`;

const FixedHeader = styled(AppBar)`
  position: sticky;
  top: 0;
  background-color: #3f51b5;
`;

const UploadBulkQuiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const inputRef = useRef();
  const topicId = sessionStorage.getItem("topicId");
  const quizId = useSelector((state) => state.quizId.quizId);
  const allowedFileTypes = [".xlsx"];
  const [errors, setErrors] = useState({
    question: "",
    questionType: "",
    options: [],
    correctOptions: [],
  });
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [numCorrectOptions, setNumCorrectOptions] = useState(2);
  const [numOptions, setNumOptions] = useState(5);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [addedQuestions, setAddedQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    questionType: "",
    options: ["", "", "", "", "", "", "", ""],
    correctOptions: ["", "", ""],
  });

  const isAddQuestionDisabled = files.length > 0;

  useEffect(() => {
    dispatch(fetchQuizIdRequest(topicId));
  }, [dispatch, topicId]);

  const handleFileChange = (event) => {
    event.preventDefault();
    console.log("file", event.target.files);
    const newFiles = Array.from(event.target.files);

    validateFiles(newFiles);
    event.target.value = null;
  };

  const validateQuestion = () => {
    let tempErrors = {
      question: "",
      questionType: "",
      options: [],
      correctOptions: [],
    };
    let isValid = true;

    if (!newQuestion.question.trim()) {
      tempErrors.question = "Question is required";
      isValid = false;
    } else if (newQuestion.question.length > 500) {
      tempErrors.question = "Question should not exceed 500 characters";
      isValid = false;
    }

    if (!newQuestion.questionType) {
      tempErrors.questionType = "Question type is required";
      isValid = false;
    }

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
    return isValid;
  };

  const validateFiles = (newFiles) => {
    const invalidFiles = newFiles.filter(
      (file) => !allowedFileTypes.some((type) => file.name.endsWith(type))
    );

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: `Please select only .xlsx files. Invalid files: ${invalidFiles.map(f => f.name).join(", ")}`,
      });
    } else {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    validateFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileUpload = async () => {
    try {
      console.log("sent file", files, quizId);
      await BulkUploadQuestion(files, quizId);
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
        title: "Bulk Uploaded Successfully",
        color: 'white'
      });
      setTimeout(function () {
        navigate(`/createquiz`);
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'There was an error uploading the questions. Please try again.',
      });
    }
  };

  const handleOpenAddQuestionModal = () => {
    setShowAddQuestionModal(true);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
    // Reset errors when changing question type
    setErrors({
      question: "",
      questionType: "",
      options: [],
      correctOptions: [],
    });
  };


  const handleSaveQuestion = async () => {
    if (!validateQuestion()) {
      return;
    }

    const newQuestionData = {
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
      await PostSingleQuestion(newQuestionData);
      setAddedQuestions(prevQuestions => [...prevQuestions, newQuestionData]);
      Swal.fire({
        icon: 'success',
        title: 'Question Added',
        text: 'The question has been successfully added.',
        timer: 2000,
        showConfirmButton: false,
      });
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the question. Please try again.',
      });
    }
  };

  const handleFinish = () => {
    navigate('/createquiz');
  };

  const resetForm = () => {
    setNewQuestion({
      question: "",
      questionType: "",
      options: Array(8).fill(""),
      correctOptions: Array(3).fill("")
    });
    setSelectedQuestionType("");
    setNumOptions(5);
    setNumCorrectOptions(2);
    setErrors({});
  };

  const handleCloseAddQuestionModal = () => {
    setShowAddQuestionModal(false);
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

  return (

    <PageWrapper>
      <Box display="flex" justifyContent="flex-end" mb={2} mt={3}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#365486", color: "white" }}
            onClick={() => navigate('/createquiz')}
          >
            Back
          </Button>
        </Box>
      <ContentContainer>
        
        <Section elevation={3}>
          <Typography variant="h4" gutterBottom>Upload Quiz Questions</Typography>
          <DropZone
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCloudUploadAlt size={50} color="#3f51b5" />
            <Typography variant="h6" mt={2}>Drag and Drop Files to Upload</Typography>
            <Typography variant="body1" mt={1}>or</Typography>
            <StyledButton
              variant="contained"
              color="primary"
              component="label"
              startIcon={<FaPlus />}
            >
              Browse Files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                hidden
                ref={inputRef}
              />
            </StyledButton>
          </DropZone>

          <AnimatePresence>
            {files.length > 0 && (
              <FileList>
                {files.map((file, index) => (
                  <FileItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => removeFile(index)}>
                        <FaTrash />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      primaryTypographyProps={{ variant: 'body1' }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </FileItem>
                ))}
              </FileList>
            )}
          </AnimatePresence>

          <Box mt={4} display="flex" justifyContent="space-between">
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleFileUpload}
              disabled={files.length === 0}
              startIcon={<FaCloudUploadAlt />}
            >
              Upload Files
            </StyledButton>
            <StyledButton
              variant="outlined"
              color="secondary"
              href={Exceltemplate}
              download="Bulk upload template"
              startIcon={<FaInfoCircle />}
            >
              Download Question Format
            </StyledButton>
          </Box>
        </Section>

        <Section elevation={3}>
          <FixedHeader position="static" style={{display:'flex'}}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Added Questions
              </Typography>
              <Button color="inherit" onClick={handleOpenAddQuestionModal} startIcon={<AddIcon />} style={{height:'50'}}>
                Add Question
              </Button>
              
            </Toolbar>
            
          </FixedHeader>

          <List>
            {addedQuestions.map((q, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Question ${index + 1}`}
                  secondary={q.question.substring(0, 50) + (q.question.length > 50 ? '...' : '')}
                />
                <Chip label={q.questionType} color="primary" variant="outlined" />
              </ListItem>
            ))}
          </List>

          {addedQuestions.length === 0 && (
            <Box textAlign="center" mt={4}>
              <Typography variant="body1" color="textSecondary">
                No questions added yet. Click "Add Question" to get started.
              </Typography>
            </Box>
          )}
        </Section>
      </ContentContainer>

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
            Add Individual Questions
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Total Questions Added: {addedQuestions.length}
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
            <List>
              {addedQuestions.map((q, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Question ${index + 1}`}
                    secondary={q.question.substring(0, 50) + (q.question.length > 50 ? '...' : '')}
                  />
                </ListItem>
              ))}
            </List>

            <FormControl fullWidth margin="normal" error={!!errors.questionType}>
              <InputLabel id="question-type-label">Question Type</InputLabel>
              <Select
                labelId="question-type-label"
                value={selectedQuestionType}
                onChange={handleQuestionTypeChange}
                label="Question Type">
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
                <FormControl fullWidth margin="normal" error={!!errors.correctOptions[0]}>
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
                  {errors.correctOptions[0] && <FormHelperText>{errors.correctOptions[0]}</FormHelperText>}
                </FormControl>
              </>
            )}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseAddQuestionModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            {selectedQuestionType && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveQuestion}
                sx={{ mr: 1 }}
              >
                Add Question
              </Button>
            )}
            {!selectedQuestionType && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFinish}
              >
                Finish
              </Button>
            )}
          </Box>
        </Box>
      </MuiModal>
    </PageWrapper>

  );
};

export default UploadBulkQuiz;