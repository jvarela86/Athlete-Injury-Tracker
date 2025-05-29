import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAthleteById, addAthlete, updateAthlete } from '../../services/api';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

const AthleteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sport: '',
    teamName: '',
    position: '',
    jerseyNumber: '',
    status: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  // Status options
  const statusOptions = ['Active', 'Injured', 'Recovering', 'Retired', 'Inactive'];

  useEffect(() => {
    // If editing, fetch the athlete data
    if (isEditMode) {
      const fetchAthlete = async () => {
        try {
          const response = await getAthleteById(id);
          const athlete = response.data;
          
          // Format date for input field (YYYY-MM-DD)
          const formattedDOB = athlete.dateOfBirth 
            ? new Date(athlete.dateOfBirth).toISOString().split('T')[0]
            : '';
          
          setFormData({
            firstName: athlete.firstName || '',
            lastName: athlete.lastName || '',
            dateOfBirth: formattedDOB,
            sport: athlete.sport || '',
            teamName: athlete.teamName || '',
            position: athlete.position || '',
            jerseyNumber: athlete.jerseyNumber || '',
            status: athlete.status || ''
          });
        } catch (err) {
          setError('Failed to load athlete data. Please try again later.');
          console.error('Error loading athlete:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchAthlete();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For jersey number, ensure it's a positive number or empty
    if (name === 'jerseyNumber') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSubmitting(true);
    
    try {
      // Prepare data object
      const athleteData = {
        ...formData,
        jerseyNumber: formData.jerseyNumber === '' ? 0 : parseInt(formData.jerseyNumber, 10)
      };
      
      // If editing, add athlete ID
      if (isEditMode) {
        athleteData.athleteID = parseInt(id, 10);
      }
      
      // Submit the form
      if (isEditMode) {
        await updateAthlete(id, athleteData);
      } else {
        await addAthlete(athleteData);
      }
      
      // Redirect back to athletes list on success
      navigate('/athletes');
    } catch (err) {
      const errorMessage = isEditMode 
        ? 'Failed to update athlete. Please try again later.' 
        : 'Failed to add athlete. Please try again later.';
      
      setError(errorMessage);
      console.error('Error submitting form:', err);
      setSubmitting(false);
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

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h2>{isEditMode ? 'Edit Athlete' : 'Add New Athlete'}</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                  />
                  <Form.Control.Feedback type="invalid">
                    First name is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Last name is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Date of birth is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="sport">
                  <Form.Label>Sport</Form.Label>
                  <Form.Control
                    type="text"
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    placeholder="Enter sport (e.g., Basketball, Football)"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="teamName">
                  <Form.Label>Team Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Enter team name"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="position">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Enter position (e.g., Forward, Quarterback)"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="jerseyNumber">
                  <Form.Label>Jersey Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="jerseyNumber"
                    value={formData.jerseyNumber}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter jersey number"
                  />
                  <Form.Control.Feedback type="invalid">
                    Jersey number must be a positive number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                as={Link} 
                to="/athletes" 
                variant="secondary"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  isEditMode ? 'Update Athlete' : 'Add Athlete'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AthleteForm;