import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import AddContentComponent from '../../../components/Course/Material/AddContentComponent';
import { BackButton } from '../BackButton';
function AddMaterial() {

  return (
    <Container fluid>
      <Row>
        <Row>
          <Col xs={12} md={10} className='pt-4'>
            <AddContentComponent />
          </Col>
        </Row>
      </Row>
    </Container>


  )
}

export default AddMaterial