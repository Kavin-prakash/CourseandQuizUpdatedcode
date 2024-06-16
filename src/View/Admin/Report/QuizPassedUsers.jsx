// import React, { useEffect, useState } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { fetchquizpassedusersRequest } from '../../../actions/Admin/QuizPassedUserAction';
// import { connect, useSelector } from 'react-redux';
// import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
// import { useParams } from 'react-router-dom';
// import CreditScoreIcon from '@mui/icons-material/CreditScore';
// import { UseSelector } from 'react-redux';

// const QuizPassedUsers = ({ fetchpassedusers, quizpassedusers }) => {


//     // Search Users states 

//     const [searchpassedusers, setSearchpassedusers] = useState('');

//     const [filtersearchpassedusers, setFilteredsearchpassedusers] = useState([]);


//     console.log(searchpassedusers);

//     // UseEffect Hook for the Search the passed users

//     useEffect(() => {
//         setFilteredsearchpassedusers(
//             quizpassedusers.filter((filterpasseduser) =>
//                 Object.values(filterpasseduser).some((value) =>
//                     value !== null && value.toString().toLowerCase().includes(searchpassedusers.toLowerCase())
//                 )
//             )
//         );
//     }, [quizpassedusers, searchpassedusers]);



//     const quizid = useParams();
//     console.log("Checking the Quiz Id for the Quiz Passed Users", quizid);


//     // Use the UseSelector for the Mesagge



//     const DisplayMessageZeroPassedUsers=useSelector((state)=>state.quizpassedusers.message)

//     console.log("check_the_message",DisplayMessageZeroPassedUsers);


//     // UseEffect for the Displaying the data

//     // Dispatch the action with the quiz ID

//     useEffect(() => {
//         fetchpassedusers(quizid);
//     }, [fetchpassedusers, quizid]);


//     return (
//         <>

//             <Container fluid className='mt-5'>
//                 <Row>
//                     <Col xs={12} md={6}>
//                         <form className="form-inline my-2 my-lg-0">
//                             <input
//                                 className="form-control mr-sm-2"
//                                 type="search"
//                                 placeholder="Search"
//                                 aria-label="Search"
//                                 value={searchpassedusers}
//                                 onChange={(e) => setSearchpassedusers(e.target.value)}
//                             />
//                         </form>
//                     </Col>
//                 </Row>
//                 <Row >
//                     <div className='scrollable-content'>
//                         {filtersearchpassedusers.map((passeduser) => (
//                             <Card key={passeduser.courseId} sx={{ maxWidth: 200, maxHeight: 250, mb: 5, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                                 <CardActionArea>
//                                     <CardMedia
//                                         component="img"
//                                         image={passeduser.profilephoto}
//                                         alt={passeduser.learnerName || 'Course image'}
//                                         style={{

//                                             height: '90px', width: '90px', alignContent: 'center',
//                                             alignItems: 'center', borderRadius: '50%', marginInlineStart: '50px'
//                                         }}
//                                     />
//                                     <CardContent>
//                                         <Typography gutterBottom component="div">
//                                             <b>Name:</b>{passeduser.learnerName}
//                                         </Typography>

//                                         <Typography variant="body2" gutterBottom color="text.secondary" >
//                                             <b>Attempts :</b>{passeduser.totalNoofQuizAttempts}
//                                         </Typography>
//                                         <Typography variant="body2"  gutterBottom style={{ color: 'green' }}>
//                                             <b>Score<CreditScoreIcon/> :</b>{passeduser.score}
//                                         </Typography>
//                                     </CardContent>
//                                 </CardActionArea>
//                             </Card>
//                         ))}
//                     </div>

//                     <div>
//                         <h2>{DisplayMessageZeroPassedUsers}</h2>
//                     </div>

//                 </Row>
//             </Container>
//         </>
//     );
// };


// const mapStateToProps = (state) => ({
//     quizpassedusers: state.quizpassedusers.quizpasseduser
// });


// const mapDispatchToProps = (dispatch) => ({
//     fetchpassedusers: (quizid) => dispatch(fetchquizpassedusersRequest(quizid))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(QuizPassedUsers);



import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchquizpassedusersRequest } from '../../../actions/Admin/QuizPassedUserAction';
import { connect, useSelector } from 'react-redux';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

const QuizPassedUsers = ({ fetchpassedusers, quizpassedusers }) => {
    const [searchpassedusers, setSearchpassedusers] = useState('');
    const [filtersearchpassedusers, setFilteredsearchpassedusers] = useState([]);

    console.log(searchpassedusers);



    const quizid = useParams();
    console.log("Checking the Quiz Id for the Quiz Passed Users", quizid);

    // const DisplayMessageZeroPassedUsers = useSelector((state) => state.quizpassedusers.message)
    // console.log("check_the_message", DisplayMessageZeroPassedUsers);

    useEffect(() => {
        fetchpassedusers(quizid);
    }, [fetchpassedusers, quizid]);



    useEffect(() => {
        // if (quizpassedusers.length === 0) {

        //     fetchpassedusers(quizid);
            
        // } else {

            setFilteredsearchpassedusers(
                quizpassedusers.filter((filterpasseduser) =>
                    Object.values(filterpasseduser).some((value) =>
                        value !== null && value.toString().toLowerCase().includes(searchpassedusers.toLowerCase())
                    )
                )
            );
        // }
        
    }, [quizpassedusers, searchpassedusers]);


    return (
        <>
            <Container fluid className='mt-5'>
                <Row>
                        <>
                            <Row>
                                <Col xs={12} md={6}>
                                    <form className="form-inline my-2 my-lg-0">
                                        <input
                                            className="form-control mr-sm-2"
                                            type="search"
                                            placeholder="Search"
                                            aria-label="Search"
                                            value={searchpassedusers}
                                            onChange={(e) => setSearchpassedusers(e.target.value)}
                                        />
                                    </form>
                                </Col>
                            </Row>
                            <div className='scrollable-content'>
                                {filtersearchpassedusers.map((passeduser) => (
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
                                                <Typography variant="body2" gutterBottom style={{ color: 'green' }}>
                                                    <b>Score<CreditScoreIcon /> :</b> {passeduser.score}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </div>
                        </>
                    
                </Row>
            </Container>
        </>
    );
};


const mapStateToProps = (state) => ({
    quizpassedusers: state.quizpassedusers.quizpasseduser
});


const mapDispatchToProps = (dispatch) => ({
    fetchpassedusers: (quizid) => dispatch(fetchquizpassedusersRequest(quizid))
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizPassedUsers);
