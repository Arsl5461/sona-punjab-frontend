import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import {
  headlineApiPaths,
  updateMarqueeRequest,
} from "./__request/MarqueeRequest";

const EditMarqueeModal = ({ handleClose, show, row, getMarquees }) => {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show && row) {
      setText(row.text || "");
    }
    if (!show) setText("");
  }, [show, row]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Text cannot be empty.");
      return;
    }
    if (!row?._id) {
      toast.error("Missing headline id.");
      return;
    }
    try {
      setSaving(true);
      const response = await updateMarqueeRequest(row._id, { text: trimmed });
      if (response?.success === false || response?.error) {
        toast.error(
          typeof response?.error === "string"
            ? response.error
            : `Could not update. Expected PUT ${headlineApiPaths.updatePrefix}/:id (or REACT_APP_HEADLINE_UPDATE in .env).`
        );
        return;
      }
      toast.success("Headline updated.");
      await getMarquees();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update headline.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit headline</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Headline text</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Update"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditMarqueeModal;
