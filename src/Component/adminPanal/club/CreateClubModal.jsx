import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { createClub } from "./__requests/ClubRequests";
import { toast } from "react-hot-toast";

const CreateClubModal = ({ show, onClose, onClubCreated }) => {
  const [clubName, setClubName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      setLoading(true);
      const response = await createClub(clubName);

      if (response.success) {
        setClubName("");
        toast.success("Club created successfully!");
        onClubCreated();
        onClose();
      } else {
        setError(response.message || "Failed to create club");
      }
    } catch (error) {
      setError("Error creating club");
      console.error("Error creating club:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Club</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Club Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter club name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateClubModal;
