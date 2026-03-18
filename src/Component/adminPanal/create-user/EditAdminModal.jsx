import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { updateUsersRequest } from "./__request/GetAllUsersRequest";

const EditAdminModal = ({ show, onClose, admin, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        phone: admin.phone || "",
        password: admin.password || "",
        role: admin.role || "",
        confirmPassword: admin.password || "",
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const dataToSend = {};
      if (formData.name !== admin.name) dataToSend.name = formData.name;
      if (formData.password !== admin.password)
        dataToSend.password = formData.password;
      if (formData.phone !== admin.phone) dataToSend.phone = formData.phone;
      if (formData.role !== admin.role) dataToSend.role = formData.role;

      // Check if there are any changes
      if (Object.keys(dataToSend).length === 0) {
        toast.error("No changes made!");
        return;
      }

      if (!admin?._id) {
        toast.error("Admin ID is missing!");
        return;
      }

      const response = await updateUsersRequest(admin?._id, dataToSend);

      if (response.success) {
        toast.success("Admin updated successfully!");
        if (onUpdate) {
          await onUpdate();
        }
        onClose();
      } else {
        toast.error(response.message || "Failed to update admin");
      }
    } catch (error) {
      console.error("Error in update:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              User Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="number"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{
                backgroundPosition: "right 0.75rem center",
                paddingRight: "2.25rem",
              }}
            >
              <option value="subadmin">Sub Admin</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {showPassword ? (
                <FaRegEyeSlash
                  className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                  onClick={togglePassword}
                />
              ) : (
                <FaRegEye
                  className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                  onClick={togglePassword}
                />
              )}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {showConfirmPassword ? (
                <FaRegEyeSlash
                  className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                  onClick={toggleConfirmPassword}
                />
              ) : (
                <FaRegEye
                  className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                  onClick={toggleConfirmPassword}
                />
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAdminModal;
