// import React from 'react'
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import "../../Styles/Learner/GetEnrollment.css";
// function CourseDescription({ course }) {
//     return (
//         <div>
//             <Card
//                 style={{ height: '850px' }}
//                 id="Card"
//             //   onClick={handleNavigation(course)}
//             >
//                 <CardContent id="cardcontent_Learner">
//                     <div className="card-hori d-flex">
//                         <div>
//                             <img
//                                 id="thumbnail"
//                                 src={course.thumbnailimage}
//                                 alt="Course Thumbnail"
//                                 height={150}
//                                 width={150}
//                             />
//                             <Typography variant="h5" component="h2" >
//                                 {course.enrolledCoursename}
//                             </Typography>
//                         </div>

//                         <div id="coursedetails_Learner">

//                             <Typography color="textSecondary" className='description_content_Learner'><h3> COURSE DESCRIPTION:</h3>
//                                 {course.enrolledcoursedescription}
//                             </Typography>
//                             <div className="level">
//                                 <Typography color="textSecondary"><h5>Category: {course.enrolledcoursecategory}</h5>

//                                 </Typography>
//                                 <Typography color="textSecondary"><h5>Level:  {course.enrolledcourselevels}</h5>

//                                 </Typography>
//                             </div>

//                         </div>

//                     </div>

//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// export default CourseDescription;



//AC

import React from 'react'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "../../Styles/Learner/GetEnrollment.css";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getIndividualEnrollCourseRequest } from '../../actions/LearnerAction/FetchIndividualEnrolledCourseAction';
import { useParams } from 'react-router-dom';
function CourseDescription() {
const {courseId}=useParams();
  const dispatch= useDispatch();
  const course = useSelector((state) => state.fetchEnrolledIndividualCourse.individualcourse);
  useEffect(()=>{
    dispatch(getIndividualEnrollCourseRequest(courseId));
   },[courseId])
    console.log(course);
    return (
        <div>
  {/* <Typography variant="h5" component="h2">
                                {course.enrolledCoursename}
                            </Typography> */}
 
           
           
               
 
           
 
               {course&& course.map((courses)=>(<><CardContent id="cardcontent">
                    <div className="card-hori d-flex">
                        <div>
                             <img
                                id="thumbnail"
                                src={courses.thumbnailimage}
                                alt="Course Thumbnail"
                                height={150}
                                width={100}
                            />
                            <Typography variant="h5" component="h2">
                                {courses.enrolledCoursename}
                            </Typography>
                        </div>
 
                        <div id="coursedetails">
 
                            <Typography color="textSecondary"><h3> COURSE DESCRIPTION:</h3>
                                {courses.enrolledcoursedescription}
                            </Typography>
                            <div className="level">
                                <Typography color="textSecondary"><h5>Category: {courses.enrolledcoursecategory}</h5>
 
                                </Typography>
                                <Typography color="textSecondary"><h5>Level:  {courses.enrolledcourselevels}</h5>
 
                                </Typography>
                            </div>
 
                        </div>
 
                    </div>
 
                </CardContent></>)) }
 
               
           
           
             
        </div>
    )
}
 
export default CourseDescription;