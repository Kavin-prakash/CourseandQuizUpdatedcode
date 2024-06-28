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
    console.log("course", course);
    const handleToggleDescription = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        dispatch(getIndividualEnrollCourseRequest(courseId));
    }, [courseId])
    console.log(course);
    return (
        <>

            {/* <Card sx={{ display: 'flex', marginLeft: '100px', marginTop: '60px', marginRight: '100px', height: 'auto', fontSize: '18px', boxShadow: '0px 4px 8px #23275c', }}>
                <CardMedia
                    style={{ objectFit: 'cover', width: '40%' }}
                    component="img"
                    height="380"

                    image={course.thumbnailimage}
                    alt="Course-Thumbnail"
                />
                <CardContent sx={{ flex: 1 }}>
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
                        <b>Topic Description</b> {course.enrolledcourselevels}
                    </Typography>
                    <Typography variant="h7" display="block"><FaHandPointRight style={{ fontSize: '20px', color: 'gray', marginRight: '10px' }} />
                        <b>Course Description: </b>
                        {course.enrolledcoursedescription ? (isExpanded ? course.enrolledcoursedescription : `${course.enrolledcoursedescription.substring(0, 100)}...`) : 'No description available'}
                    </Typography>

                    {course.enrolledcoursedescription && course.enrolledcoursedescription.length > 100 && (
                        <Button size="small" color="primary" onClick={handleToggleDescription}>
                            {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                    )}
                    <br />

                </CardContent>
            </Card> */}
            <Card sx={{
                display: 'flex',
                margin: '60px auto',
                maxWidth: '90%',
                height: 'auto',
                fontSize: '18px',
                boxShadow: '0px 8px 16px rgba(35, 39, 92, 0.2)',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',

            }}>
                <CardMedia
                    style={{
                        // // objectFit: 'cover',
                        // height:'300px',
                        // width: "300px",
                        // // minHeight: '400px',

                        objectFit: "cover",
                        height: "140px",
                        width: "240px",
                        marginTop:'80px',
                        boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)'

                    }}
                    component="img"
                    image={course.thumbnailimage}
                    alt="Course-Thumbnail"
                />
                <CardContent sx={{
                    flex: 1,
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <Typography gutterBottom variant="h4" component="div" sx={{
                        fontWeight: 'bold',
                        color: '#23275c',
                        marginBottom: '20px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        {course.enrolledCoursename}
                    </Typography>
                    <Typography variant="h7" display="block" sx={{ marginBottom: '15px' }}>
                        <FaHandPointRight style={{ fontSize: '20px', color: '#4a4e8a', marginRight: '10px', verticalAlign: 'middle' }} />
                        <span style={{ fontWeight: 'bold', color: '#23275c' }}>Category:</span>
                        <span style={{ color: '#4a4e8a' }}>{course.enrolledcoursecategory}</span>
                    </Typography>
                    <Typography variant="h7" display="block" sx={{ marginBottom: '15px' }}>
                        <FaHandPointRight style={{ fontSize: '20px', color: '#4a4e8a', marginRight: '10px', verticalAlign: 'middle' }} />
                        <span style={{ fontWeight: 'bold', color: '#23275c' }}>Level:</span>
                        <span style={{ color: '#4a4e8a' }}>{course.enrolledcourselevels}</span>
                    </Typography>
                    <Typography variant="h7" display="block" sx={{ marginBottom: '15px' }}>
                        <FaHandPointRight style={{ fontSize: '20px', color: '#4a4e8a', marginRight: '10px', verticalAlign: 'middle' }} />
                        <span style={{ fontWeight: 'bold', color: '#23275c' }}>Topic Description:</span>
                        <span style={{ color: '#4a4e8a' }}>{course.enrolledcourselevels}</span>
                    </Typography>
                    <Typography variant="h7" display="block" sx={{ marginBottom: '15px' }}>
                        <FaHandPointRight style={{ fontSize: '20px', color: '#4a4e8a', marginRight: '10px', verticalAlign: 'middle' }} />
                        <span style={{ fontWeight: 'bold', color: '#23275c' }}>Course Description:</span>
                        <span style={{ color: '#4a4e8a' }}>
                            {course.enrolledcoursedescription ? (isExpanded ? course.enrolledcoursedescription : `${course.enrolledcoursedescription.substring(0, 100)}...`) : 'No description available'}
                        </span>
                    </Typography>
                    {course.enrolledcoursedescription && course.enrolledcoursedescription.length > 100 && (
                        <Button
                            size="small"
                            color="primary"
                            onClick={handleToggleDescription}
                            sx={{
                                alignSelf: 'flex-start',
                                marginTop: '10px',
                                background: '#23275c',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                '&:hover': {
                                    background: '#ffffff',
                                }
                            }}
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                    )}
                </CardContent>
            </Card>


        </>



    )
}

export default CourseDescription;