import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllInjuries, getInjuriesByAthleteId, deleteInjury } from '../../services/api';
import { Button, Table, Container, Row, Col, Card, Badge, Spinner, Alert, Form } from 'react-bootstrap';

const InjuryList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const athleteIdParam = queryParams.get('athleteId');

  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [injuryToDelete, setInjuryToDelete] = useState(null);
  const [filterByAthlete, setFilterByAthlete] = useState(athleteIdParam || '');

  // Fetch injuries on component mount
  useEffect(() => {
    loadInjuries();
  }, [filterByAthlete]);

  const loadInjuries = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filterByAthlete) {
        response = await getInjuriesByAthleteId(filterByAthlete);
      } else {
        response = await getAllInjuries();
      }
      
      setInjuries(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load injuries. Please try again later.');
      console.error('Error loading injuries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (injury) => {
    setInjuryToDelete(injury);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setInjuryToDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteInjury(id);
      // Remove the deleted injury from state
      setInjuries(injuries.filter(injury => injury.injuryID !== id));
      setShowDeleteConfirm(false);
      setInjuryToDelete(null);
    } catch (err) {
      setError('Failed to delete injury. Please try again later.');
      console.error('Error deleting injury:', err);
    }
  };

  // Filter injuries based on search term
  const filteredInjuries = injuries.filter(injury => {
    const searchText = searchTerm.toLowerCase();
    return (
      (injury.injuryType && injury.injuryType.toLowerCase().includes(searchText)) ||
      (injury.bodyPart && injury.bodyPart.toLowerCase().includes(searchText)) ||
      (injury.description && injury.description.toLowerCase().includes(searchText)) ||
      (injury.athleteName && injury.athleteName.toLowerCase().includes(searchText))
    );
  });

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
              <h2>Injuries {filterByAthlete && '(Filtered by Athlete)'}</h2>
            </Col>
            <Col xs="auto">
              <Link 
                to={filterByAthlete ? `/injuries/add?athleteId=${filterByAthlete}` : "/injuries/add"} 
                className="btn btn-primary"
              >
                Add New Injury
              </Link>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search injuries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
              />
            </Col>
            {!filterByAthlete && (
              <Col md={6} className="text-md-end">
                <Link to="/athletes" className="btn btn-outline-secondary">
                  View All Athletes
                </Link>
              </Col>
            )}
            {filterByAthlete && (
              <Col md={6} className="text-md-end">
                <Link to="/injuries" className="btn btn-outline-secondary">
                  Show All Injuries
                </Link>
              </Col>
            )}
          </Row>

          {showDeleteConfirm && injuryToDelete && (
            <Alert variant="danger">
              <p>Are you sure you want to delete this injury record?</p>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleDelete(injuryToDelete.injuryID)}
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

          {filteredInjuries.length === 0 ? (
            <Alert variant="info">
              {searchTerm 
                ? "No injuries match your search criteria." 
                : filterByAthlete
                  ? "No injuries recorded for this athlete."
                  : "No injuries have been recorded yet."}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Athlete</th>
                    <th>Injury Type</th>
                    <th>Body Part</th>
                    <th>Date</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInjuries.map(injury => (
                    <tr key={injury.injuryID}>
                      <td>
                        <Link to={`/athletes/${injury.athleteID}`}>
                          {injury.athleteName || 'Unknown Athlete'}
                        </Link>
                      </td>
                      <td>{injury.injuryType || '-'}</td>
                      <td>{injury.bodyPart || '-'}</td>
                      <td>{formatDate(injury.dateOccurred)}</td>
                      <td>
                        {injury.severity && (
                          <Badge bg={getSeverityBadgeColor(injury.severity)}>
                            {injury.severity}
                          </Badge>
                        )}
                      </td>
                      <td>
                        {injury.status && (
                          <Badge bg={getStatusBadgeColor(injury.status)}>
                            {injury.status}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/injuries/${injury.injuryID}`} 
                          className="btn btn-sm btn-info me-1"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/injuries/edit/${injury.injuryID}`} 
                          className="btn btn-sm btn-warning me-1"
                        >
                          Edit
                        </Link>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteConfirm(injury)}
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

export default InjuryList;