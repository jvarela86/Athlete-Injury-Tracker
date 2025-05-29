import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAthleteById, deleteAthlete } from '../../services/api';
import { Container, Card, Row, Col, Button, Badge, Spinner, Alert, ListGroup } from 'react-bootstrap';

const AthleteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        setLoading(true);
        const response = await getAthleteById(id);
        setAthlete(response.data);
      } catch (err) {
        setError('Failed to load athlete details. Please try again later.');
        console.error('Error loading athlete:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAthlete();
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAthlete(id);
      navigate('/athletes');
    } catch (err) {
      setError('Failed to delete athlete. Please try again later.');
      console.error('Error deleting athlete:', err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'injured':
        return 'danger';
      case 'recovering':
        return 'warning';
      case 'retired':
        return 'secondary';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/athletes" variant="secondary">
          Back to Athletes
        </Button>
      </Container>
    );
  }

  if (!athlete) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Athlete not found.</Alert>
        <Button as={Link} to="/athletes" variant="secondary">
          Back to Athletes
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h2>
                {athlete.firstName} {athlete.lastName}
                {athlete.status && (
                  <Badge 
                    bg={getStatusBadgeColor(athlete.status)} 
                    className="ms-2"
                  >
                    {athlete.status}
                  </Badge>
                )}
              </h2>
            </Col>
            <Col xs="auto">
              <Button 
                as={Link} 
                to="/athletes" 
                variant="secondary" 
                className="me-2"
              >
                Back
              </Button>
              <Button 
                as={Link} 
                to={`/athletes/edit/${athlete.athleteID}`} 
                variant="warning" 
                className="me-2"
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {showDeleteConfirm && (
            <Alert variant="danger" className="mb-4">
              <p>Are you sure you want to delete this athlete? This action cannot be undone.</p>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDeleteConfirm}
                className="me-2"
              >
                Confirm Delete
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h4>Personal Information</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Date of Birth:</strong> {new Date(athlete.dateOfBirth).toLocaleDateString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Age:</strong> {calculateAge(athlete.dateOfBirth)} years
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h4>Athletic Information</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Sport:</strong> {athlete.sport || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Team:</strong> {athlete.teamName || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Position:</strong> {athlete.position || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Jersey #:</strong> {athlete.jerseyNumber || 'Not specified'}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h4>Injury History</h4>
                </Col>
                <Col xs="auto">
                  <Button 
                    as={Link} 
                    to={`/injuries/add?athleteId=${athlete.athleteID}`} 
                    variant="primary" 
                    size="sm"
                  >
                    Add Injury
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Link to={`/injuries?athleteId=${athlete.athleteID}`} className="btn btn-outline-primary">
                View All Injuries for this Athlete
              </Link>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AthleteDetails;