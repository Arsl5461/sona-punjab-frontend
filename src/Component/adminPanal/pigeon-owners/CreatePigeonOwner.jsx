import React, { useRef, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { createPigeonOwnerrequest } from "./__request/PigeonOwnersRequest";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CreatePigeonOwner = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  const loginUser = useSelector((state) => state.userDataReducer);

  const [formData, setFormData] = useState({
    ownerPicture: "",
    name: "",
    adminId: loginUser?._id,
    address: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "User name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDivClick = () => {
    if (imageSrc) {
      setImageSrc(null);
      setFormData({
        ...formData,
        ownerPicture: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({
        ...formData,
        ownerPicture: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, ownerPicture: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const createPigeonOwners = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await createPigeonOwnerrequest(formData);
      if (response) {
        setFormData({
          ownerPicture: "",
          name: "",
          adminId: loginUser?._id,
          address: "",
          phone: "",
        });
        setImageSrc(null);
        toast.success("Pigeon owner created successfully!");
      }
    } catch (err) {
      console.error("Error in creating Pigeon Owners", err);
      toast.error("Failed to create pigeon owner. Please try again.");
    }
  };

  return (
    <MasterLayout>
      <div className="w-100 d-flex align-items-center justify-content-center">
        <div className="w-75 color-mode p-5 rounded-2">
          <form className="d-flex flex-column" onSubmit={createPigeonOwners}>
            <div className="mb-3 d-flex align-items-center flex-column">
              <label htmlFor="tournamentPoster" className="form-label">
                Owner Image (Optional)
              </label>
              <input
                type="file"
                className="d-none"
                id="tournamentPoster"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div
                className={`border-secondary border-1 rounded-2 d-flex align-items-center justify-content-center overflow-hidden`}
                style={{ height: "180px", width: "180px", cursor: "pointer" }}
                onClick={handleDivClick}
              >
                {imageSrc ? (
                  <div className="Conatiner-Tournament-poster">
                    <img
                      src={imageSrc}
                      alt="Preview"
                      className="Tournament-poster"
                    />
                    <span
                      className="Remove-Tournament-poster"
                      onClick={handleDivClick}
                    >
                      <IoTrashOutline />
                    </span>
                  </div>
                ) : (
                  <FaPlus className="fs-3" />
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number (Optional)
              </label>
              <input
                type="number"
                className={`form-control`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onwheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                City (Optional)
              </label>
              <input
                type="text"
                className={`form-control`}
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default CreatePigeonOwner;
