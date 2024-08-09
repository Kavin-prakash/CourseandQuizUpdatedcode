import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import SavedTopics from '../../../components/Course/Topic/SavedTopics';
import AddTopic from '../../../components/Course/Topic/AddTopic'
import { BackButton } from '../BackButton';

function Topics() {
  return (
    <>
      <Container fluid>
        <Row>
        </Row>
        <Row>
          <Col xs={4} md={2}>
          </Col>
          <Col xs={8} md={6} className='mt-5'>
            <Row className="mt-4">
              <Col sx={10} md={2}></Col>
            </Row>
            <AddTopic />
            <SavedTopics />
          </Col>

        </Row>

      </Container>
    </>
  )
}

export default Topics;