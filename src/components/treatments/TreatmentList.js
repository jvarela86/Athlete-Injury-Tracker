import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllTreatments, getTreatmentsByInjuryId, deleteTreatment } from '../../services/api';
import { Button, Table, Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';

const TreatmentList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const injuryIdParam = queryParams.get('injuryId');

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);

  // Fetch treatments on component mount
  useEffect(() => {
    loadTreatments();
  }, [injuryIdParam]);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      let response;
      
      if (injuryIdParam) {
        response = await getTreatmentsByInjuryId(injuryIdParam);
      } else {
        response = await getAllTreatments();
      }
      
      setTreatments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load treatments. Please try again later.');
      console.error('Error loading treatments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (treatment) => {
    setTreatmentToDelete(treatment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setTreatmentToDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTreatment(id);
      // Remove the deleted treatment from state
      setTreatments(treatments.filter(treatment => treatment.treatmentID !== id));
      setShowDeleteConfirm(false);
      setTreatmentToDelete(null);
    } catch (err) {
      setError('Failed to delete treatment. Please try again later.');
      console.error('Error deleting treatment:', err);
    }
  };

  // Filter treatments based on search term
  const filteredTreatments = treatments.filter(treatment => {
    const searchText = searchTerm.toLowerCase();
    return (
      (treatment.treatmentType && treatment.treatmentType.toLowerCase().includes(searchText)) ||
      (treatment.provider && treatment.provider.toLowerCase().includes(searchText)) ||
      (treatment.result && treatment.result.toLowerCase().includes(searchText)) ||
      (treatment.athleteName && treatment.athleteName.toLowerCase().includes(searchText)) ||
      (treatment.injuryDescription && treatment.injuryDescription.toLowerCase().includes(searchText))
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h2>Treatments {injuryIdParam && '(Filtered by Injury)'}</h2>
            </Col>
            <Col xs="auto">
              <Link 
                to={injuryIdParam ? `/treatments/add?injuryId=${injuryIdParam}` : "/treatments/add"} 
                className="btn btn-primary"
              >
                Add New Treatment
              </Link>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row className="mb-3">
            <Col md={6}>
              <input
                type="text"
                className="form-control"
                placeholder="Search treatments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            {!injuryIdParam && (
              <Col md={6} className="text-md-end">
                <Link to="/injuries" className="btn btn-outline-secondary">
                  View All Injuries
                </Link>
              </Col>
            )}
            {injuryIdParam && (
              <Col md={6} className="text-md-end">
                <Link to={`/injuries/${injuryIdParam}`} className="btn btn-outline-secondary me-2">
                  Back to Injury
                </Link>
                <Link to="/treatments" className="btn btn-outline-secondary">
                  Show All Treatments
                </Link>
              </Col>
            )}
          </Row>

          {showDeleteConfirm && treatmentToDelete && (
            <Alert variant="danger">
              <p>Are you sure you want to delete this treatment record?</p>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleDelete(treatmentToDelete.treatmentID)}
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

          {filteredTreatments.length === 0 ? (
            <Alert variant="info">
              {searchTerm 
                ? "No treatments match your search criteria." 
                : injuryIdParam
                  ? "No treatments recorded for this injury."
                  : "No treatments have been recorded yet."}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Treatment Type</th>
                    <th>Provider</th>
                    <th>Athlete</th>
                    <th>Injury</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTreatments.map(treatment => (
                    <tr key={treatment.treatmentID}>
                      <td>{formatDate(treatment.treatmentDate)}</td>
                      <td>{treatment.treatmentType || '-'}</td>
                      <td>{treatment.provider || '-'}</td>
                      <td>
                        <Link to={`/athletes/${treatment.athleteID}`}>
                          {treatment.athleteName || 'Unknown'}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/injuries/${treatment.injuryID}`}>
                          {treatment.injuryDescription || 'Unknown'}
                        </Link>
                      </td>
                      <td>
                        {treatment.result && (
                          <Badge bg={getResultBadgeColor(treatment.result)}>
                            {treatment.result}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/treatments/${treatment.treatmentID}`} 
                          className="btn btn-sm btn-info me-1"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/treatments/edit/${treatment.treatmentID}`} 
                          className="btn btn-sm btn-warning me-1"
                        >
                          Edit
                        </Link>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteConfirm(treatment)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TreatmentList;