import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";
import CustomerForm from "./CustomerForm"; // ✅ Make sure this file exists and is correctly named
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
    fetch("https://pp4lxb664h.execute-api.us-east-1.amazonaws.com/Prod/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
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

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditSubmit = (updatedCustomer) => {
    fetch(`https://pp4lxb664h.execute-api.us-east-1.amazonaws.com/Prod/customers/${updatedCustomer.customer_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCustomer),
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
              <span>
                <strong>ID:</strong> {customer.customer_id} |{" "}
                <strong>Email:</strong> {customer.email_address}
              </span>
              <button style={styles.editButton} onClick={() => openModal(customer)}>Edit</button>
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
        <button onClick={closeModal} style={styles.closeButton} aria-label="Close modal">
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
    padding: "2rem",
    backgroundColor: "#121212",
    minHeight: "100vh",
    color: "#fff",
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
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
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
