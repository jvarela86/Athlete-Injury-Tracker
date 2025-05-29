import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1>ARMS Athlete Injury Tracking System</h1>
        <p className="lead">
          A comprehensive system for tracking athlete injuries, treatments, and recovery.
        </p>
      </div>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
              </div>
              <Card.Title className="text-center">Athletes</Card.Title>
              <Card.Text>
                Manage your athletes' profiles, including personal information, sports, teams, positions, and current status.
              </Card.Text>
              <div className="mt-auto pt-3">
                <Button as={Link} to="/athletes" variant="primary" className="w-100">
                  Manage Athletes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <i className="bi bi-bandaid" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
              </div>
              <Card.Title className="text-center">Injuries</Card.Title>
              <Card.Text>
                Record and track injuries, including injury type, location, severity, date of occurrence, and current status.
              </Card.Text>
              <div className="mt-auto pt-3">
                <Button as={Link} to="/injuries" variant="danger" className="w-100">
                  Track Injuries
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <i className="bi bi-clipboard2-pulse" style={{ fontSize: '3rem', color: '#198754' }}></i>
              </div>
              <Card.Title className="text-center">Treatments</Card.Title>
              <Card.Text>
                Document treatments, including treatment type, provider information, dates, notes, and follow-up recommendations.
              </Card.Text>
              <div className="mt-auto pt-3">
                <Button as={Link} to="/treatments" variant="success" className="w-100">
                  Manage Treatments
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Link to="/athletes/add" className="btn btn-outline-primary me-2">
          Add New Athlete
        </Link>
        <Link to="/injuries/add" className="btn btn-outline-danger me-2">
          Record New Injury
        </Link>
        <Link to="/treatments/add" className="btn btn-outline-success">
          Add New Treatment
        </Link>
      </div>
    </Container>
  );
};

export default Home;