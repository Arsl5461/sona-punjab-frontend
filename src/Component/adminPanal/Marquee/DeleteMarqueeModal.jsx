import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { deleteMarqueeRequest } from "./__request/MarqueeRequest";

const DeleteMarqueeModal = ({ handleClose, show, row, getMarquees }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!row?._id) {
      toast.error("Missing headline id.");
      return;
    }
    try {
      setDeleting(true);
      const response = await deleteMarqueeRequest(row._id);
      if (response?.success === false && response?.error) {
        toast.error(String(response.error));
        return;
      }
      toast.success("Headline deleted.");
      await getMarquees();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete headline.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete headline</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">Remove this line from the public headline strip?</p>
        <div
          className="p-3 rounded border bg-light text-break small"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {row?.text || "—"}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteMarqueeModal;
