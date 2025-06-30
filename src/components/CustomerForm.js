import React, { useState, useEffect } from 'react';
import './CustomerForm.css';

function CustomerForm({ customer = null, onSubmit }) {
  const [formData, setFormData] = useState({
    customer_id: '',
    role_arn: '',
    slack_webhook_url: '',
    email_address: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_id: customer.customer_id || '',
        role_arn: customer.role_arn || '',
        slack_webhook_url: customer.slack_webhook_url || '',
        email_address: customer.email_address || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (onSubmit) {
      // Edit mode
      onSubmit(formData);
      return;
    }

    // Add mode (fallback)
    console.warn("No onSubmit prop provided — using default add logic");

    try {
      const response = await fetch("https://pp4lxb664h.execute-api.us-east-1.amazonaws.com/Prod/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      const result = await response.json();
      console.log("Customer created:", result);
      alert("Customer created successfully!");
    } catch (err) {
      console.error("Error creating customer:", err);
      alert("Failed to create customer. Check console for details.");
    }
  };

  return (
    <div className="customer-form-wrapper">
      <h2 className="form-title">{customer ? "Edit Customer" : "Add New Customer"}</h2>
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="customer_id"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role_arn"
          placeholder="Role ARN"
          value={formData.role_arn}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="slack_webhook_url"
          placeholder="Slack Webhook URL"
          value={formData.slack_webhook_url}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email_address"
          placeholder="Email"
          value={formData.email_address}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CustomerForm;
