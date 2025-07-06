import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import 'react-toastify/dist/ReactToastify.css';

// Wrapper to use navigate in CustomerForm
const CreateCustomerPage = () => {
  const navigate = useNavigate();

  const handleCreateCustomer = async (formData) => {
    try {
      const response = await fetch("https://apvgn11lf7.execute-api.us-east-1.amazonaws.com/Prod/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      await response.json();
      alert("Customer created successfully!");
      navigate("/customers/new"); // soft redirect using React Router
    } catch (err) {
      console.error("Error creating customer:", err);
      alert("Failed to create customer");
    }
  };

  return <CustomerForm onSubmit={handleCreateCustomer} />;
};

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
            <Route path="/customers/new" element={<CreateCustomerPage />} />
          </Route>
        )}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/customers" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
