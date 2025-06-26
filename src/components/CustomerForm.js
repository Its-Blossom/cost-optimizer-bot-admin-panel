// src/components/CustomerForm.js
import React, { useState, useEffect } from "react";

const CustomerForm = ({ customer, onSubmit }) => {
  const isEditMode = !!customer;

  const [formData, setFormData] = useState({
    customer_id: "",
    role_arn: "",
    slack_webhook_url: "",
    email_address: "",
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        customer_id: customer.customer_id,
        role_arn: customer.role_arn || "",
        slack_webhook_url: customer.slack_webhook_url || "",
        email_address: customer.email_address || "",
      });
    }
  }, [customer, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // <- this triggers the parent's `handleEditSubmit`
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ color: "#fff" }}>{isEditMode ? "Edit Customer" : "Add New Customer"}</h2>

      <input
        type="text"
        name="customer_id"
        placeholder="Customer ID"
        value={formData.customer_id}
        onChange={handleChange}
        disabled={isEditMode} // Do not allow changing ID in edit mode
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
        required
      />

      <input
        type="email"
        name="email_address"
        placeholder="Email"
        value={formData.email_address}
        onChange={handleChange}
      />

      <button type="submit" style={{ background: "#36d7b7", border: "none", padding: "0.5rem" }}>
        {isEditMode ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default CustomerForm;
