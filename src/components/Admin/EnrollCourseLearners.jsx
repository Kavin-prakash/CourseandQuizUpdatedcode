import * as React from 'react';
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DoneIcon from '@mui/icons-material/Done';
import { Container, Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { CardActionArea } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollCourseLearnerRequest } from "../../actions/Admin/EnrollmentCourseLearners";
import { Link, useParams } from "react-router-dom";
export default function EnrollCourseLearners() {
    const courseId = useParams();
    const dispatch = useDispatch();
    const enrolledlearners = useSelector((state) => state.enrolledlearners.learners);
    useEffect(() => {
        dispatch(fetchEnrollCourseLearnerRequest(courseId))
    }, []);

    return (
        <>
            <Container fluid className='mt-5'>
                <Row>
                    {/* <Col xs={12} md={6}>
                        <form className="form-inline my-2 my-lg-0">
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            // value={searchpassedusers}
                            // onChange={(e) => setSearchpassedusers(e.target.value)}
                            />
                        </form>
                    </Col> */}
                </Row>

                <Row>
                    <div className='scrollale-content mt-5'>
                        {/* <div className='mt-5' style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}> */}
                        {enrolledlearners.map((row, index) => (
                            <Card key={row.learnerId} sx={{ width: 250, height: "100", mb: 5, borderRadius: 2, display: 'inline-block', flexDirection: 'column', justifyContent: 'space-between', margin: '0 20px', textDecoration: 'none' }} component={Link} to={'/individuallearner/' + row.learnerId}>
                                <CardActionArea>
                                    <CardMedia component="img" height="140" row={2} image={row.profilePhoto} style={{ borderRadius: 100, width: "40%", height: "30%", marginLeft: "30%" }} alt={row.title} />
                                    <CardContent>
                                        <Typography gutterBottom variant='h5' component="div" textTransform={"capitalize"} align='center' fontWeight={"bold"}>{row.name} </Typography>
                                        <Typography variant="body2" color="text.secondary" align='center'  > {row.status != true ? <>Inprogress <ThumbDownAltIcon /></> : <> Completed <DoneIcon /></>} </Typography>
                                    </CardContent>

                                </CardActionArea>
                            </Card>
                        ))}
                    </div>
                </Row>
            </Container>
        </>
    );
};
