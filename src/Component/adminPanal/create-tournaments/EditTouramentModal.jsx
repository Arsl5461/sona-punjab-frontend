import React, { useRef, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import {
  getTournamentById,
  updateTournamentRequest,
} from "./__request/CraeteTournamentRequest";
import { getPigeonOwnersReq } from "../pigeon-owners/__request/PigeonOwnersRequest";
import { useSelector } from "react-redux";
import "./CreateTournaments.css";
import { getAllUsersRequest } from "../create-user/__request/GetAllUsersRequest";
import Select from "react-select";

const EditTournamentModal = ({ show, handleClose, tournamentId, onSubmit }) => {
  const fileInputRef = useRef();
  const [imageSrc, setImageSrc] = useState(null);
  const [dateFields, setDateFields] = useState([]);
  const [formData, setFormData] = useState({
    tournamentPicture: "",
    tournamentName: "",
    startDate: "",
    startTime: "",
    numberOfDays: "",
    numberOfPigeons: "",
    helperPigeons: "",
    continueDays: "",
    status: "Non-Active",
    participatingLofts: [],
    numberOfPrizes: "",
    dates: [],
    prizes: [],
    allowedAdmins: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [pigeonOwners, setPigeonOwners] = useState([]);
  const loginUser = useSelector((state) => state.userDataReducer);

  useEffect(() => {
    const fetchTournamentData = async () => {
      if (tournamentId && show) {
        try {
          const response = await getTournamentById(tournamentId);
          if (response && response.length > 0) {
            const tournamentData = response[0];
            setSelectedOwners(tournamentData?.participatingLofts);

            // Format the dates array
            const formattedDates = tournamentData.dates.map(
              (date) => new Date(date).toISOString().split("T")[0]
            );

            const updatedAllowedAdmins = tournamentData.allowedAdmins
              .map((id) => {
                const subAdmin = subAdmins.find((admin) => admin._id === id);
                return subAdmin ? { _id: id, name: subAdmin.name } : null;
              })
              .filter((admin) => admin !== null);

            // Update formData with all available fields
            setFormData({
              tournamentPicture: tournamentData.tournamentPicture || "",
              tournamentName: tournamentData.tournamentName || "",
              startDate: formattedDates[0] || "",
              startTime: tournamentData.startTime || "",
              numberOfDays: tournamentData.numberOfDays || "",
              numberOfPigeons: tournamentData.numberOfPigeons || "",
              helperPigeons: tournamentData.helperPigeons || "",
              continueDays: tournamentData.continueDays || "",
              status: tournamentData.status || "",
              participatingLofts: tournamentData.participatingLofts || [],
              numberOfPrizes: tournamentData.numberOfPrizes || "",
              dates: formattedDates,
              prizes: tournamentData.prizes || [],
              allowedAdmins: updatedAllowedAdmins,
            });

            // Update image source
            if (tournamentData.tournamentPicture) {
              setImageSrc(tournamentData.tournamentPicture);
            }

            // Update date fields
            if (tournamentData.numberOfDays) {
              const newDateFields = Array.from(
                { length: tournamentData.numberOfDays },
                (_, index) => index + 1
              );
              setDateFields(newDateFields);
            }
          }
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      }
    };

    fetchTournamentData();
  }, [tournamentId, show]);

  useEffect(() => {
    const getPigeonOwners = async () => {
      try {
        const response = await getPigeonOwnersReq(loginUser?._id);
        setPigeonOwners(response?.owner);
      } catch (err) {
        console.error("Error in getting Pigeon Owners", err);
      }
    };

    getPigeonOwners();
  }, []);

  const filteredOwners = pigeonOwners?.filter(
    (owner) =>
      owner?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      owner?.address?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (ownerId) => {
    setSelectedOwners((prev) => {
      const newSelectedOwners = prev?.includes(ownerId)
        ? prev.filter((id) => id !== ownerId)
        : [...prev, ownerId];

      // Update formData.participatingLofts simultaneously
      setFormData((prevFormData) => ({
        ...prevFormData,
        participatingLofts: newSelectedOwners,
        action: prev?.includes(ownerId) ? "remove" : "add", // Add action for the API
      }));

      return newSelectedOwners;
    });
  };

  const handleDivClick = () => {
    if (imageSrc) {
      setImageSrc(null);
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
      setFormData({
        ...formData,
        tournamentPicture: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaysChange = (event) => {
    const value = event.target.value;
    const numberOfDays = value ? parseInt(value, 10) : 0;

    setFormData((prev) => ({
      ...prev,
      numberOfDays: numberOfDays,
      dates: Array(numberOfDays).fill(""),
    }));

    const newDateFields = Array.from(
      { length: numberOfDays },
      (_, index) => index + 1
    );
    setDateFields(newDateFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const submitFormData = new FormData();

    // Process the allowedAdmins array to only send _id values
    const allowedAdminsIds = formData.allowedAdmins.map((admin) => admin._id);

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "participatingLofts") {
        // Handle participatingLofts array
        submitFormData.append(
          "participatingLofts",
          JSON.stringify(formData.participatingLofts)
        );
        submitFormData.append("action", formData.action);
      } else if (key === "dates") {
        // Handle dates array - send as a JSON string
        submitFormData.append("dates", JSON.stringify(formData.dates));
      } else if (key === "prizes") {
        // Handle prizes array
        submitFormData.append("prizes", JSON.stringify(formData.prizes));
      } else if (key === "allowedAdmins") {
        // Handle allowedAdmins - send only _id values
        submitFormData.append(
          "allowedAdmins",
          JSON.stringify(allowedAdminsIds)
        );
      } else if (key === "tournamentPicture" && formData[key] instanceof File) {
        // Handle file upload
        submitFormData.append("tournamentPicture", formData[key]);
      } else {
        // Handle all other fields
        submitFormData.append(key, formData[key].toString());
      }
    });

    try {
      const response = await updateTournamentRequest(
        tournamentId,
        submitFormData
      );
      if (response) {
        onSubmit(response?.data); // Make sure response.data contains the complete updated tournament object
        handleClose();
      } else {
        console.error("Error updating tournament:", response.error);
      }
    } catch (error) {
      console.error("Error in update request:", error);
    }
  };

  const [subAdmins, setSubAdmins] = useState([]);

  const handleSubAdmin = async () => {
    try {
      const response = await getAllUsersRequest();
      if (response.admins) {
        const filteredSubAdmins = response?.admins?.filter(
          (user) => user?.role === "subadmin"
        );
        setSubAdmins(filteredSubAdmins);
      }
    } catch (error) {
      console.error("Error in getting subadmin list", error);
    }
  };

  useEffect(() => {
    handleSubAdmin();
  }, []);

  const handleSelectChange = (selectedOptions) => {
    const selectedAdmins = selectedOptions
      ? selectedOptions.map((option) => ({
          _id: option.value,
          name: option.label,
        }))
      : [];
    setFormData((prevFormData) => ({
      ...prevFormData,
      allowedAdmins: selectedAdmins, // Update the allowedAdmins array with selected subadmins (name and _id)
    }));
  };

  const subAdminOptions = subAdmins.map((subAdmin) => ({
    value: subAdmin._id,
    label: subAdmin.name, // Only show name
  }));

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Tournament</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex align-items-center flex-column">
            <label htmlFor="tournamentPoster" className="form-label">
              Tournament Poster
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
              className="border-secondary border-1 rounded-2 d-flex align-items-center justify-content-center overflow-hidden"
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
                    onClick={() => handleDivClick()}
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
            <label htmlFor="tournamentName" className="form-label">
              Tournament Name
            </label>
            <input
              type="text"
              className="form-control"
              id="tournamentName"
              name="tournamentName"
              value={formData.tournamentName}
              onChange={handleInputChange}
            />
          </div>

          {/* Date and Time Fields */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="startTime" className="form-label">
                Start Time
              </label>
              <input
                type="time"
                className="form-control"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Number of Days and Dates */}
          <div className="mb-3">
            <label htmlFor="numberOfDays" className="form-label">
              Number of Days
            </label>
            <input
              type="number"
              className="form-control"
              id="numberOfDays"
              name="numberOfDays"
              value={formData.numberOfDays}
              onChange={handleDaysChange}
              min="1"
            />
          </div>

          {/* Dynamic Date Fields */}
          <div className="row">
            {dateFields.map((day, index) => (
              <div className="col-md-4" key={index}>
                <div className="mb-3">
                  <label htmlFor={`dateInput${day}`} className="form-label">
                    Date {day}
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id={`dateInput${day}`}
                    value={formData.dates[index] || ""}
                    onChange={(e) => {
                      const updatedDates = [...formData.dates];
                      updatedDates[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        dates: updatedDates,
                      }));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Other Fields */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="numberOfPigeons" className="form-label">
                Number of Pigeons
              </label>
              <input
                type="number"
                className="form-control"
                id="numberOfPigeons"
                name="numberOfPigeons"
                value={formData.numberOfPigeons}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="helperPigeons" className="form-label">
                Helper Pigeons
              </label>
              <input
                type="number"
                className="form-control"
                id="helperPigeons"
                name="helperPigeons"
                value={formData.helperPigeons}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          {/* Continue Days */}
          <div className="mb-3">
            <label htmlFor="continueDays" className="form-label">
              Continue Days
            </label>
            <input
              type="number"
              className="form-control"
              id="continueDays"
              name="continueDays"
              value={formData.continueDays}
              onChange={handleInputChange}
              min={1}
            />
          </div>

          {/* Number of Prizes */}
          <div className="mb-3">
            <label htmlFor="numberOfPrizes" className="form-label">
              Number of Prizes
            </label>
            <input
              type="number"
              className="form-control"
              id="numberOfPrizes"
              name="numberOfPrizes"
              value={formData.numberOfPrizes}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setFormData((prev) => ({
                  ...prev,
                  numberOfPrizes: isNaN(value) ? 0 : value,
                }));
              }}
            />
          </div>

          {/* Dynamic Prize Fields */}
          <div className="row">
            {Array.from(
              { length: parseInt(formData.numberOfPrizes) || 0 },
              (_, index) => (
                <div className="col-lg-4" key={index}>
                  <div className="mb-3">
                    <label className="form-label">Prize {index + 1}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={`prize${index + 1}`}
                      value={formData.prizes[index] || ""}
                      onChange={(e) => {
                        const updatedPrizes = [...formData.prizes];
                        updatedPrizes[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          prizes: updatedPrizes,
                        }));
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {loginUser?.role === "admin" && (
            <>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Show on screen
                </label>
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  value={
                    formData.status === "Non-active"
                      ? "Non-Active"
                      : formData.status
                  }
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Active">On Screen</option>
                  <option value="Non-Active">Off Screen</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Select Subadmins
                </label>
                <Select
                  // className={getInputClassName("status")}
                  id="status"
                  name="status"
                  // value={selectedSubAdmins}
                  value={formData.allowedAdmins.map((admin) => ({
                    value: admin._id,
                    label: admin.name,
                  }))}
                  onChange={handleSelectChange}
                  options={subAdminOptions}
                  isMulti // Enables multiple selection
                  getOptionLabel={(e) => e.label} // Option label is just the subadmin name
                  getOptionValue={(e) => e.value} // Option value is the subadmin _id
                  placeholder="Select Subadmins"
                  isSearchable // Enables search functionality
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="numberOfPigeons" className="form-label">
              Pigeons Owners
            </label>
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search pigeon owner by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
              />
              <Button className="position-absolute top-50 end-0 translate-middle-x translate-middle-y">
                Search
              </Button>
            </div>
            <div
              className=" border rounded-3 rounded-top-0"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <div className="d-flex flex-column gap-2 px-4">
                <table className="table bordered-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col" className="text-center">
                        Pigeon Owners
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners?.map((owner, index) => (
                      <tr
                        key={index}
                        className={`cursor-pointer ${
                          selectedOwners?.includes(owner._id)
                            ? "selected-row"
                            : ""
                        }`}
                        onClick={() => handleRowClick(owner?._id)}
                      >
                        <td
                          className={`text-center ${
                            selectedOwners?.includes(owner._id)
                              ? "text-success"
                              : ""
                          }`}
                        >
                          {selectedOwners?.includes(owner._id) ? (
                            <span>&#10004;</span> // Tick mark
                          ) : (
                            pigeonOwners?.indexOf(owner) + 1
                          )}
                        </td>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-start gap-2">
                            <div
                              className="overflow-hidden d-flex align-items-center justify-content-center"
                              style={{
                                height: "60px",
                                width: "60px",
                                borderRadius: "100%",
                              }}
                            >
                              <img
                                src={
                                  owner.ownerPicture
                                    ? owner.ownerPicture
                                    : "/default_avatar.avif"
                                }
                                className="h-100 w-100"
                                alt=""
                                style={{
                                  objectFit: "cover",
                                  objectPosition: "center",
                                }}
                              />
                            </div>
                            <div className="d-flex flex-column align-items-start">
                              <span className="fw-bold">{owner?.name}</span>
                              <span>{owner?.address}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTournamentModal;
