import React from 'react'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "../../Styles/Learner/GetEnrollment.css";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getIndividualEnrollCourseRequest } from '../../actions/LearnerAction/FetchIndividualEnrolledCourseAction';
import { useParams } from 'react-router-dom';
//import Card from '@mui/material/Card';
//import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Row, Col, Container } from "react-bootstrap";
 
import { LogoDev } from "@mui/icons-material";
import { FaHandPointRight } from "react-icons/fa";
//-------------------------------
function CourseDescription() {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const course = useSelector((state) => state.fetchEnrolledIndividualCourse.individualcourse);
    console.log("course",course);
    const handleToggleDescription = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        dispatch(getIndividualEnrollCourseRequest(courseId));
    }, [courseId])
    console.log(course);
    return (
        <>
           
                <Card sx={{ display: 'flex', marginLeft: '100px', marginTop: '60px', marginRight: '100px', height: '280px', fontSize: '18px', boxShadow: '0px 4px 8px #23275c', }}>
                    <CardMedia
                        style={{ objectFit: 'cover', width: '40%' }}
                        component="img"
                        height="380"
 
                        image={course.thumbnailimage}
                        alt="Course-Thumbnail"
                    />
                    <CardContent sx={{ flex: 1}}>
                        <Typography gutterBottom variant="h4" component="div">
                            <b>{course.enrolledCoursename}</b>
 
 
                        </Typography>
 
                        <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                            <b>Category:</b> {course.enrolledcoursecategory}
                        </Typography>
                        <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                            <b>Level:</b> {course.enrolledcourselevels}
                        </Typography>
                        <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                            <b>Course Description: </b>
                            {course.enrolledcoursedescription ? (isExpanded ? course.enrolledcoursedescription  : `${course.enrolledcoursedescription .substring(0, 100)}...`) : 'No description available'}
                        </Typography>
                        {course.enrolledcoursedescription  && course.enrolledcoursedescription .length > 100 && (
                            <Button size="small" color="primary" onClick={handleToggleDescription}>
                                {isExpanded ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                        <br />
 
                    </CardContent>
                </Card>
           
        </>
 
    )
}
 
export default CourseDescription;