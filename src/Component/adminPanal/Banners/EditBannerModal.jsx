import React, { useRef, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import "./AllBannersList.css";
import { updateBannerRequest } from "./__request/BannerRequest";
import { toast } from "react-hot-toast";

const EditBannerModal = ({ handleClose, showEdit, banner, getBanners }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (showEdit && banner?.bannerPicture) {
      setImageSrc(banner.bannerPicture);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    if (!showEdit) {
      setImageSrc(null);
      setSelectedFile(null);
    }
  }, [showEdit, banner]);

  const handleDivClick = () => {
    if (selectedFile || (imageSrc && imageSrc !== banner?.bannerPicture)) {
      setImageSrc(banner?.bannerPicture || null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const saveBanner = async () => {
    if (!banner?._id) {
      toast.error("Banner id is missing.");
      return;
    }
    if (!selectedFile) {
      toast.error("Choose a new image to replace this slide, or cancel.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("bannerPicture", selectedFile);
      const response = await updateBannerRequest(banner._id, formData);
      if (response?.error && !response?.success) {
        toast.error(
          typeof response.error === "string"
            ? response.error
            : "Could not update banner. Ensure the API supports PUT /sona-punjab/banner/:id with multipart bannerPicture."
        );
        return;
      }
      toast.success("Banner updated.");
      await getBanners();
      handleClose();
    } catch (err) {
      console.error("Error updating banner", err);
      toast.error("Failed to update banner.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal show={showEdit} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>Replace home slider image</Modal.Header>
      <Modal.Body>
        <div className="w-100 d-flex align-items-center justify-content-center">
          <div
            className="border-1 border-secondary rounded-2 w-100 d-flex align-items-center justify-content-center overflow-hidden"
            style={{ height: "150px", cursor: "pointer" }}
            onClick={handleDivClick}
          >
            {imageSrc ? (
              <div className="Conatiner-Tournament-poster">
                <img src={imageSrc} alt="Preview" className="Tournament-poster" />
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
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <FaPlus className="fs-4 text-secondary " />
              </>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveBanner} disabled={isUploading}>
          {isUploading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBannerModal;
