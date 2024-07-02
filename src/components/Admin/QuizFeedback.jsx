import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../Styles/Admin/Quizfeedback.css';
import { FetchQuizFeedbackReportRequest } from '../../actions/Admin/QuizFeedbackReportAction';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
export default function QuizFeedback() {
    const quizfeedbackreports = useSelector((state) => state.quizfeedbackreports.quizfeedbackreports);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(FetchQuizFeedbackReportRequest());
    }, []);
    const descriptivefeedbacks = quizfeedbackreports.filter(feedback => feedback.questionType === "DESCRIPTIVE");
    const ratingfeedbacks = quizfeedbackreports.filter(feedback => feedback.questionType === "MCQ");
    const ratings = Object.groupBy(ratingfeedbacks, ({ quizFeedbackQuestionId }) => quizFeedbackQuestionId);
    console.log("HI", ratings);
    return (
        <div id="quizfeedbackreport">
            <h1 style={{ textAlign: 'center' }}>Quiz Feedback Report</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Quiz Name </TableCell>
                            <TableCell>Question</TableCell>
                            <TableCell>Learner</TableCell>
                            <TableCell>Ratings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ratingfeedbacks.map((row) => (
                            <TableRow
                                key={row.quizFeedbackQuestionId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.quizName}
                                </TableCell>
                                <TableCell >{row.question}</TableCell>
                                <TableCell >{row.learnerName}</TableCell>
                                <TableCell >
                                    <Rating name="read-only" value={6 - row.optionText} readOnly />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};