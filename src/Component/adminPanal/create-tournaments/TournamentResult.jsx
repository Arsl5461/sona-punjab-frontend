import React, { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { Link } from "react-router-dom";
import {
  createTournamentResultReq,
  getResultByDate,
  getSingleTournamentReq,
  GetTournamentOwnersReq,
} from "./__request/CraeteTournamentRequest";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { refreshResultDispatcher } from "../../../redux/action";
import { useDispatch } from "react-redux";

const TournamentResult = () => {
  const [tournament, setTournament] = useState();
  const tournamedData = useSelector((state) => state.tournamentIdReducer);
  const [showCraeteResult, setShowCraeteResult] = useState(false);
  const handleClose = () => setShowCraeteResult(false);
  const handleShow = () => setShowCraeteResult(true);

  const dispatch = useDispatch();

  const getSingleTournament = async () => {
    try {
      const response = await getSingleTournamentReq(tournamedData?._id);
      setTournament(response?.[0]);
    } catch (err) {
      console.error("Error in fetching single Tounament", err);
    }
  };

  useEffect(() => {
    getSingleTournament();
  }, []);

  // xxxxxxxxxxxxxxxxxxxxxxxxxx>> Create Tournament Result <<xxxxxxxxxxxxxxxxxxxxxxxxxx

  // const ResultOwnerId = useSelector((state) => state.resultOwnerIdReducer);

  const [resultOwner, setResultOwner] = useState({});
  useEffect(() => {
    if (resultOwner?._id) {
      setFormData((prev) => ({
        ...prev,
        pigeonOwnerId: resultOwner?._id,
      }));
    }
  }, [resultOwner]);

  const [resultDate, setResultDate] = useState();
  const [formDat, setFormData] = useState({
    tournamentId: tournamedData?._id,
    pigeonOwnerId: resultOwner?._id,
    startTime: tournament?.startTime || "",
    date: resultDate?.date,
    timeList: [],
  });

  // Set initial date when tournament data loads
  useEffect(() => {
    if (tournament?.dates?.length) {
      const formattedDate = tournament?.dates[0].split("-").reverse().join("-");

      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
        startTime: tournament?.startTime || prev.startTime,
      }));

      setResultDate((prev) => ({
        ...prev,
        date: formattedDate,
        startTime: tournament?.startTime,
      }));
    }
  }, [tournament]);

  const handleDateSelect = (date) => {
    const formattedDate = date.split("-").reverse().join("-");

    setFormData((prev) => ({
      ...prev,
      date: formattedDate,
    }));

    setResultDate((prev) => ({
      ...prev,
      date: formattedDate,
    }));
  };

  const CreateTournamentResult = async () => {
    try {
      const dateToUse = formDat?.date || resultDate?.date;

      if (!dateToUse || !formDat.startTime) {
        console.error("Missing date or start time:", {
          date: dateToUse,
          startTime: formDat.startTime,
        });
        return;
      }

      const resultData = {
        ...formDat,
        date: dateToUse,
        tournamentId: tournamedData?._id,
        pigeonOwnerId: resultOwner?._id,
      };

      const response = await createTournamentResultReq(resultData);

      setFormData((prev) => ({
        ...prev,
        timeList: [],
        date: dateToUse,
      }));

      dispatch(refreshResultDispatcher(true));
      handleClose();
    } catch (err) {
      console.error("Error in creating result", err);
    }
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxx>> Get tournament owners <<xxxxxxxxxxxxxxxxxxxxxxxxxx

  const [owners, setOwners] = useState();

  const GetTournamentOwners = async () => {
    try {
      const response = await GetTournamentOwnersReq(tournamedData?._id);
      setOwners(response);
    } catch (err) {
      console.error("Error in getting Tourament Owners", err);
    }
  };

  useEffect(() => {
    GetTournamentOwners();
  }, []);

  // xxxxxxxxxxxxxxxxxxxxxxxxxx>> Get Result By Date <<xxxxxxxxxxxxxxxxxxxxxxxxxx

  const [gerResult, setGetResult] = useState([]);

  const refreshResult = useSelector((state) => state.refreshResultReducer);

  const resultByDate = async () => {
    try {
      const response = await getResultByDate(
        tournamedData?._id,
        resultDate?.date
      );
      dispatch(refreshResultDispatcher(false));
      setGetResult(response);
    } catch (err) {
      console.error("Error in gettin result by Date", err);
    }
  };

  useEffect(() => {
    resultByDate();
  }, [resultDate, refreshResult]);

  // Add new state for editing
  const [editingCell, setEditingCell] = useState({
    ownerId: null,
    field: null,
    index: null,
  });

  // Update dropdownStyle with primary border
  const dropdownStyle = {
    position: "absolute",
    backgroundColor: "white",
    border: "2px solid #0d6efd",
    borderRadius: "4px",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: 1000,
    top: "100%",
    left: "0",
    minWidth: "150px",
    marginTop: "10px",
    opacity: 0,
    transform: "translateY(-10px)",
    animation: "dropdownFadeIn 0.2s ease forwards",
  };

  // Update arrowStyle to match primary border
  const arrowStyle = {
    position: "absolute",
    top: "-10px",
    left: "20px",
    width: "0",
    height: "0",
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: "10px solid #0d6efd",
    filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.1))",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "2px",
      left: "-10px",
      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderBottom: "10px solid white",
    },
  };

  // Add position state for dropdown
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Modify handleClick to handle switching between cells
  const handleClick = (e, ownerId, field, index) => {
    e.stopPropagation();
    const cellRect = e.currentTarget.getBoundingClientRect();

    // If clicking the same cell that's already open, keep current behavior
    if (
      editingCell.ownerId === ownerId &&
      editingCell.field === field &&
      editingCell.index === index
    ) {
      return;
    }

    // Set new dropdown position and editing cell immediately
    setDropdownPosition({
      top: cellRect.height,
      left: 0,
    });

    setEditingCell({ ownerId, field, index });
    setResultOwner(owners.find((owner) => owner._id === ownerId));
    setFormData((prev) => ({
      ...prev,
      pigeonOwnerId: ownerId,
      timeList: Array.isArray(gerResult)
        ? gerResult.find((result) => result.pigeonOwnerId === ownerId)
            ?.timeList || Array(tournament?.numberOfPigeons).fill("")
        : Array(tournament?.numberOfPigeons).fill(""),
      startTime: Array.isArray(gerResult)
        ? gerResult.find((result) => result.pigeonOwnerId === ownerId)
            ?.startTime || tournament?.startTime
        : tournament?.startTime,
    }));
  };

  // Update click outside handler to only close if clicking outside any td
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideAnyTd = event.target.closest("td");
      if (
        editingCell.ownerId &&
        !event.target.closest(".time-edit-dropdown") &&
        !isClickInsideAnyTd
      ) {
        handleCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCell]);

  // Handle cancel
  const handleCancel = () => {
    const dropdown = document.querySelector(".time-edit-dropdown");
    if (dropdown) {
      dropdown.classList.add("closing");
      setTimeout(() => {
        setEditingCell({ ownerId: null, field: null, index: null });
      }, 200); // Match this with animation duration
    } else {
      setEditingCell({ ownerId: null, field: null, index: null });
    }
  };

  // Handle input change
  const handleTimeChange = (value, field, index = null) => {
    // Handle "00:00" as empty/null time
    const processedValue = value === "00:00" ? "" : value;

    if (field === "startTime") {
      setFormData((prev) => ({
        ...prev,
        startTime: processedValue,
      }));
    } else if (field === "timeList") {
      setFormData((prev) => {
        const newTimeList = [
          ...(prev.timeList || Array(tournament?.numberOfPigeons).fill("")),
        ];
        newTimeList[index] = processedValue;
        return {
          ...prev,
          timeList: newTimeList,
        };
      });
    }
  };

  // Handle save on enter or blur
  const handleSave = async () => {
    const dropdown = document.querySelector(".time-edit-dropdown");
    if (dropdown) {
      dropdown.classList.add("closing");
      setTimeout(async () => {
        await CreateTournamentResult();
        setEditingCell({ ownerId: null, field: null, index: null });
      }, 200);
    } else {
      await CreateTournamentResult();
      setEditingCell({ ownerId: null, field: null, index: null });
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes dropdownFadeOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-10px);
              pointer-events: none;
            }
          }

          .time-edit-dropdown {
            animation: dropdownFadeIn 0.2s ease forwards;
          }

          .time-edit-dropdown.closing {
            animation: dropdownFadeOut 0.2s ease forwards;
          }

          .dropdown-arrow::after {
            content: '';
            position: absolute;
            top: 2px;
            left: -10px;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid white;
          }

          /* Update input focus state to match primary theme */
          .time-edit-dropdown input:focus {
            border-color: #0d6efd !important;
            outline: none;
            box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
          }

          /* Mobile-friendly time input styles */
          .time-edit-dropdown input[type="time"] {
            -webkit-appearance: none;
            appearance: none;
            font-size: 16px; /* Prevents zoom on iOS */
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
            color: black;
          }

          /* Better mobile button layout */
          .time-edit-dropdown .d-flex.flex-column {
            width: 100%;
          }

          .time-edit-dropdown .d-flex.justify-content-between {
            width: 100%;
          }

          .time-edit-dropdown button {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            font-size: 14px;
            padding: 6px 8px;
          }

          /* Responsive adjustments for mobile */
          @media (max-width: 768px) {
            .time-edit-dropdown {
              min-width: 200px;
            }

            .time-edit-dropdown input[type="time"] {
              font-size: 16px;
              padding: 14px;
            }

            .time-edit-dropdown button {
              font-size: 13px;
              padding: 8px 6px;
            }
          }
        `}
      </style>

      <MasterLayout>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Create Tournament Result</h5>
              <div className="d-flex align-items-center flex-wrap w-50 justify-content-start">
                {tournament?.dates?.map((date, index) => {
                  const formattedDate = date.split("-").reverse().join("-");

                  const isSelected = resultDate?.date === formattedDate;
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "primary" : "outline-primary"}
                      onClick={() => handleDateSelect(date)}
                      className="p-1 m-1"
                    >
                      {formattedDate}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive-app">
              <table className="table bordered-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">
                      Sr. No.
                    </th>
                    <th scope="col" className="text-center">
                      Owner
                    </th>
                    <th scope="col" className="text-center">
                      Name
                    </th>
                    <th scope="col" className="text-center">
                      Fly Time
                    </th>
                    {Array.from(
                      { length: tournament?.numberOfPigeons },
                      (_, index) => (
                        <th key={index} scope="col" className="text-start">
                          # {index + 1}
                        </th>
                      )
                    )}
                    {Array.from(
                      { length: tournament?.helperPigeons || 0 },
                      (_, index) => (
                        <th
                          key={`helper-${index}`}
                          scope="col"
                          className="text-start"
                        >
                          #{tournament?.numberOfPigeons + index + 1}
                        </th>
                      )
                    )}
                    <th scope="col" className="text-center">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {owners
                    ?.map((owner) => {
                      const ownerResult = Array.isArray(gerResult)
                        ? gerResult.find(
                            (result) => result.pigeonOwnerId === owner?._id
                          )
                        : null;

                      return {
                        ...owner,
                        formattedTotalTime:
                          ownerResult?.formattedTotalTime || "00:00:00",
                      };
                    })

                    ?.map((owner, index) => {
                      const ownerResult = Array.isArray(gerResult)
                        ? gerResult.find(
                            (result) => result.pigeonOwnerId === owner?._id
                          )
                        : null;

                      return (
                        <tr key={owner?._id || index}>
                          <td className="text-center">
                            {index + 1}
                          </td>
                          <td className="text-center">
                            <div
                              className="rounded-2 overflow-hidden bg-secondary"
                              style={{
                                height: "60px",
                                width: "60px",
                              }}
                            >
                              <img
                                src={
                                  owner?.ownerPicture
                                    ? owner?.ownerPicture
                                    : "/default_avatar.avif"
                                }
                                className="rounded-3 h-100 w-100 object-fit-contain"
                                alt=""
                              />
                            </div>
                          </td>
                          <td className="text-center ">{owner?.name}</td>
                          <td
                            className="text-center position-relative"
                            onClick={(e) =>
                              handleClick(e, owner._id, "startTime")
                            }
                          >
                            {ownerResult?.startTime
                              ?.split(":")
                              .slice(0, 2)
                              .join(":") || tournament?.startTime}

                            {editingCell.ownerId === owner._id &&
                              editingCell.field === "startTime" && (
                                <div
                                  className="time-edit-dropdown"
                                  style={{
                                    ...dropdownStyle,
                                    top: `${dropdownPosition.top}px`,
                                    left: `${dropdownPosition.left}px`,
                                  }}
                                >
                                  <div style={arrowStyle}></div>
                                  <div className="d-flex flex-column gap-2">
                                    <input
                                      type="time"
                                      value={formDat.startTime || ""}
                                      onChange={(e) =>
                                        handleTimeChange(
                                          e.target.value,
                                          "startTime"
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSave();
                                        } else if (e.key === 'Escape') {
                                          handleCancel();
                                        }
                                      }}
                                      placeholder="HH:MM"
                                      autoFocus
                                    />
                                    <div className="d-flex flex-column gap-2">
                                      <div className="d-flex justify-content-between gap-2">
                                        <button
                                          className="btn btn-sm btn-secondary"
                                          onClick={() => handleTimeChange("", "startTime")}
                                          style={{ fontSize: '12px' }}
                                        >
                                          Clear
                                        </button>
                                        <button
                                          className="btn btn-sm btn-warning"
                                          onClick={() => handleTimeChange("00:00", "startTime")}
                                          style={{ fontSize: '12px' }}
                                        >
                                          00:00
                                        </button>
                                      </div>
                                      <div className="d-flex justify-content-between gap-2">
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={handleCancel}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={handleSave}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </td>

                          {Array.from(
                            {
                              length:
                                tournament?.numberOfPigeons +
                                (tournament?.helperPigeons || 0),
                            },
                            (_, pigeonIndex) => (
                              <td
                                key={pigeonIndex}
                                className={`text-start position-relative ${
                                  ownerResult?.excludedIndices?.includes(
                                    pigeonIndex
                                  )
                                    ? ""
                                    : ""
                                }`}
                                onClick={(e) =>
                                  handleClick(
                                    e,
                                    owner._id,
                                    "timeList",
                                    pigeonIndex
                                  )
                                }
                              >
                                {ownerResult?.timeList?.[pigeonIndex]
                                  ?.split(":")
                                  .slice(0, 2)
                                  .join(":") || ""}

                                {editingCell.ownerId === owner._id &&
                                  editingCell.field === "timeList" &&
                                  editingCell.index === pigeonIndex && (
                                    <div
                                      className="time-edit-dropdown"
                                      style={{
                                        ...dropdownStyle,
                                        top: `${dropdownPosition.top}px`,
                                        left: `${dropdownPosition.left}px`,
                                      }}
                                    >
                                      <div style={arrowStyle}></div>
                                      <div className="d-flex flex-column gap-2">
                                        <input
                                          type="time"
                                          value={
                                            formDat.timeList[pigeonIndex] || ""
                                          }
                                          onChange={(e) =>
                                            handleTimeChange(
                                              e.target.value,
                                              "timeList",
                                              pigeonIndex
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleSave();
                                            } else if (e.key === 'Escape') {
                                              handleCancel();
                                            }
                                          }}
                                          placeholder="HH:MM"
                                          autoFocus
                                        />
                                        <div className="d-flex flex-column gap-2">
                                          <div className="d-flex justify-content-between gap-2">
                                            <button
                                              className="btn btn-sm btn-secondary"
                                              onClick={() => handleTimeChange("", "timeList", pigeonIndex)}
                                              style={{ fontSize: '12px' }}
                                            >
                                              Clear
                                            </button>
                                            <button
                                              className="btn btn-sm btn-warning"
                                              onClick={() => handleTimeChange("00:00", "timeList", pigeonIndex)}
                                              style={{ fontSize: '12px' }}
                                            >
                                              00:00
                                            </button>
                                          </div>
                                          <div className="d-flex justify-content-between gap-2">
                                            <button
                                              className="btn btn-sm btn-danger"
                                              onClick={handleCancel}
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              className="btn btn-sm btn-success"
                                              onClick={handleSave}
                                            >
                                              Save
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </td>
                            )
                          )}

                          <td className="text-center">
                            {gerResult?.length > 0 ? (
                              gerResult?.map((result, index) =>
                                result.pigeonOwnerId === owner?._id ? (
                                  <div key={index}>
                                    {result.formattedTotalTime || "00:00:00"}
                                  </div>
                                ) : null
                              )
                            ) : (
                              <></>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
          {/* card end */}
        </div>
      </MasterLayout>
    </>
  );
};

// Add these styles to your CSS file or style tag
const styles = `
  .time-edit-dropdown::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 20px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #ddd;
  }

  .time-edit-dropdown::after {
    content: '';
    position: absolute;
    top: -7px;
    left: 20px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }
`;

export default TournamentResult;
