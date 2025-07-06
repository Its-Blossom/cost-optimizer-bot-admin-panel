import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";
import CustomerForm from "./CustomerForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
const API_BASE_URL = "https://apvgn11lf7.execute-api.us-east-1.amazonaws.com/Prod";

Modal.setAppElement("#root");

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    fetch("https://apvgn11lf7.execute-api.us-east-1.amazonaws.com/Prod/customers")
      .then((res) => res.json())
      .then((data) => {
        const activeCustomers = Array.isArray(data)
          ? data.filter((customer) => customer.status === "active")
          : [];
        setCustomers(activeCustomers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setLoading(false);
      });
  };

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setModalIsOpen(true);
  };

  const handleDeactivate = async (customer) => {
    const isReactivating = customer.status === "inactive";
    const actionText = isReactivating ? "Reactivate" : "Deactivate";

    if (!window.confirm(`${actionText} ${customer.name}?`)) return;

    try {
      const newStatus = isReactivating ? "active" : "inactive";

      await fetch(`${API_BASE_URL}/customers/${customer.customer_id}/deactivate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      toast.success(`Customer ${actionText.toLowerCase()}d`);
      fetchCustomers();
    } catch (err) {
      toast.error(`Failed to ${actionText.toLowerCase()} customer`);
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Permanently delete ${customer.name}?`)) return;
    try {
      await fetch(`${API_BASE_URL}/customers/${customer.customer_id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
      },
      });
      toast.success("Customer deleted");
      fetchCustomers(); // refresh list
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditSubmit = (customerData) => {
    fetch(`https://apvgn11lf7.execute-api.us-east-1.amazonaws.com/Prod/customers/${customerData.customer_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        fetchCustomers();
        closeModal();
      })
      .catch((err) => {
        console.error("Failed to update customer:", err);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Customer List</h2>
      {loading ? (
        <div style={styles.loader}>
          <ClipLoader size={50} color="#36d7b7" />
        </div>
      ) : (
        <ul style={styles.list}>
          {customers.map((customer) => (
            <li key={customer.customer_id} style={styles.listItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <span style={{ flex: 1 }}>
                  <strong>ID:</strong> {customer.customer_id} |{" "}
                  <strong>Email:</strong> {customer.email_address} |{" "}
                  <strong>Status:</strong>{" "}
                  <span style={customer.status === "inactive" ? styles.statusInactive : styles.statusActive}>
                    {customer.status || "unknown"}
                  </span>
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                    justifyContent: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <button style={styles.editButton} onClick={() => openModal(customer)}>Edit</button>
                  <button
                    style={styles.inactiveButton}
                    onClick={() => handleDeactivate(customer)}
                    title={customer.status === "inactive" ? "Reactivate" : "Deactivate"}
                  >
                    {customer.status === "inactive" ? "Reactivate" : "Deactivate"}
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(customer)} title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Customer Modal"
        style={modalStyles}
      >
        <button onClick={closeModal} style={styles.closeButton}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleEditSubmit}
        />
      </Modal>
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",   // center horizontally
    padding: "20px",
  },
  header: {
    textAlign: "center",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#1f1f1f",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#36d7b7",
    color: "#000",
    border: "nonde",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336", // red
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px px",
    cursor: "pointer",
    marginRight: "8px",
  },
  inactiveButton: {
    backgroundColor: "#ff9800", // orange
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    marginRight: "1px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "1.5rem",
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    zIndex: 1001,
  },
  statusActive: {
    color: "lightgreen",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "#f44336",
    fontWeight: "bold",
  }
};

const modalStyles = {
  content: {
    backgroundColor: "#1f1f1f",
    color: "#fff",
    borderRadius: "10px",
    padding: "2rem",
    maxWidth: "700px",
    width: "90%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

export default CustomerList;
