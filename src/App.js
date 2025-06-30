import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import Navbar from './components/Navbar';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin onLogin={() => setIsAuthenticated(true)} />} />
        {isAuthenticated && (
          <Route element={<AdminLayout />}>
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
          </Route>
        )}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/customers" : "/login"} />} />
      </Routes>
    </Router>
  );


}

export default App;
