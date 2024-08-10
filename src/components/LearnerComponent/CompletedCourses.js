import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchenrollCourse } from "../../actions/LearnerAction/EnrolledCourseAction";
import "../../Styles/Learner/CompletedCourses.css";
import { useNavigate } from "react-router-dom";

function CompletedCourses() {
  const dispatch = useDispatch();
  const id = sessionStorage.getItem("UserSessionID");
  const enrolledCourses = useSelector((state) => state.enroll.course[0]);
  const learnerName = useSelector((state) => state.user.name); // Assuming you have user info in Redux state

  useEffect(() => {
    dispatch(fetchenrollCourse(id));
  }, [dispatch, id]);

  const completedCourses =
    enrolledCourses?.filter((course) => course.completedStatus === 1) || [];

  const navigate = useNavigate();

  const handleNavigate = (enrollmentid) => {
    console.log("ecid", enrollmentid);
    navigate(`/certificate/${enrollmentid}`);
  };

  return (
    <div className="completed-courses-container">
      <h2
        id="Completionheader"
        style={{ fontWeight: "bold", color: "midnightblue", marginLeft: "40%" }}
      >
        Completed Courses
      </h2>
      <div className="course-grid">
        {completedCourses.map((course) => (
          <div key={course.enrollmentid} className="course-card">
            <img
              src={course.thumbnailimage}
              alt={course.enrolledCoursename}
              className="completedcourse-thumbnail"
            />
            <div className="course-info">
              <h3>{course.enrolledCoursename}</h3>
              <p>{course.enrolledcoursecategory}</p>
              <p>{course.enrolledcourselevels}</p>
              <button
                onClick={() => {
                  handleNavigate(course.enrollmentid);
                }}
                className="view-certificate-btn"
              >
                View Certificate
              </button>
              <button
                onClick={() => {
                  navigate(`/coursefeedbackquestion/${course.enrolledCourseId}`);
                }}
                className="view-certificate-btn"
              >
                Add Feedback
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompletedCourses;