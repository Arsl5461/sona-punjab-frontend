import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { updateClub } from './__requests/ClubRequests';
import { toast } from 'react-hot-toast';

const ClubEditModal = ({ show, onClose, club }) => {
  const [clubName, setClubName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (club) {
      setClubName(club.name);
    }
  }, [club]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateClub(club._id, { name: clubName.trim() });
      
      if (response.success) {
        toast.success(response.message || 'Club updated successfully');
        onClose();
      } else {
        toast.error(response.message || 'Failed to update club');
      }
    } catch (error) {
      toast.error('Something went wrong while updating club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Club</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="clubName" className="form-label">
              Club Name
            </label>
            <input
              type="text"
              className="form-control"
              id="clubName"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="Enter club name"
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ClubEditModal;
