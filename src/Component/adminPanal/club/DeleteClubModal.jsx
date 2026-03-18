import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { deleteClub } from "./__requests/ClubRequests";
import { toast } from "react-hot-toast";
const DeleteClubModal = ({ show, onClose, clubId, clubName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError(""); // Clear previous error
    try {
      setLoading(true);
      const response = await deleteClub(clubId);

      if (response.success) {
        toast.success("Club deleted successfully!");
        onClose();
      } else {
        setError(response.message || "Failed to delete club");
      }
    } catch (error) {
      setError("Error deleting club");
      console.error("Error deleting club:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Club</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <p>
          Are you sure you want to delete "{clubName}"? This action cannot be
          undone.
        </p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteClubModal;
