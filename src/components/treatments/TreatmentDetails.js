import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTreatmentById, deleteTreatment } from '../../services/api';
import { Container, Card, Row, Col, Button, Badge, Spinner, Alert, ListGroup } from 'react-bootstrap';

const TreatmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        setLoading(true);
        const response = await getTreatmentById(id);
        setTreatment(response.data);
      } catch (err) {
        setError('Failed to load treatment details. Please try again later.');
        console.error('Error loading treatment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTreatment(id);
      navigate('/treatments');
    } catch (err) {
      setError('Failed to delete treatment. Please try again later.');
      console.error('Error deleting treatment:', err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  // Get result badge color
  const getResultBadgeColor = (result) => {
    if (!result) return 'secondary';
    
    const resultLower = result.toLowerCase();
    if (resultLower.includes('excellent') || resultLower.includes('complete')) {
      return 'success';
    } else if (resultLower.includes('good') || resultLower.includes('significant')) {
      return 'info';
    } else if (resultLower.includes('moderate') || resultLower.includes('partial')) {
      return 'warning';
    } else if (resultLower.includes('poor') || resultLower.includes('minimal')) {
      return 'danger';
    } else {
      return 'secondary';
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
        <Button as={Link} to="/treatments" variant="secondary">
          Back to Treatments
        </Button>
      </Container>
    );
  }

  if (!treatment) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Treatment not found.</Alert>
        <Button as={Link} to="/treatments" variant="secondary">
          Back to Treatments
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
                {treatment.treatmentType} Treatment
                {treatment.result && (
                  <Badge 
                    bg={getResultBadgeColor(treatment.result)} 
                    className="ms-2"
                  >
                    {treatment.result}
                  </Badge>
                )}
              </h2>
            </Col>
            <Col xs="auto">
              <Button 
                as={Link} 
                to="/treatments" 
                variant="secondary" 
                className="me-2"
              >
                Back
              </Button>
              <Button 
                as={Link} 
                to={`/treatments/edit/${treatment.treatmentID}`} 
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
              <p>Are you sure you want to delete this treatment? This action cannot be undone.</p>
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
                  <h4>Treatment Information</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Date:</strong> {formatDate(treatment.treatmentDate)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Type:</strong> {treatment.treatmentType || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Provider:</strong> {treatment.provider || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Facility:</strong> {treatment.facility || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Result:</strong>{' '}
                    {treatment.result ? (
                      <Badge bg={getResultBadgeColor(treatment.result)}>
                        {treatment.result}
                      </Badge>
                    ) : (
                      'Not specified'
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Follow-up Required:</strong>{' '}
                    {treatment.followUpRequired ? 'Yes' : 'No'}
                  </ListGroup.Item>
                  {treatment.followUpRequired && treatment.followUpDate && (
                    <ListGroup.Item>
                      <strong>Follow-up Date:</strong> {formatDate(treatment.followUpDate)}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h4>Related Information</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Athlete:</strong>{' '}
                    <Link to={`/athletes/${treatment.athleteID}`}>
                      {treatment.athleteName || 'Unknown Athlete'}
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Injury:</strong>{' '}
                    <Link to={`/injuries/${treatment.injuryID}`}>
                      {treatment.injuryDescription || 'Unknown Injury'}
                    </Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <Card className="mb-4">
                <Card.Header>
                  <h4>Notes</h4>
                </Card.Header>
                <Card.Body>
                  <p>{treatment.notes || 'No notes provided.'}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Header>
              <h4>Recommendations</h4>
            </Card.Header>
            <Card.Body>
              <p>{treatment.recommendations || 'No recommendations provided.'}</p>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TreatmentDetails;