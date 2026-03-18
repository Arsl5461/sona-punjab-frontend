import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MasterLayout from "../../../masterLayout/MasterLayout";
import {
  deleteAdminRequest,
  getAllUsersRequest,
} from "./__request/GetAllUsersRequest";
import { useSelector } from "react-redux";
import EditAdminModal from "./EditAdminModal";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import { FaRegCopy, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const AllSubAdminList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersRequest();
      if (response.admins) {
        setAllUsers(response.admins);
      }
    } catch (err) {
      console.error("Error in getting users list", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const loginUser = useSelector((state) => state.userDataReducer);

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedAdmin(null);
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDelete) {
      await deleteAdmin(adminToDelete._id);
      setShowDeleteModal(false);
      setAdminToDelete(null);
    }
  };

  const deleteAdmin = async (id) => {
    const response = await deleteAdminRequest(id);
    if (response.success) {
      toast.success("Admin deleted successfully!");
      getAllUsers();
    } else {
      toast.error(response.message || "Failed to delete admin");
    }
  };

  const handleCopy = (admin) => {
    const textToCopy = `Name: ${admin.name}\nPassword: ${admin.password}\nPhone: ${admin.phone}\nRole: ${admin.role}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Admin details copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy admin details");
      });
  };

  return (
    <MasterLayout>
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0">List of Users</h5>

            <Link to="/create-subAdmin">
              <button className="btn btn-primary">Create Sub Admin</button>
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
            ) : allUsers?.length > 0 ? (
              <table className="table bordered-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">
                      #
                    </th>
                    <th scope="col" className="text-start">
                      User Name
                    </th>

                    <th scope="col" className="text-start">
                      Phone
                    </th>
                    <th scope="col" className="text-start">
                      Password
                    </th>
                    <th scope="col" className="text-start">
                      Role
                    </th>
                    <th scope="col" className="text-start">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers?.map((admin, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center bg-transparent">
                            {index + 1}
                          </td>
                          <td className="text-start ">{admin?.name}</td>
                          <td className="text-start ">{admin?.phone}</td>
                          <td className="text-start ">{admin?.password}</td>
                          <td
                            className={`text-start ${
                              admin?.role === "subadmin"
                                ? "text-warning fw-bold"
                                : "text-success fw-bold"
                            }`}
                          >
                            {admin?.role}
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-2">
                              {loginUser?.role === "admin" && (
                                <>
                                  <button
                                    className="bg-success-focus text-center text-success-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => handleCopy(admin)}
                                  >
                                    <FaRegCopy />
                                    Copy
                                  </button>
                                  <button
                                    className="bg-warning-focus text-center text-warning-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => handleEditClick(admin)}
                                  >
                                    <FaRegEdit />
                                    Edit
                                  </button>
                                  <button
                                    className="bg-danger-focus text-center text-danger-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => handleDeleteClick(admin)}
                                  >
                                    <FaRegTrashAlt />
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center text-muted"
                style={{ minHeight: "200px" }}
              >
                <h5 className="mb-0">No users available</h5>
              </div>
            )}
          </div>
        </div>
        {/* card end */}
      </div>
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {adminToDelete?.name}? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirmDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>

      <EditAdminModal
        show={showEditModal}
        onClose={handleCloseModal}
        admin={selectedAdmin}
        onUpdate={getAllUsers}
      />
    </MasterLayout>
  );
};

export default AllSubAdminList;
