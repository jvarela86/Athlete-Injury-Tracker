import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAthletes, deleteAthlete } from '../../services/api';
import { Button, Table, Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';

const AthleteList = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState(null);

  // Fetch athletes on component mount
  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      setLoading(true);
      const response = await getAllAthletes();
      setAthletes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load athletes. Please try again later.');
      console.error('Error loading athletes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (athlete) => {
    setAthleteToDelete(athlete);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setAthleteToDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAthlete(id);
      // Remove the deleted athlete from state
      setAthletes(athletes.filter(athlete => athlete.athleteID !== id));
      setShowDeleteConfirm(false);
      setAthleteToDelete(null);
    } catch (err) {
      setError('Failed to delete athlete. Please try again later.');
      console.error('Error deleting athlete:', err);
    }
  };

  // Filter athletes based on search term
  const filteredAthletes = athletes.filter(athlete => 
    athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (athlete.sport && athlete.sport.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (athlete.teamName && athlete.teamName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h2>Athletes</h2>
            </Col>
            <Col xs="auto">
              <Link to="/athletes/add" className="btn btn-primary">
                Add New Athlete
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
                placeholder="Search athletes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          {showDeleteConfirm && athleteToDelete && (
            <Alert variant="danger">
              <p>Are you sure you want to delete {athleteToDelete.firstName} {athleteToDelete.lastName}?</p>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleDelete(athleteToDelete.athleteID)}
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

          {filteredAthletes.length === 0 ? (
            <Alert variant="info">
              {searchTerm 
                ? "No athletes match your search criteria." 
                : "No athletes have been added yet."}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sport</th>
                    <th>Team</th>
                    <th>Position</th>
                    <th>Jersey #</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAthletes.map(athlete => (
                    <tr key={athlete.athleteID}>
                      <td>
                        <Link to={`/athletes/${athlete.athleteID}`}>
                          {athlete.lastName}, {athlete.firstName}
                        </Link>
                      </td>
                      <td>{athlete.sport || '-'}</td>
                      <td>{athlete.teamName || '-'}</td>
                      <td>{athlete.position || '-'}</td>
                      <td>{athlete.jerseyNumber || '-'}</td>
                      <td>
                        {athlete.status ? (
                          <Badge bg={getStatusBadgeColor(athlete.status)}>
                            {athlete.status}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/athletes/${athlete.athleteID}`} 
                          className="btn btn-sm btn-info me-1"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/athletes/edit/${athlete.athleteID}`} 
                          className="btn btn-sm btn-warning me-1"
                        >
                          Edit
                        </Link>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteConfirm(athlete)}
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

export default AthleteList;