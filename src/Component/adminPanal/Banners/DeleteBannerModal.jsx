import React from "react";
import { Button, Modal } from "react-bootstrap";
import { deleteBannerRequest } from "./__request/BannerRequest";
import { toast } from "react-hot-toast";

const DeleteBannerModal = ({ handleClose, showDelete, banner, getBanners }) => {
  const deleteBanner = async (id) => {
    try {
      const response = await deleteBannerRequest(id);
      if (response.success) {
        toast.success("Banner deleted successfully!");
        await getBanners();
        handleClose();
      }
    } catch (err) {
      console.erroe("Error in deleting Banner", err);
    }
  };

  return (
    <Modal
      show={showDelete}
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
          >
            <div className="Conatiner-Tournament-poster">
              <img
                src={banner?.bannerPicture}
                alt="Preview"
                className="Tournament-poster"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            deleteBanner(banner?._id);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBannerModal;
