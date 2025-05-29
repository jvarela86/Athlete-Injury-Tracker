import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInjuryById, deleteInjury, getTreatmentsByInjuryId } from '../../services/api';
import { Container, Card, Row, Col, Button, Badge, Spinner, Alert, ListGroup, Table } from 'react-bootstrap';

const InjuryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [injury, setInjury] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchInjuryAndTreatments = async () => {
      try {
        setLoading(true);
        const injuryResponse = await getInjuryById(id);
        setInjury(injuryResponse.data);
        
        // Fetch related treatments
        try {
          const treatmentsResponse = await getTreatmentsByInjuryId(id);
          setTreatments(treatmentsResponse.data);
        } catch (treatmentErr) {
          console.error('Error loading treatments:', treatmentErr);
          setTreatments([]);
        }
      } catch (err) {
        setError('Failed to load injury details. Please try again later.');
        console.error('Error loading injury:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInjuryAndTreatments();
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInjury(id);
      navigate('/injuries');
    } catch (err) {
      setError('Failed to delete injury. Please try again later.');
      console.error('Error deleting injury:', err);
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

  // Get severity badge color
  const getSeverityBadgeColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minor':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'severe':
        return 'danger';
      case 'critical':
        return 'dark';
      default:
        return 'info';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'danger';
      case 'recovering':
        return 'warning';
      case 'rehabilitating':
        return 'info';
      case 'healed':
        return 'success';
      default:
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
        <Button as={Link} to="/injuries" variant="secondary">
          Back to Injuries
        </Button>
      </Container>
    );
  }

  if (!injury) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Injury not found.</Alert>
        <Button as={Link} to="/injuries" variant="secondary">
          Back to Injuries
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
                {injury.injuryType} - {injury.bodyPart}
                {injury.status && (
                  <Badge 
                    bg={getStatusBadgeColor(injury.status)} 
                    className="ms-2"
                  >
                    {injury.status}
                  </Badge>
                )}
              </h2>
            </Col>
            <Col xs="auto">
              <Button 
                as={Link} 
                to="/injuries" 
                variant="secondary" 
                className="me-2"
              >
                Back
              </Button>
              <Button 
                as={Link} 
                to={`/injuries/edit/${injury.injuryID}`} 
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
              <p>Are you sure you want to delete this injury? This action cannot be undone.</p>
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
                  <h4>Injury Information</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Athlete:</strong>{' '}
                    <Link to={`/athletes/${injury.athleteID}`}>
                      {injury.athleteName || 'Unknown Athlete'}
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Injury Type:</strong> {injury.injuryType || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Body Part:</strong> {injury.bodyPart || 'Not specified'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Severity:</strong>{' '}
                    {injury.severity ? (
                      <Badge bg={getSeverityBadgeColor(injury.severity)}>
                        {injury.severity}
                      </Badge>
                    ) : (
                      'Not specified'
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Date Occurred:</strong> {formatDate(injury.dateOccurred)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong>{' '}
                    {injury.status ? (
                      <Badge bg={getStatusBadgeColor(injury.status)}>
                        {injury.status}
                      </Badge>
                    ) : (
                      'Not specified'
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h4>Additional Details</h4>
                </Card.Header>
                <Card.Body>
                  <h5>Description</h5>
                  <p>{injury.description || 'No description provided.'}</p>
                  
                  <h5>Treatment Notes</h5>
                  <p>{injury.treatmentNotes || 'No treatment notes provided.'}</p>
                  
                  <h5>Expected Recovery</h5>
                  <p>
                    {injury.expectedRecoveryDate 
                      ? `Expected recovery by ${formatDate(injury.expectedRecoveryDate)}` 
                      : 'No expected recovery date specified.'}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h4>Treatments</h4>
                </Col>
                <Col xs="auto">
                  <Button 
                    as={Link} 
                    to={`/treatments/add?injuryId=${injury.injuryID}`} 
                    variant="primary" 
                    size="sm"
                  >
                    Add Treatment
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {treatments.length === 0 ? (
                <Alert variant="info">No treatments have been recorded for this injury.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Treatment Type</th>
                        <th>Provider</th>
                        <th>Result</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treatments.map(treatment => (
                        <tr key={treatment.treatmentID}>
                          <td>{formatDate(treatment.treatmentDate)}</td>
                          <td>{treatment.treatmentType || '-'}</td>
                          <td>{treatment.provider || '-'}</td>
                          <td>{treatment.result || '-'}</td>
                          <td>
                            <Link 
                              to={`/treatments/${treatment.treatmentID}`} 
                              className="btn btn-sm btn-info me-1"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InjuryDetails;