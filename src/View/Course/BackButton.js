import { useNavigate } from 'react-router-dom';
import { Col, Button, Row } from 'react-bootstrap';
export const BackButton = () => {
  let navigate = useNavigate();
  return (
    <Col className="text-end">
      <Button onClick={() => navigate(-1)} style={{ paddingLeft: '60px', paddingRight: '60px', color: 'blue', backgroundColor: 'white' }}>Back</Button>
    </Col>
  );
};