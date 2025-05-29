import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          ARMS Injury Tracker
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            
            <NavDropdown title="Athletes" id="athletes-dropdown">
              <NavDropdown.Item as={NavLink} to="/athletes">
                View All Athletes
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/athletes/add">
                Add New Athlete
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title="Injuries" id="injuries-dropdown">
              <NavDropdown.Item as={NavLink} to="/injuries">
                View All Injuries
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/injuries/add">
                Add New Injury
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title="Treatments" id="treatments-dropdown">
              <NavDropdown.Item as={NavLink} to="/treatments">
                View All Treatments
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/treatments/add">
                Add New Treatment
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;