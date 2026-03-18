import React, { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { getAllClubs, createClub } from "./__requests/ClubRequests";
import { ScaleLoader } from "react-spinners";
import CreateClubModal from "./CreateClubModal";
import DeleteClubModal from "./DeleteClubModal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ClubEditModal from "./ClubEditModal";

const ClubLists = () => {
  const [loading, setLoading] = useState(false);
  const [allClubs, setAllClubs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getClubs = async () => {
    setLoading(true);
    try {
      const response = await getAllClubs();
      if (response?.success === true) {
        setAllClubs(response?.clubs || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error in fetching clubs", err);
      setLoading(false);
      setAllClubs([]);
    }
  };

  useEffect(() => {
    getClubs();
  }, []);

  const handleDeleteClick = (club) => {
    setSelectedClub(club);
    setShowDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedClub(null);
    getClubs(); // Refresh the list after deletion
  };

  const handleEditClick = (club) => {
    setSelectedClub(club);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedClub(null);
    getClubs(); // Refresh the list after edit
  };

  return (
    <>
      <MasterLayout>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">List of Clubs</h5>

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Create Category
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
                  <ScaleLoader color="#0d6efd" />
                </div>
              ) : allClubs?.length > 0 ? (
                <table className="table bordered-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col" className="text-start">
                        Category Name
                      </th>
                      <th scope="col" className="text-center">
                        Options
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allClubs?.map((club, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td className="text-center bg-transparent">
                              {index + 1}
                            </td>
                            <td className="text-start ">{club?.name}</td>
                            <td className="text-start align-middle">
                              <div className="d-flex align-items-center justify-content-evenly">
                                <button
                                  onClick={() => handleEditClick(club)}
                                  className="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                >
                                  <FaRegEdit />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(club)}
                                  className="bg-danger-focus  text-danger-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                >
                                  <FaRegTrashAlt />
                                  Delete
                                </button>
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
        </div>
      </MasterLayout>

      <CreateClubModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onClubCreated={getClubs}
      />

      <ClubEditModal
        show={showEditModal}
        onClose={handleEditClose}
        club={selectedClub}
      />

      <DeleteClubModal
        show={showDeleteModal}
        onClose={handleDeleteClose}
        clubId={selectedClub?._id}
        clubName={selectedClub?.name}
      />
    </>
  );
};

export default ClubLists;
