import React, { useEffect, useRef, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { FaPlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import "./CreateTournaments.css";
import { CraeteTournamentRequest } from "./__request/CraeteTournamentRequest";
import { Button } from "react-bootstrap";
import { getPigeonOwnersReq } from "../pigeon-owners/__request/PigeonOwnersRequest";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllClubs } from "../club/__requests/ClubRequests";
import { getAllUsersRequest } from "../create-user/__request/GetAllUsersRequest";
import Select from "react-select";

const CreateTournaments = () => {
  const fileInputRef = useRef();
  const [pigeonOwners, setPigeonOwners] = useState();
  const [imageSrc, setImageSrc] = useState(null);
  const [numDays, setNumDays] = useState(0);
  const [dateFields, setDateFields] = useState([]);
  const [numberOfPrizes, setNumberOfPrizes] = useState(0);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const loginUser = useSelector((state) => state.userDataReducer);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tournamentPicture: "",
    club: "",
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
    noteTimeForPigeons: "",
    allowedAdmins: [],
  });

  useEffect(() => {
    // Check if the logged-in user is a subadmin and set allowedAdmins if true
    if (loginUser.role === "subadmin" && loginUser._id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        allowedAdmins: [...prevFormData.allowedAdmins, loginUser._id],
      }));
    }
  }, [loginUser]);

  // Add new state for field errors
  const [errors, setErrors] = useState({});

  const handleRowClick = (ownerId) => {
    setSelectedOwners((prev) => {
      const newSelection = prev?.includes(ownerId)
        ? prev.filter((id) => id !== ownerId)
        : [...prev, ownerId];

      // Clear error if at least one owner is selected
      if (newSelection.length > 0) {
        setErrors((prev) => ({
          ...prev,
          participatingLofts: undefined,
        }));
      }

      return newSelection;
    });

    setFormData((prev) => ({
      ...prev,
      participatingLofts: prev?.participatingLofts?.includes(ownerId)
        ? prev.participatingLofts.filter((id) => id !== ownerId)
        : [...prev.participatingLofts, ownerId],
    }));
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

  const handleDaysChange = (event) => {
    const value = event.target.value;
    const numberOfDays = Math.min(value ? parseInt(value, 10) : 0, 50);
    setNumDays(numberOfDays);

    // Clear error for numberOfDays when user types
    setErrors((prev) => ({
      ...prev,
      numberOfDays: undefined,
    }));

    setFormData((prevData) => ({
      ...prevData,
      numberOfDays: numberOfDays,
      dates: Array(numberOfDays).fill(""),
    }));

    const newDateFields = Array.from(
      { length: numberOfDays },
      (_, index) => index + 1
    );
    setDateFields(newDateFields);
  };

  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const limitedValue = Math.min(isNaN(value) ? 0 : value, 50);
    setNumberOfPrizes(limitedValue);

    // Update formData directly
    setFormData((prevData) => ({
      ...prevData,
      numberOfPrizes: limitedValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear error for the field being typed in
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    // Special handling for numberOfPigeons and helperPigeons
    if (name === "numberOfPigeons" || name === "helperPigeons") {
      const numValue = Math.min(parseInt(value, 10) || 0, 50);
      setFormData((prevData) => ({
        ...prevData,
        [name]: numValue,
      }));
      return;
    }

    // Handle other inputs normally
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Clear tournamentPicture error
      setErrors((prev) => ({
        ...prev,
        tournamentPicture: undefined,
      }));

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

  const navigate = useNavigate();

  // Update the date input change handler
  const handleDateChange = (index, value) => {
    // Clear error for this specific date field
    setErrors((prev) => ({
      ...prev,
      [`dates.${index}`]: undefined,
    }));

    const updatedDates = [...formData.dates];
    updatedDates[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      dates: updatedDates,
    }));
  };

  // Add validation function
  const validateForm = () => {
    const newErrors = {};

    // Required field validation with specific error messages
    if (!formData.tournamentPicture) {
      newErrors.tournamentPicture = "Tournament poster is required";
      toast.error("Please upload tournament poster");
      scrollToField("tournamentPoster");
      setErrors(newErrors);
      return false;
    }

    if (!formData.tournamentName.trim()) {
      newErrors.tournamentName = "Tournament name is required";
      toast.error("Please enter tournament name");
      scrollToField("tournamentName");
      setErrors(newErrors);
      return false;
    }

    if (!formData.club) {
      newErrors.club = "Club is required";
      toast.error("Please select a club");
      scrollToField("club");
      setErrors(newErrors);
      return false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      toast.error("Please select start date");
      scrollToField("startDate");
      setErrors(newErrors);
      return false;
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
      toast.error("Please select start time");
      scrollToField("startTime");
      setErrors(newErrors);
      return false;
    }

    if (!formData.numberOfDays) {
      newErrors.numberOfDays = "Number of days is required";
      toast.error("Please enter number of days");
      scrollToField("numDays");
      setErrors(newErrors);
      return false;
    }

    if (!formData.continueDays) {
      newErrors.continueDays = "Continue days is required";
      toast.error("Please enter continue days");
      scrollToField("continueDays");
      setErrors(newErrors);
      return false;
    }

    if (!formData.numberOfPigeons) {
      newErrors.numberOfPigeons = "Number of pigeons is required";
      toast.error("Please enter number of pigeons");
      scrollToField("numberOfPigeons");
      setErrors(newErrors);
      return false;
    }

    // Validate dates array
    const emptyDateIndex = formData.dates.findIndex((date) => !date);
    if (emptyDateIndex !== -1) {
      newErrors[`dates.${emptyDateIndex}`] = "Date is required";
      toast.error(`Please select date for Day ${emptyDateIndex + 1}`);
      scrollToField(`dateInput${emptyDateIndex + 1}`);
      setErrors(newErrors);
      return false;
    }

    // Validate pigeon owners
    if (
      !formData.participatingLofts ||
      formData.participatingLofts.length === 0
    ) {
      newErrors.participatingLofts = "Please select at least one pigeon owner";
      toast.error("Please select at least one pigeon owner");
      const pigeonOwnersSection = document.querySelector(
        '[data-section="pigeonOwners"]'
      );
      if (pigeonOwnersSection) {
        pigeonOwnersSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Helper function to scroll to field
  const scrollToField = (fieldId) => {
    const element =
      document.getElementById(fieldId) ||
      document.querySelector(`[name="${fieldId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  };

  // Update handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await CraeteTournamentRequest(formData);
      if (response) {
        toast.success("Tournament created successfully!");
        navigate("/all-tournaments", { state: { refresh: true } });
      }
    } catch (err) {
      console.error("Error in creating tournament", err);
      toast.error("Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  // Update input styles based on errors
  const getInputClassName = (fieldName) => {
    return `form-control ${errors[fieldName] ? "is-invalid" : ""}`;
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>> Get Pigeon Owner <<xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  const getPigeonOwners = async () => {
    try {
      const response = await getPigeonOwnersReq();
      setPigeonOwners(response?.owner);
    } catch (err) {
      console.error("Error in gettin Pigeon Owners", err);
    }
  };

  useEffect(() => {
    getPigeonOwners();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOwners = pigeonOwners?.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    // Function to prevent scroll on number inputs
    const preventScroll = (e) => {
      e.target.blur();
    };

    // Get all number inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');

    // Add event listeners
    numberInputs.forEach((input) => {
      input.addEventListener("focus", (e) => {
        e.target.addEventListener("wheel", preventScroll, { passive: false });
        e.target.addEventListener("touchstart", preventScroll, {
          passive: false,
        });
      });

      input.addEventListener("blur", (e) => {
        e.target.removeEventListener("wheel", preventScroll);
        e.target.removeEventListener("touchstart", preventScroll);
      });
    });

    // Cleanup
    return () => {
      numberInputs.forEach((input) => {
        input.removeEventListener("focus", preventScroll);
        input.removeEventListener("blur", preventScroll);
      });
    };
  }, []);

  const [allClubs, setAllClubs] = useState([]);

  const handleAllClubs = async () => {
    try {
      const response = await getAllClubs();
      if (response?.success === true) {
        setAllClubs(response?.clubs);
      }
    } catch (err) {
      console.error("Error in fetching all clubs", err);
      setAllClubs([]);
    }
  };

  useEffect(() => {
    handleAllClubs();
  }, []);

  // Add this function to handle prize input changes
  const handlePrizeChange = (index, value) => {
    // Clear error for this specific prize field
    setErrors((prev) => ({
      ...prev,
      [`prizes.${index}`]: undefined,
    }));

    const updatedPrizes = [...formData.prizes];
    updatedPrizes[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      prizes: updatedPrizes,
    }));
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
    const selectedIds = selectedOptions.map((option) => option.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      allowedAdmins: selectedIds,
    }));
  };

  // Format options for react-select
  const subAdminOptions = subAdmins.map((subAdmin) => ({
    value: subAdmin._id,
    label: subAdmin.name, // Only show name
  }));

  return (
    <MasterLayout>
      <div className="w-100 d-flex align-items-center justify-content-center">
        <div className="w-100 color-mode p-5 rounded-2">
          <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <div className="mb-3 d-flex align-items-center flex-column">
              <label htmlFor="tournamentPoster" className="form-label">
                Tournament Poster{" "}
                {errors.tournamentPicture && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="file"
                className="d-none"
                id="tournamentPoster"
                name="tournamentPicture"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div
                className={`border-secondary border-1 rounded-2 d-flex align-items-center justify-content-center overflow-hidden ${
                  errors.tournamentPicture ? "border-danger" : ""
                }`}
                style={{ height: "180px", width: "180px", cursor: "pointer" }}
                onClick={handleDivClick}
              >
                {imageSrc ? (
                  <>
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
                  </>
                ) : (
                  <FaPlus className="fs-3" />
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="tournamentName" className="form-label">
                Tournament Name{" "}
                {errors.tournamentName && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="text"
                className={getInputClassName("tournamentName")}
                id="tournamentName"
                name="tournamentName"
                value={formData.tournamentName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="club" className="form-label">
                Club {errors.club && <span className="text-danger">*</span>}
              </label>
              <select
                className={getInputClassName("club")}
                id="club"
                name="club"
                value={formData.club}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {allClubs?.map((club) => {
                  return <option>{club?.name}</option>;
                })}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date{" "}
                {errors.startDate && <span className="text-danger">*</span>}
              </label>
              <input
                type="date"
                className={getInputClassName("startDate")}
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">
                Start Time{" "}
                {errors.startTime && <span className="text-danger">*</span>}
              </label>
              <input
                type="time"
                className={getInputClassName("startTime")}
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="numDays"
                className="form-label d-flex justify-content-between"
              >
                Number of Days <span>Max 50</span>{" "}
                {errors.numberOfDays && <span className="text-danger">*</span>}
              </label>
              <input
                type="number"
                className={getInputClassName("numberOfDays")}
                id="numDays"
                value={formData.numberOfDays || ""}
                onChange={handleDaysChange}
                min="1"
                max="50"
                onwheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="row">
              {dateFields.map((day, index) => (
                <div className="col-lg-4" key={index}>
                  <div className="mb-3">
                    <label htmlFor={`dateInput${day}`} className="form-label">
                      Date: {day}{" "}
                      {errors[`dates.${index}`] && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors[`dates.${index}`] ? "is-invalid" : ""
                      }`}
                      id={`dateInput${day}`}
                      name={`dates.${index}`}
                      value={formData.dates[index] || ""}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      min={1}
                    />
                    {errors[`dates.${index}`] && (
                      <div className="invalid-feedback">
                        Please select a date
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="continueDays" className="form-label">
                Continue Days{" "}
                {errors.continueDays && <span className="text-danger">*</span>}
              </label>
              <input
                type="number"
                className={getInputClassName("continueDays")}
                id="continueDays"
                name="continueDays"
                value={formData.continueDays}
                onChange={handleInputChange}
                min={1}
                onwheel={(e) => e.preventDefault()}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="numberOfPigeons"
                className="form-label d-flex justify-content-between"
              >
                Number of Pigeons <span>Max 50</span>{" "}
                {errors.numberOfPigeons && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="number"
                className={getInputClassName("numberOfPigeons")}
                id="numberOfPigeons"
                name="numberOfPigeons"
                value={formData.numberOfPigeons}
                onChange={handleInputChange}
                min={0}
                max={50}
                onwheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="helperPigeons"
                className="form-label d-flex justify-content-between"
              >
                Helper Pigeons (Optional) <span>Max 50</span>{" "}
                {errors.helperPigeons && <span className="text-danger">*</span>}
              </label>
              <input
                type="number"
                className={getInputClassName("helperPigeons")}
                id="helperPigeons"
                name="helperPigeons"
                value={formData.helperPigeons}
                onChange={handleInputChange}
                min={0}
                max={50}
                onwheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="numberOfPrizes"
                className="form-label d-flex justify-content-between"
              >
                Number of Prizes <span>Max 50</span>{" "}
              </label>
              <input
                type="number"
                className={getInputClassName("numberOfPrizes")}
                id="numberOfPrizes"
                name="numberOfPrizes"
                value={formData.numberOfPrizes}
                onChange={handleNumberChange}
                min={0}
                max={50}
                onwheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="row">
              {Array.from({ length: numberOfPrizes }, (_, index) => (
                <div className="col-lg-4" key={index}>
                  <div className="mb-3">
                    <label className="form-label">
                      Prize {index + 1}{" "}
                      {errors[`prizes.${index}`] && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors[`prizes.${index}`] ? "is-invalid" : ""
                      }`}
                      name={`prizes.${index}`}
                      value={formData.prizes[index] || ""}
                      onChange={(e) => handlePrizeChange(index, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {loginUser?.role === "admin" && (
              <>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Show on screen
                  </label>
                  <select
                    className={getInputClassName("status")}
                    id="status"
                    name="status"
                    value={formData.status}
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
                    value={subAdminOptions.filter((option) =>
                      formData.allowedAdmins.includes(option.value)
                    )}
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

            <div className="mb-3" data-section="pigeonOwners">
              <label htmlFor="numberOfPigeons" className="form-label">
                Pigeons Owners{" "}
                {errors.participatingLofts && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="Search pigeon owner by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`form-control ${
                    errors.participatingLofts ? "is-invalid" : ""
                  }`}
                />
                <Button className="position-absolute top-50 end-0 translate-middle-x translate-middle-y">
                  Search
                </Button>
              </div>
              <div
                className={`border rounded-3 rounded-top-0 ${
                  errors.participatingLofts ? "border-danger" : ""
                }`}
                style={{ maxHeight: "300px", overflowY: "auto", overflowX: "auto" }}
              >
                <div className="d-flex flex-column gap-2 px-4">
                  <div className="table-responsive-app">
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
                                ? "text-white"
                                : ""
                            }`}
                          >
                            {selectedOwners?.includes(owner._id) ? (
                              <span>&#10004;</span>
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
              {errors.participatingLofts && (
                <div className="text-danger mt-1">
                  {errors.participatingLofts}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tournament"}
            </button>
          </form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default CreateTournaments;
