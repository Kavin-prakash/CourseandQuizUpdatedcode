import React from 'react'
// import { Sidenavbar } from '../../../Component/SideNavbar';
// import { Header } from '../../../Component/Header';
// import Content from '../../../Components/Course/Course/CourseContent';

import Content from '../../../components/Course/Course/CourseContent'
import { Row,Col,Container } from 'react-bootstrap';
import SavedTopics from '../../../components/Course/Topic/SavedTopics';

export const CourseContent = () => {
  return (
    <>
    

    <Row>
      {/* <Col md={12}><Header/></Col>
      <Col md={12}><Sidenavbar/> */}
      <Content/>
      
      {/* </Col> */}
    </Row>
    <Row className="mt-5">
      <h3>
        List of Topics : 
      </h3>
    </Row>
    <Row>

      <SavedTopics/>
    </Row>
   
    </>
  )
}
