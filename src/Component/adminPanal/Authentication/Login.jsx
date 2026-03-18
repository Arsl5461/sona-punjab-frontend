import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userDataDispatcher } from "../../../redux/action";
import "./Login.css";
import { useDispatch } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(false); // To handle any error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        // `http://localhost:5005/sona-punjab/login`,
        `${process.env.REACT_APP_API}/sona-punjab/login`,
        formData
      );

      if (response?.status === 200) {
        const token = response.data.token;
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expirationTime.toString());

        setToken(token);
        const data = response.data.user;
        dispatch(userDataDispatcher(data));
        toast.success("User logged in Successfully");
        navigate("/dashboard");
      } else {
        toast.error("Incorrect username or password");
        setError(true);
      }
    } catch (err) {
      console.error("Error in Login Function", err);
      setError(true);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setToken(null);
    dispatch(userDataDispatcher(null));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 w-100 bg-white"
      style={{
        backgroundImage: "url('/Login_imge.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="d-flex align-items-center flex-column justify-content-center py-5 rounded-2 gap-3 login-form-container"
      >
        <div className="form-group">
          <label
            htmlFor="username"
            style={{ color: error ? "red" : "" }} // Set label color to red if there's an error
          >
            User Name
          </label>
          <input
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`} // Add is-invalid class if error is true
            id="username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter username"
            style={{ borderColor: error ? "red" : "" }} // Set border color to red if there's an error
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="password"
            style={{ color: error ? "red" : "" }} // Set label color to red if there's an error
          >
            Password
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${error ? "is-invalid" : ""}`} // Add is-invalid class if error is true
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={{ borderColor: error ? "red" : "" }} // Set border color to red if there's an error
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaRegEye
                className="position-absolute top-50 end-0 translate-middle fs-5 pointer"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
