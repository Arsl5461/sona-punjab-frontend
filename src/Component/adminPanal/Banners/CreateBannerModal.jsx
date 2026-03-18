import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import "./AllBannersList.css";
import { CreateBannerRequest } from "./__request/BannerRequest";
import { toast } from "react-hot-toast";
const CreateBannerModal = ({ handleClose, showCraeteBanner, getBanners }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // To store the selected file
  const [isUploading, setIsUploading] = useState(false); // To handle upload state
  const fileInputRef = useRef();

  const handleDivClick = () => {
    if (imageSrc) {
      setImageSrc(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [formData, setFormData] = useState({
    bannerPicture: "",
  });

  const CraeteBanner = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload!");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("bannerPicture", selectedFile); // Append the file with a key name

      // Set the selected image as bannerPicture
      setFormData((prevFormData) => ({
        ...prevFormData,
        bannerPicture: imageSrc, // Set the banner picture to the selected image
      }));

      // You can now send formData along with other form data
      const response = await CreateBannerRequest(formData);
      setImageSrc(null);
      toast.success("Banner created successfully!");
      await getBanners();
      // Handle success
      handleClose(); // Close the modal on success
    } catch (err) {
      console.error("Error in creating Banner", err);
      alert("Failed to upload the banner. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      show={showCraeteBanner}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>Create Banner</Modal.Header>
      <Modal.Body>
        <div className="w-100 d-flex align-items-center justify-content-center">
          <div
            className="border-1 border-secondary rounded-2 w-100 d-flex align-items-center justify-content-center overflow-hidden"
            style={{ height: "150px", cursor: "pointer" }}
            onClick={handleDivClick}
          >
            {imageSrc ? (
              <div className="Conatiner-Tournament-poster">
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="Tournament-poster"
                />
                <span className="Remove-Tournament-poster">
                  <IoTrashOutline />
                </span>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <FaPlus className="fs-4 text-secondary " />
              </>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={CraeteBanner} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBannerModal;
