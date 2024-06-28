import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { fetchProfileCoursesRequest } from "../../actions/Admin/LearnersViewAction";
import '../../Styles/Admin/ProfileEnrolledCourses.css';
import { Card, CardContent, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
const ProfileEnrolledCourses = ({ fetchProfileCourses, profilecourses }) => {
  const learnerid = useParams();
  useEffect(() => {
    fetchProfileCourses(learnerid);
  }, [fetchProfileCourses]);
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const rows = profilecourses.profileCourses;
  let completecourse = rows.filter(row => row.status === 1);
  let inprogresscourse = rows.filter(row => row.status === 0);
  return (
    <>
      <div id='profileEnrolledCourses'>
        <h1>Enrolled Courses</h1>


        <div id='profileEnrolledCoursesBtn'>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label={`Total Courses (${rows.length})`} value="1" />
                <Tab label={`Completed Courses (${completecourse.length})`} value="2" />
                <Tab label={`InProgress Courses (${inprogresscourse.length})`} value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div id='profileCourses'>
                {rows.map(row =>
                  <Card sx={{ maxWidth: 345 }} key={row.enrollmentid} >
                    <CardMedia
                      sx={{ height: 140 }}
                      image={row.courseImage}
                      title={row.courseImage}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {row.enrolledcourse}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.enrolledCourseCategory}<br />
                        {row.enrolledCourselevels}<br />
                        {row.enrollmentdate.replace('T', ' ')}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div id='profileCourses'>
                {completecourse.map(row =>
                  <Card sx={{ maxWidth: 345 }} key={row.enrollmentid}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={row.courseImage}
                      title={row.courseImage}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {row.enrolledcourse}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.enrolledCourseCategory}<br />
                        {row.enrolledCourselevels}<br />
                        {row.enrollmentdate.replace('T', ' ')}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div id='profileCourses'>
                {inprogresscourse.map(row =>
                  <Card sx={{ maxWidth: 345 }} key={row.enrollmentid}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={row.courseImage}
                      title={row.courseImage}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {row.enrolledcourse}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.enrolledCourseCategory}<br />
                        {row.enrolledCourselevels}<br />
                        {row.enrollmentdate.replace('T', ' ')}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div >
    </>
  );
};

const mapStoreToProps = (state) => ({
  profilecourses: state.profilecourses,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProfileCourses: (learnerid) => dispatch(fetchProfileCoursesRequest(learnerid))
})
export default connect(mapStoreToProps, mapDispatchToProps)(ProfileEnrolledCourses);
