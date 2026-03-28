import React, { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { Link } from "react-router-dom";
import {
  deleteTournament,
  getAllAllowedTournaments,
  getAllTournaments,
} from "./__request/CraeteTournamentRequest";
import { useDispatch } from "react-redux";
import { tournamentIdDispatcher } from "../../../redux/action";
import { useSelector } from "react-redux";
import EditTournamentModal from "./EditTouramentModal";
import { ScaleLoader } from "react-spinners";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const AllTournaments = () => {
  const [tournamentsList, setTournamentsList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tournamentToEdit, setTournamentToEdit] = useState(null);
  const loginUser = useSelector((state) => state.userDataReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getTournaments = async () => {
    try {
      setLoading(true);
      if (loginUser?.role === "admin") {
        const response = await getAllTournaments();
        if (Array.isArray(response)) {
          setTournamentsList(response);
        } else {
          console.error("Response is not an array:", response);
          setTournamentsList([]);
        }
      } else {
        const response = await getAllAllowedTournaments(loginUser?._id);
        if (Array.isArray(response)) {
          setTournamentsList(response);
        } else {
          console.error("Response is not an array:", response);
          setTournamentsList([]);
        }
      }
    } catch (err) {
      console.error("Error in fetching Tournaments list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTournaments();
  }, []);

  const handleDeleteClick = (tournament) => {
    setTournamentToDelete(tournament);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (tournamentToDelete) {
      try {
        await deleteTournament(tournamentToDelete._id);
        getTournaments();
      } catch (error) {
        console.error("Error deleting tournament:", error);
      }
    }
    setShowDeleteModal(false);
    setTournamentToDelete(null);
  };

  const handleEditClick = (tournament) => {
    setTournamentToEdit(tournament);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setTournamentToEdit(null);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      setTournamentsList((prevList) =>
        prevList.map((tournament) =>
          tournament._id === updatedData._id ? updatedData : tournament
        )
      );

      await getTournaments();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating tournament:", error);
    }
  };

  return (
    <>
      <MasterLayout>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">List of Tournaments</h5>

              <Link to="/create-tournaments">
                <button className="btn btn-primary">
                  Create New Tournament
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
              ) : tournamentsList?.length > 0 ? (
                <div className="table-responsive-app">
                <table className="table bordered-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col" className="text-start">
                        Poster
                      </th>
                      <th scope="col" className="text-start">
                        Name
                      </th>
                      <th scope="col" className="text-start">
                        Club
                      </th>
                      <th scope="col" className="text-start">
                        Start Date
                      </th>
                      <th scope="col" className="text-start">
                        Pigeons
                      </th>
                      <th scope="col" className="text-start">
                        Lofts
                      </th>
                      <th scope="col" className="text-start">
                        Options
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournamentsList?.map((tournament, index) => {
                      return (
                        <tr key={tournament._id || index}>
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>
                          <td className="text-start align-middle tournament-poster-cell">
                            <div
                              className="rounded-2 overflow-hidden bg-secondary"
                              style={{
                                height: "200px",
                                width: "150px",
                              }}
                            >
                              <img
                                src={tournament?.tournamentPicture}
                                className="rounded-3 h-100 w-100 object-fit-contain"
                                alt=""
                              />
                            </div>
                          </td>
                          <td
                            className="text-start align-middle"
                            style={{
                              maxWidth: "130px",
                              wordBreak: "break-word",
                            }}
                          >
                            {tournament?.tournamentName}
                          </td>
                          <td
                            className="text-start align-middle"
                            style={{
                              maxWidth: "130px",
                              wordBreak: "break-word",
                            }}
                          >
                            {tournament?.club}
                            <br />
                            <span
                              className={`badge ${
                                tournament?.status === "Active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              Screen:{" "}
                              {tournament?.status === "Active" ? "On" : "Off"}
                            </span>
                          </td>
                          <td className="text-start align-middle">
                            {new Date(tournament?.dates[0]).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="text-start align-middle">
                            {tournament?.numberOfPigeons}
                          </td>
                          <td className="text-start align-middle">
                            {tournament?.participatingLofts?.length}
                          </td>
                          <td className="text-center align-middle">
                            <div className="d-flex flex-column gap-2">
                              <button
                                onClick={() => handleEditClick(tournament)}
                                className="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                              >
                                <FaRegEdit />
                                Edit
                              </button>
                              {loginUser?.role === "admin" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleDeleteClick(tournament)
                                    }
                                    className="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm d-flex align-items-center justify-content-center gap-2"
                                  >
                                    <FaRegTrashAlt />
                                    Delete
                                  </button>
                                </>
                              )}
                              <Link
                                to="/create-result"
                                onClick={() => {
                                  dispatch(tournamentIdDispatcher(tournament));
                                }}
                              >
                                <button className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                  Result
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-muted"
                  style={{ minHeight: "200px" }}
                >
                  <h5 className="mb-0">No tournaments available</h5>
                </div>
              )}
            </div>
          </div>
          {/* card end */}
        </div>
        {showDeleteModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete tournament "
                  {tournamentToDelete?.tournamentName}"?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </MasterLayout>

      <EditTournamentModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        tournamentId={tournamentToEdit?._id}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default AllTournaments;
