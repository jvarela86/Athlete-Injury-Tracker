import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Common components
import Navbar from './components/common/Navbar';
import Home from './components/common/Home';
import NotFound from './components/common/NotFound';

// Athlete components
import AthleteList from './components/athletes/AthleteList';
import AthleteDetails from './components/athletes/AthleteDetails';
import AthleteForm from './components/athletes/AthleteForm';

// Injury components
import InjuryList from './components/injuries/InjuryList';
import InjuryDetails from './components/injuries/InjuryDetails';
import InjuryForm from './components/injuries/InjuryForm';

// Treatment components
import TreatmentList from './components/treatments/TreatmentList';
import TreatmentDetails from './components/treatments/TreatmentDetails';
import TreatmentForm from './components/treatments/TreatmentForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Container className="mt-3 mb-5">
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Home />} />
          
          {/* Athlete routes */}
          <Route path="/athletes" element={<AthleteList />} />
          <Route path="/athletes/:id" element={<AthleteDetails />} />
          <Route path="/athletes/add" element={<AthleteForm />} />
          <Route path="/athletes/edit/:id" element={<AthleteForm />} />
          
          {/* Injury routes */}
          <Route path="/injuries" element={<InjuryList />} />
          <Route path="/injuries/:id" element={<InjuryDetails />} />
          <Route path="/injuries/add" element={<InjuryForm />} />
          <Route path="/injuries/edit/:id" element={<InjuryForm />} />
          
          {/* Treatment routes */}
          <Route path="/treatments" element={<TreatmentList />} />
          <Route path="/treatments/:id" element={<TreatmentDetails />} />
          <Route path="/treatments/add" element={<TreatmentForm />} />
          <Route path="/treatments/edit/:id" element={<TreatmentForm />} />
          
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;