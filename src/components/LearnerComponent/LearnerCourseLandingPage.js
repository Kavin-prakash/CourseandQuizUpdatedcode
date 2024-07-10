import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { fetchCourseRequest } from "../../actions/Course/Course/FetchCouseDetailsAction";
import '../../Styles/Learner/LearnerCourseLandingPage.css';

const Content = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const course = useSelector((state) => state.fetchindividualCourse.courses);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseRequest(id));
    }
  }, [id, dispatch]);

  const handleToggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="course-page-wrapper">
      <div className="course-header">
        <Container>
          <Row>
            <Col md={8}>
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="course-title">{course.title}</h1>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="course-thumbnail-wrapper"
              >
                <img className="course-thumbnail" style={{width:"250px",height:"250px"}} src={course.thumbnail} alt="Course Thumbnail" />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="course-content">
        <Row>
          <Col md={8}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="course-details">
                <div className="course-info-container">
                  <div className="course-info-item">
                    <span className="course-info-label">Category</span>
                    <span className="course-info-value">{course.category}</span>
                  </div>
                  <div className="course-info-item">
                    <span className="course-info-label">Level</span>
                    <span className="course-info-value">{course.level}</span>
                  </div>
                  <div className="course-info-item">
                    <span className="course-info-label">Duration</span>
                    <span className="course-info-value">{course.duration} hrs</span>
                  </div>
                </div>
                <div className="course-description">
                  <h3>Course Description</h3>
                  <p>
                    {isExpanded ? course.description : `${course.description?.substring(0, 150)}...`}
                  </p>
                  {course.description && course.description.length > 150 && (
                    <button className="toggle-description-button" onClick={handleToggleDescription}>
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div className="course-actions">
                  <button className="enroll-button_Priya" style={{marginLeft:"600px"}}>Enroll Now</button>
                 
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Content;