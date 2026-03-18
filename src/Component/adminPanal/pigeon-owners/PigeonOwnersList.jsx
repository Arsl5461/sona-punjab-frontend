import React, { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { Link } from "react-router-dom";
import {
  deletePigeonOwnerReq,
  getPigeonOwnersReq,
} from "./__request/PigeonOwnersRequest";
import { useSelector } from "react-redux";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import EditPigeonOwnerModal from "./EditPigeonOwnerModal";
import { Modal, Button } from "react-bootstrap";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-hot-toast";

const PigeonOwnersList = () => {
  const loginUser = useSelector((state) => state.userDataReducer);
  const [pigeonOwners, setPigeonOwners] = useState();
  const [ownerId, setOwnerId] = useState();
  const [showEditOwner, setShowEditOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleCloseEditOwner = () => setShowEditOwner(false);
  const handleShowEditOwner = () => setShowEditOwner(true);
  const getPigeonOwners = async () => {
    try {
      setLoading(true);
      const response = await getPigeonOwnersReq();
      setPigeonOwners(response?.owner);
    } catch (err) {
      console.error("Error in getting Pigeon Owners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPigeonOwners();
  }, []);

  const handleDeleteOwner = async (PigeonOwnerId) => {
    try {
      const response = await deletePigeonOwnerReq(PigeonOwnerId);
      if (response) {
        setPigeonOwners((prevOwners) =>
          prevOwners.filter((owner) => owner._id !== PigeonOwnerId)
        );
      }
    } catch (err) {
      console.error("Error in deleting Pigeon Owner", err);
    }
  };

  const handleDeleteClick = (owner) => {
    setOwnerToDelete(owner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await handleDeleteOwner(ownerToDelete._id);
      toast.success(`${ownerToDelete.name} has been deleted successfully`);
      setShowDeleteModal(false);
      setOwnerToDelete(null);
    } catch (err) {
      console.error("Error in deleting Pigeon Owner", err);
      toast.error("Failed to delete pigeon owner");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedOwner) => {
    setPigeonOwners((prevOwners) =>
      prevOwners.map((owner) =>
        owner._id === updatedOwner._id ? updatedOwner : owner
      )
    );
  };

  return (
    <>
      <MasterLayout>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">List of Users</h5>

              <Link to="/create-pigeon-owner">
                <button className="btn btn-primary">
                  Create Pigeon Owners
                </button>
              </Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
                  <ScaleLoader color="#0d6efd" />
                </div>
              ) : pigeonOwners?.length > 0 ? (
                <table className="table bordered-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col" className="text-start">
                        Image
                      </th>
                      <th scope="col" className="text-start">
                        Name
                      </th>
                      <th scope="col" className="text-start">
                        Phone
                      </th>
                      <th scope="col" className="text-start">
                        City
                      </th>
                      <th scope="col" className="text-center">
                        Potions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pigeonOwners?.map((owner, index) => {
                      return (
                        <tr>
                          <>
                            <td className="text-center  align-middle">
                              {index + 1}
                            </td>
                            <td className="text-start  align-middle">
                              <div
                                className="rounded-2 overflow-hidden bg-secondary"
                                style={{
                                  height: "60px",
                                  width: "60px",
                                }}
                              >
                                <img
                                  src={
                                    owner.ownerPicture
                                      ? owner.ownerPicture
                                      : "/default_avatar.avif"
                                  }
                                  className="rounded-3 h-100 w-100 object-fit-contain"
                                  alt=""
                                />
                              </div>
                            </td>
                            <td className="text-start  align-middle">
                              {owner?.name}
                            </td>
                            <td className="text-start align-middle">
                              {owner?.phone}
                            </td>
                            <td className="text-start align-middle">
                              {owner?.address}
                            </td>
                            <td className="text-start align-middle">
                              <div className="d-flex align-items-center justify-content-evenly">
                                <button
                                  className="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                  onClick={() => {
                                    handleShowEditOwner();
                                    setOwnerId(owner?._id);
                                  }}
                                >
                                  <FaRegEdit />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(owner)}
                                  className="bg-danger-focus  text-danger-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                >
                                  <FaRegTrashAlt />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-muted"
                  style={{ minHeight: "200px" }}
                >
                  <h5 className="mb-0">No pigeon owners available</h5>
                </div>
              )}
            </div>
          </div>
          {/* card end */}
        </div>
      </MasterLayout>
      <EditPigeonOwnerModal
        handleClose={handleCloseEditOwner}
        showEditOwner={showEditOwner}
        ownerId={ownerId}
        onUpdateSuccess={handleUpdateSuccess}
      />
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {ownerToDelete?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PigeonOwnersList;
