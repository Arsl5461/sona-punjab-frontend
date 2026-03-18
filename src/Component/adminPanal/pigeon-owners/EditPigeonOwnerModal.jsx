import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  getSingleOwnerReq,
  updatePigeonOwnerReq,
} from "./__request/PigeonOwnersRequest";
import { toast } from "react-hot-toast";

const EditPigeonOwnerModal = ({
  handleClose,
  showEditOwner,
  ownerId,
  onUpdateSuccess,
}) => {
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

  const getSingleUser = async (ownerId) => {
    try {
      const response = await getSingleOwnerReq(ownerId);
      setFormData({
        name: response?.owner?.name || "",
        address: response?.owner?.address || "",
        ownerPicture: response?.owner?.ownerPicture || "",
        adminId: loginUser?._id,
        phone: response?.owner?.phone || "",
      });
      setImageSrc(response?.owner?.ownerPicture || null);
    } catch (err) {
      console.error("Error in getting single Owner", err);
    }
  };

  useEffect(() => {
    if (ownerId) {
      getSingleUser(ownerId);
    }
  }, [ownerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("address", formData.address);
      submitData.append("adminId", formData.adminId);
      submitData.append("phone", formData.phone);

      if (formData.ownerPicture instanceof File) {
        submitData.append("ownerPicture", formData.ownerPicture);
      }

      const response = await updatePigeonOwnerReq(ownerId, submitData);

      if (response?.owner) {
        onUpdateSuccess(response.owner);
        toast.success("Owner updated successfully!");
      }
      handleClose();
    } catch (error) {
      console.error("Error updating owner:", error);
      toast.error("Failed to update owner");
    }
  };

  return (
    <Modal
      show={showEditOwner}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>Edit Owner</Modal.Header>
      <Modal.Body>
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
          <div className="mb-3 d-flex align-items-center flex-column">
            <label htmlFor="tournamentPoster" className="form-label">
              Owner Image
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
              type="tel"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <small className="text-danger">{errors.phone}</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              City (Optional)
            </label>
            <input
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <small className="text-danger">{errors.address}</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPigeonOwnerModal;
