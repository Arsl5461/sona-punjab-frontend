import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import {
  createMarqueeRequest,
  headlineApiPaths,
} from "./__request/MarqueeRequest";

const CreateMarqueeModal = ({ handleClose, show, getMarquees }) => {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) setText("");
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Enter headline text.");
      return;
    }
    try {
      setSaving(true);
      const response = await createMarqueeRequest({ text: trimmed });
      if (response?.success === false || response?.error) {
        toast.error(
          typeof response?.error === "string"
            ? response.error
            : `Could not create headline. Expected POST ${headlineApiPaths.create} on your server (or set REACT_APP_HEADLINE_CREATE in .env).`
        );
        return;
      }
      toast.success("Headline added.");
      await getMarquees();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create headline.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add headline</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Headline text</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Short message for the scrolling headline on home and club pages."
              maxLength={2000}
            />
            <Form.Text className="text-muted">
              {text.length} / 2000 characters
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateMarqueeModal;
