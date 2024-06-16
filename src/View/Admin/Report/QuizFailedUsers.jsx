import React from 'react'
import { Container, Row ,Col} from 'react-bootstrap'
import { Card,CardMedia,Typography,CardContent,CardActionArea } from '@mui/material'
import { Connect, connect } from 'react-redux'
import { fetchquizfailedusersRequest } from '../../../actions/Admin/QuizFailedUserAction'
import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'
const QuizFailedReport = ({fetchfailedusers,quizfailesdusers}) => {


  // Impletment the UseStates for the Search and Filter

  const [searchfailedusers, setSearchfailedusers] = useState('');
  const [filtersearchfailedusers, setFilteredsearchfailedusers] = useState([]);

  console.log(searchfailedusers)



  // Get the Quiz from the Page 

  const FailedUserQuizId=useParams();
  console.log("Checking the Quiz Id for the Quiz Failes Users", FailedUserQuizId);



  // UseEffect for the get the data 

  useEffect(() => {
    fetchfailedusers(FailedUserQuizId);
}, [fetchfailedusers, FailedUserQuizId]);




useEffect(() => {

  setFilteredsearchfailedusers(
         quizfailesdusers.filter((filterfaileduser) =>
              Object.values(filterfaileduser).some((value) =>
                  value !== null && value.toString().toLowerCase().includes(searchfailedusers.toLowerCase())
              )
          )
      );
  
}, [quizfailesdusers, searchfailedusers]);



  return (
    <>
      <Container fluid className='mt-5'>
        <>
          <Row>
            <Col xs={12} md={6}>
              <form className="form-inline my-2 my-lg-0">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchfailedusers}
                  onChange={(e) => setSearchfailedusers(e.target.value)}
                />
              </form>
            </Col>
          </Row>
          <div className='scrollable-content'>
            {filtersearchfailedusers.map((passeduser) => (
              <Card key={passeduser.courseId} sx={{ maxWidth: 200, maxHeight: 250, mb: 5, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={passeduser.profilephoto}
                    alt={passeduser.learnerName || 'Course image'}
                    style={{
                      height: '90px', width: '90px', alignContent: 'center',
                      alignItems: 'center', borderRadius: '50%', marginInlineStart: '50px'
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom component="div">
                      <b>Name:</b> {passeduser.learnerName}
                    </Typography>
                    <Typography variant="body2" gutterBottom color="text.secondary">  
                      <b>Attempts :</b> {passeduser.totalNoofQuizAttempts}
                    </Typography>
                    <Typography variant="body2" gutterBottom style={{ color: 'red' }}>
                      <b>Score :</b> {passeduser.score}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>
        </>


      </Container>

    </>
  )
}


const mapStateToProps = (state) => ({
  quizfailesdusers: state.quizfailedusers.quizfaileduser
});

const mapDispatchToProps = (dispatch) => ({
  fetchfailedusers: (FailedUserQuizId) => dispatch(fetchquizfailedusersRequest(FailedUserQuizId))
});



export default connect (mapStateToProps,mapDispatchToProps) (QuizFailedReport)
