import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import InvoiceGenerator from './components/InvoiceGenerator';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>
        <header style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', textAlign: 'center' }}>
          <h1>tor</h1>
          {isAuthenticated && (
            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px' }}>
              Logout
            </button>
          )}
        </header>

        <div style={{ padding: '20px' }}>
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={handleLogin} />} />
              <Route
                path="/"
                element={
                  <div style={{ textAlign: 'center' }}>
                    <h2>Welcome to the tor</h2>
                    <Link to="/login" style={{ margin: '10px' }}>
                      <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff' }}>
                        Login
                      </button>
                    </Link>
                    <Link to="/register" style={{ margin: '10px' }}>
                      <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff' }}>
                        Register
                      </button>
                    </Link>
                  </div>
                }
              />
            </Routes>
          ) : (
            <InvoiceGenerator />
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
