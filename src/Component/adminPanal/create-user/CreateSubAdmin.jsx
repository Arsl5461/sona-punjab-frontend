import React, { useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Form } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

const CreateSubAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "subadmin",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API}/sona-punjab/register`,
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("User registered successfully");
      setFormData({
        name: "",
        phone: "",
        role: "subadmin",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglepassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  const toggleConfirmpassword = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <MasterLayout>
      <div className="w-100 d-flex align-items-center justify-content-center">
        <div className="w-75 color-mode p-5 rounded-2">
          <form className="d-flex flex-column" onSubmit={handleRegisterUser}>
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
                Phone (Optional)
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
                    onClick={togglepassword}
                  />
                ) : (
                  <FaRegEye
                    className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                    onClick={togglepassword}
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
                    onClick={toggleConfirmpassword}
                  />
                ) : (
                  <FaRegEye
                    className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                    onClick={toggleConfirmpassword}
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default CreateSubAdmin;
