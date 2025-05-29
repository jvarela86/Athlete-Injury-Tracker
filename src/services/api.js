import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5018/api', // Adjust this to match your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Athletes API ---

// Get all athletes
export const getAllAthletes = () => {
  return api.get('/athletes');
};

// Get athlete by ID
export const getAthleteById = (id) => {
  return api.get(`/athletes/${id}`);
};

// Add new athlete
export const addAthlete = (athleteData) => {
  return api.post('/athletes', athleteData);
};

// Update athlete
export const updateAthlete = (id, athleteData) => {
  return api.put(`/athletes/${id}`, athleteData);
};

// Delete athlete
export const deleteAthlete = (id) => {
  return api.delete(`/athletes/${id}`);
};

// Search athletes
export const searchAthletes = (searchTerm) => {
  return api.get(`/athletes/search?term=${searchTerm}`);
};

// --- Injuries API ---

// Get all injuries
export const getAllInjuries = () => {
  return api.get('/injuries');
};

// Get injuries by athlete ID
export const getInjuriesByAthleteId = (athleteId) => {
  return api.get(`/injuries/athlete/${athleteId}`);
};

// Get injury by ID
export const getInjuryById = (id) => {
  return api.get(`/injuries/${id}`);
};

// Add new injury
export const addInjury = (injuryData) => {
  return api.post('/injuries', injuryData);
};

// Update injury
export const updateInjury = (id, injuryData) => {
  return api.put(`/injuries/${id}`, injuryData);
};

// Delete injury
export const deleteInjury = (id) => {
  return api.delete(`/injuries/${id}`);
};

// --- Treatments API ---

// Get all treatments
export const getAllTreatments = () => {
  return api.get('/treatments');
};

// Get treatments by injury ID
export const getTreatmentsByInjuryId = (injuryId) => {
  return api.get(`/treatments/injury/${injuryId}`);
};

// Get treatment by ID
export const getTreatmentById = (id) => {
  return api.get(`/treatments/${id}`);
};

// Add new treatment
export const addTreatment = (treatmentData) => {
  return api.post('/treatments', treatmentData);
};

// Update treatment
export const updateTreatment = (id, treatmentData) => {
  return api.put(`/treatments/${id}`, treatmentData);
};

// Delete treatment
export const deleteTreatment = (id) => {
  return api.delete(`/treatments/${id}`);
};

// Request interceptor for handling errors
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error('API Error Response:', error.response.data);
      
      // You can implement custom error handling here based on status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Error setting up the request
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;