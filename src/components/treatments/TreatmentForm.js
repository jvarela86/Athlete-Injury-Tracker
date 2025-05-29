import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  getTreatmentById, 
  addTreatment, 
  updateTreatment, 
  getAllInjuries, 
  getInjuryById
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

const TreatmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const injuryIdParam = queryParams.get('injuryId');

  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    injuryID: injuryIdParam || '',
    treatmentDate: '',
    treatmentType: '',
    provider: '',
    facility: '',
    notes: '',
    result: '',
    recommendations: '',
    followUpRequired: false,
    followUpDate: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [injuries, setInjuries] = useState([]);
  const [loadingInjuries, setLoadingInjuries] = useState(true);
  const [selectedInjuryDetails, setSelectedInjuryDetails] = useState(null);

  // Options for dropdowns
  const treatmentTypeOptions = [
    'Physical Therapy', 'Surgery', 'Medication', 'Massage',
    'Acupuncture', 'Chiropractic', 'Ice/Heat', 'Rest',
    'Rehabilitation Exercise', 'Stretching', 'Taping/Bracing',
    'Cortisone Injection', 'Ultrasound', 'Electrical Stimulation', 'Other'
  ];
  
  const resultOptions = [
    'Excellent - Complete Recovery', 'Good - Significant Improvement',
    'Moderate - Partial Improvement', 'Poor - Minimal Improvement',
    'No Change', 'Worse', 'Too Early to Assess'
  ];

  // Load injuries and treatment data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load injuries list
        setLoadingInjuries(true);
        const injuriesResponse = await getAllInjuries();
        setInjuries(injuriesResponse.data);
        setLoadingInjuries(false);

        // If injuryIdParam is provided, load injury details
        if (injuryIdParam) {
          try {
            const injuryResponse = await getInjuryById(injuryIdParam);
            setSelectedInjuryDetails(injuryResponse.data);
          } catch (err) {
            console.error('Error loading injury details:', err);
          }
        }

        // If in edit mode, load treatment data
        if (isEditMode) {
          const treatmentResponse = await getTreatmentById(id);
          const treatment = treatmentResponse.data;
          
          // Format dates for input fields (YYYY-MM-DD)
          const formattedTreatmentDate = treatment.treatmentDate 
            ? new Date(treatment.treatmentDate).toISOString().split('T')[0]
            : '';
          
          const formattedFollowUpDate = treatment.followUpDate 
            ? new Date(treatment.followUpDate).toISOString().split('T')[0]
            : '';
          
          setFormData({
            injuryID: treatment.injuryID || '',
            treatmentDate: formattedTreatmentDate,
            treatmentType: treatment.treatmentType || '',
            provider: treatment.provider || '',
            facility: treatment.facility || '',
            notes: treatment.notes || '',
            result: treatment.result || '',
            recommendations: treatment.recommendations || '',
            followUpRequired: treatment.followUpRequired || false,
            followUpDate: formattedFollowUpDate
          });

          // Load selected injury details
          if (treatment.injuryID) {
            try {
              const injuryResponse = await getInjuryById(treatment.injuryID);
              setSelectedInjuryDetails(injuryResponse.data);
            } catch (err) {
              console.error('Error loading injury details:', err);
            }
          }
          
          setLoading(false);
        }
      } catch (err) {
        const errorMessage = isEditMode 
          ? 'Failed to load treatment data. Please try again later.' 
          : 'Failed to load injuries. Please try again later.';
        
        setError(errorMessage);
        console.error('Error loading data:', err);
        setLoading(false);
        setLoadingInjuries(false);
      }
    };

    loadData();
  }, [id, isEditMode, injuryIdParam]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // If injury changes, load the new injury details
    if (name === 'injuryID' && value) {
      const loadInjuryDetails = async () => {
        try {
          const injuryResponse = await getInjuryById(value);
          setSelectedInjuryDetails(injuryResponse.data);
        } catch (err) {
          console.error('Error loading injury details:', err);
          setSelectedInjuryDetails(null);
        }
      };
      
      loadInjuryDetails();
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
      const treatmentData = {
        ...formData,
        injuryID: parseInt(formData.injuryID, 10),
        followUpRequired: Boolean(formData.followUpRequired)
      };
      
      // If editing, add treatment ID
      if (isEditMode) {
        treatmentData.treatmentID = parseInt(id, 10);
      }
      
      // Submit the form
      if (isEditMode) {
        await updateTreatment(id, treatmentData);
        navigate(`/treatments/${id}`);
      } else {
        const response = await addTreatment(treatmentData);
        // Navigate to the new treatment's details page
        navigate(`/treatments/${response.data.treatmentID}`);
      }
    } catch (err) {
      const errorMessage = isEditMode 
        ? 'Failed to update treatment. Please try again later.' 
        : 'Failed to add treatment. Please try again later.';
      
      setError(errorMessage);
      console.error('Error submitting form:', err);
      setSubmitting(false);
    }
  };

  if (loading || loadingInjuries) {
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
          <h2>{isEditMode ? 'Edit Treatment' : 'Add New Treatment'}</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {selectedInjuryDetails && (
            <Alert variant="info" className="mb-4">
              <strong>Selected Injury:</strong> {selectedInjuryDetails.injuryType} - {selectedInjuryDetails.bodyPart} for{' '}
              <Link to={`/athletes/${selectedInjuryDetails.athleteID}`}>
                {selectedInjuryDetails.athleteName || 'Unknown Athlete'}
              </Link>
            </Alert>
          )}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="injuryID">
                  <Form.Label>Injury</Form.Label>
                  <Form.Select
                    name="injuryID"
                    value={formData.injuryID}
                    onChange={handleChange}
                    required
                    disabled={!!injuryIdParam} // Disable if injuryId is provided in URL
                  >
                    <option value="">Select Injury</option>
                    {injuries.map(injury => (
                      <option key={injury.injuryID} value={injury.injuryID}>
                        {injury.injuryType} - {injury.bodyPart} ({injury.athleteName})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an injury.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="treatmentDate">
                  <Form.Label>Treatment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="treatmentDate"
                    value={formData.treatmentDate}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Treatment date is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="treatmentType">
                  <Form.Label>Treatment Type</Form.Label>
                  <Form.Select
                    name="treatmentType"
                    value={formData.treatmentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Treatment Type</option>
                    {treatmentTypeOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a treatment type.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="result">
                  <Form.Label>Result</Form.Label>
                  <Form.Select
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                  >
                    <option value="">Select Result</option>
                    {resultOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="provider">
                  <Form.Label>Provider</Form.Label>
                  <Form.Control
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    placeholder="Enter provider name"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="facility">
                  <Form.Label>Facility</Form.Label>
                  <Form.Control
                    type="text"
                    name="facility"
                    value={formData.facility}
                    onChange={handleChange}
                    placeholder="Enter facility name"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter detailed treatment notes"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="recommendations">
                  <Form.Label>Recommendations</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleChange}
                    placeholder="Enter recommendations for future care"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="followUpRequired">
                  <Form.Check
                    type="checkbox"
                    label="Follow-up Required"
                    name="followUpRequired"
                    checked={formData.followUpRequired}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              {formData.followUpRequired && (
                <Col md={6}>
                  <Form.Group controlId="followUpDate">
                    <Form.Label>Follow-up Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="followUpDate"
                      value={formData.followUpDate}
                      onChange={handleChange}
                      required={formData.followUpRequired}
                    />
                    <Form.Control.Feedback type="invalid">
                      Follow-up date is required when follow-up is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                as={Link} 
                to={injuryIdParam ? `/injuries/${injuryIdParam}` : "/treatments"} 
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
                  isEditMode ? 'Update Treatment' : 'Add Treatment'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TreatmentForm;