import React from 'react'
// import { Sidenavbar } from '../../../Component/SideNavbar';
// import { Header } from '../../../Component/Header';
// import Content from '../../../Components/Course/Course/CourseContent';

import Content from '../../../components/Course/Course/CourseContent'
import { Row, Col, Container } from 'react-bootstrap';
import SavedTopics from '../../../components/Course/Topic/SavedTopics';
import AddTopic from '../../../components/Course/Topic/AddTopic'
import { BackButton } from '../BackButton';
export const CourseContent = () => {
  return (
    <>

<Col className="text-end mt-5">
            {/* <BackButton/> */}
          </Col>
      <Row>
        {/* <Col md={12}><Header/></Col>
      <Col md={12}><Sidenavbar/> */}
        <Content />

        {/* </Col> */}
      </Row>
      <Row>
        <h3 className='mt-5' style={{paddingLeft:'20px'}}><b>
          List of Topics :</b>
        </h3>
        
      </Row>
      <Row>
      <AddTopic/>
        <SavedTopics />
      </Row>

    </>
  )
}