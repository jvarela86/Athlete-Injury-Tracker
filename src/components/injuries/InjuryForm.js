import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  getInjuryById, 
  addInjury, 
  updateInjury, 
  getAllAthletes 
} from '../../services/api';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  Spinner, 
  Alert 
} from 'react-bootstrap';

const InjuryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const athleteIdParam = queryParams.get('athleteId');

  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    athleteID: athleteIdParam || '',
    injuryType: '',
    bodyPart: '',
    dateOccurred: '',
    severity: '',
    description: '',
    status: '',
    treatmentNotes: '',
    expectedRecoveryDate: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(true);

  // Options for dropdowns
  const severityOptions = ['Minor', 'Moderate', 'Severe', 'Critical'];
  const statusOptions = ['Active', 'Recovering', 'Rehabilitating', 'Healed'];
  const injuryTypeOptions = [
    'Sprain', 'Strain', 'Fracture', 'Dislocation', 
    'Contusion', 'Laceration', 'Concussion', 'Tendonitis', 
    'Ligament Tear', 'Muscle Tear', 'Overuse Injury', 'Other'
  ];
  const bodyPartOptions = [
    'Head', 'Neck', 'Shoulder', 'Upper Arm', 'Elbow', 'Forearm', 
    'Wrist', 'Hand', 'Fingers', 'Chest', 'Back (Upper)', 'Back (Lower)', 
    'Abdomen', 'Hip', 'Groin', 'Thigh', 'Knee', 'Lower Leg', 
    'Ankle', 'Foot', 'Toes', 'Other'
  ];

  // Load athletes and injury data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load athletes list
        setLoadingAthletes(true);
        const athletesResponse = await getAllAthletes();
        setAthletes(athletesResponse.data);
        setLoadingAthletes(false);

        // If in edit mode, load injury data
        if (isEditMode) {
          const injuryResponse = await getInjuryById(id);
          const injury = injuryResponse.data;
          
          // Format dates for input fields (YYYY-MM-DD)
          const formattedOccurrenceDate = injury.dateOccurred 
            ? new Date(injury.dateOccurred).toISOString().split('T')[0]
            : '';
          
          const formattedRecoveryDate = injury.expectedRecoveryDate 
            ? new Date(injury.expectedRecoveryDate).toISOString().split('T')[0]
            : '';
          
          setFormData({
            athleteID: injury.athleteID || '',
            injuryType: injury.injuryType || '',
            bodyPart: injury.bodyPart || '',
            dateOccurred: formattedOccurrenceDate,
            severity: injury.severity || '',
            description: injury.description || '',
            status: injury.status || '',
            treatmentNotes: injury.treatmentNotes || '',
            expectedRecoveryDate: formattedRecoveryDate
          });
          
          setLoading(false);
        }
      } catch (err) {
        const errorMessage = isEditMode 
          ? 'Failed to load injury data. Please try again later.' 
          : 'Failed to load athletes. Please try again later.';
        
        setError(errorMessage);
        console.error('Error loading data:', err);
        setLoading(false);
        setLoadingAthletes(false);
      }
    };

    loadData();
  }, [id, isEditMode, athleteIdParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const injuryData = {
        ...formData,
        athleteID: parseInt(formData.athleteID, 10)
      };
      
      // If editing, add injury ID
      if (isEditMode) {
        injuryData.injuryID = parseInt(id, 10);
      }
      
      // Submit the form
      if (isEditMode) {
        await updateInjury(id, injuryData);
        navigate(`/injuries/${id}`);
      } else {
        const response = await addInjury(injuryData);
        // Navigate to the new injury's details page
        navigate(`/injuries/${response.data.injuryID}`);
      }
    } catch (err) {
      const errorMessage = isEditMode 
        ? 'Failed to update injury. Please try again later.' 
        : 'Failed to add injury. Please try again later.';
      
      setError(errorMessage);
      console.error('Error submitting form:', err);
      setSubmitting(false);
    }
  };

  if (loading || loadingAthletes) {
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
          <h2>{isEditMode ? 'Edit Injury' : 'Add New Injury'}</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="athleteID">
                  <Form.Label>Athlete</Form.Label>
                  <Form.Select
                    name="athleteID"
                    value={formData.athleteID}
                    onChange={handleChange}
                    required
                    disabled={!!athleteIdParam} // Disable if athleteId is provided in URL
                  >
                    <option value="">Select Athlete</option>
                    {athletes.map(athlete => (
                      <option key={athlete.athleteID} value={athlete.athleteID}>
                        {athlete.lastName}, {athlete.firstName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an athlete.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="dateOccurred">
                  <Form.Label>Date Occurred</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOccurred"
                    value={formData.dateOccurred}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Date is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="injuryType">
                  <Form.Label>Injury Type</Form.Label>
                  <Form.Select
                    name="injuryType"
                    value={formData.injuryType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Injury Type</option>
                    {injuryTypeOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an injury type.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="bodyPart">
                  <Form.Label>Body Part</Form.Label>
                  <Form.Select
                    name="bodyPart"
                    value={formData.bodyPart}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Body Part</option>
                    {bodyPartOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a body part.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="severity">
                  <Form.Label>Severity</Form.Label>
                  <Form.Select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                  >
                    <option value="">Select Severity</option>
                    {severityOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a status.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe how the injury occurred and any relevant details"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="treatmentNotes">
                  <Form.Label>Treatment Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="treatmentNotes"
                    value={formData.treatmentNotes}
                    onChange={handleChange}
                    placeholder="Initial treatment notes and recommendations"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="expectedRecoveryDate">
                  <Form.Label>Expected Recovery Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="expectedRecoveryDate"
                    value={formData.expectedRecoveryDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                as={Link} 
                to={athleteIdParam ? `/athletes/${athleteIdParam}` : "/injuries"} 
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
                  isEditMode ? 'Update Injury' : 'Add Injury'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InjuryForm;