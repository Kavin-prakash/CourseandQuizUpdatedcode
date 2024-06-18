import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseScoreRequest } from '../../actions/LearnerAction/CoursebyScoreAction';
 
function CoursebyScore() {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.coursebyscore.credential);
  const [getCourseScore, setCourseScore] = useState(store);
 
  const LearnerId = '6bdbab27-c637-48ff-850e-2cf9eb700a40';
 
  useEffect(() => {
    dispatch(fetchCourseScoreRequest(LearnerId));
  }, [dispatch, LearnerId]);
 
  useEffect(() => {
    setCourseScore(store);
  }, [store]);
 
  return (
    <div className='container mt-5'>
      <h1>Viewing score by course</h1>
      {getCourseScore.map((course) => (
        <div key={course.courseId}>
          <label>Course name: {course.courseName}</label>
          <label>Total score by topics: {course.totalScore}</label>
        </div>
      ))}
    </div>
  );
}
 
export default CoursebyScore;