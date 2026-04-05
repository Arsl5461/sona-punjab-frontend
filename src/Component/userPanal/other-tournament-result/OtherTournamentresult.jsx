import React, { useEffect, useRef, useState } from "react";
import {
  getResultByDate,
  getTotalDaysResultReq,
  GetTournamentOwnersReq,
} from "../../adminPanal/create-tournaments/__request/CraeteTournamentRequest";
import { useSelector } from "react-redux";
import HomeBanner from "../Home-Banne/HomeBanner";
import HomeNavbar from "../Home-Navbar/HomeNavbar";
import { useParams } from "react-router-dom";
import { getSingleTournamentReq } from "../__request/HomePagerequests";
import "../apna-shauq-home.css";

const OtherTournamentresult = () => {
  // const currentTournament = useSelector((state) => state.tournamentDataReducer);

  const { tournamentId } = useParams();

  const [currentTournament, setCurrentTournament] = useState();
  const [resultDate, setResultDate] = useState();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const getCurrentTournament = async () => {
    try {
      const response = await getSingleTournamentReq(tournamentId);
      setCurrentTournament(response?.[0]);
    } catch (err) {
      console.error("Error in fetching current Tournament");
    }
  };

  useEffect(() => {
    getCurrentTournament();
  }, [tournamentId]);

  // const handleDateSelect = (date, index) => {
  //   // Convert "YYYY-MM-DD" to "DD-MM-YYYY"
  //   const [year, month, day] = date.split("-");
  //   const formattedDate = `${day}-${month}-${year}`;
  //   setResultDate((prev) => ({
  //     ...prev,
  //     date: formattedDate,
  //     startTime: currentTournament?.startTime,
  //   }));
  //   setSelectedDateIndex(index);
  // };

  // useEffect(() => {
  //   if (!currentTournament?.dates?.length) return;

  //   // Get current date in Pakistan timezone (Asia/Karachi)
  //   const pakistanTime = new Date().toLocaleString("en-US", {
  //     timeZone: "Asia/Karachi",
  //   });
  //   const currentDate = new Date(pakistanTime);

  //   // Sort dates as strings in "YYYY-MM-DD" format
  //   const sortedDates = [...currentTournament.dates].sort((a, b) =>
  //     a.localeCompare(b)
  //   );

  //   // Function to parse "YYYY-MM-DD" into a Date object without timezone influence
  //   const parseDate = (dateStr) => {
  //     const [year, month, day] = dateStr.split("-").map(Number);
  //     return new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid local timezone shifts
  //   };

  //   // Map sorted dates to Date objects
  //   const tournamentDates = sortedDates.map(parseDate);

  //   // Find the nearest future date
  //   let nearestDateIndex = 0;
  //   let minFutureDiff = Infinity;

  //   for (let i = 0; i < tournamentDates.length; i++) {
  //     const diff = tournamentDates[i] - currentDate;
  //     if (diff >= 0 && diff < minFutureDiff) {
  //       minFutureDiff = diff;
  //       nearestDateIndex = i;
  //     }
  //   }

  //   // If no future date is found, use the last date
  //   if (minFutureDiff === Infinity) {
  //     nearestDateIndex = tournamentDates.length - 1;
  //   }

  //   // Set the nearest date from the sorted array
  //   const nearestDateStr = sortedDates[nearestDateIndex];
  //   handleDateSelect(nearestDateStr, nearestDateIndex);
  // }, [currentTournament]);

  // const handleDateSelect = (date, index) => {
  //   // Convert "YYYY-MM-DD" to "DD-MM-YYYY"
  //   const [year, month, day] = date.split("-");
  //   const formattedDate = `${day}-${month}-${year}`;
  //   setResultDate((prev) => ({
  //     ...prev,
  //     date: formattedDate,
  //     startTime: currentTournament?.startTime,
  //   }));
  //   setSelectedDateIndex(index);
  // };

  // useEffect(() => {
  //   if (!currentTournament?.dates?.length) return;

  //   // Get current date in Pakistan timezone (Asia/Karachi)
  //   const pakistanTime = new Date().toLocaleString("en-US", {
  //     timeZone: "Asia/Karachi",
  //   });
  //   const currentDate = new Date(pakistanTime);
  //   // Reset time to midnight for date-only comparison
  //   currentDate.setHours(0, 0, 0, 0);

  //   // Sort dates as strings in "YYYY-MM-DD" format
  //   const sortedDates = [...currentTournament.dates].sort((a, b) =>
  //     a.localeCompare(b)
  //   );

  //   // Function to parse "YYYY-MM-DD" into a Date object without timezone influence
  //   const parseDate = (dateStr) => {
  //     const [year, month, day] = dateStr.split("-").map(Number);
  //     return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // Use UTC, midnight
  //   };

  //   // Map sorted dates to Date objects
  //   const tournamentDates = sortedDates.map(parseDate);

  //   // Find the current date or nearest future date
  //   let selectedDateIndex = 0;
  //   let minFutureDiff = Infinity;
  //   let foundCurrentDate = false;

  //   for (let i = 0; i < tournamentDates.length; i++) {
  //     const diff = tournamentDates[i] - currentDate;
  //     // Check if the date is the current date (same day)
  //     if (diff === 0) {
  //       foundCurrentDate = true;
  //       selectedDateIndex = i;
  //       break; // Prioritize current date
  //     }
  //     // Check for future dates
  //     if (diff > 0 && diff < minFutureDiff) {
  //       minFutureDiff = diff;
  //       selectedDateIndex = i;
  //     }
  //   }

  //   // If no current or future date is found, use the last date
  //   if (!foundCurrentDate && minFutureDiff === Infinity) {
  //     selectedDateIndex = tournamentDates.length - 1;
  //   }

  //   // Set the selected date from the sorted array
  //   const selectedDateStr = sortedDates[selectedDateIndex];
  //   handleDateSelect(selectedDateStr, selectedDateIndex);
  // }, [currentTournament]);

  // // Add a daily update mechanism
  // useEffect(() => {
  //   // Run the date selection logic every day at midnight
  //   const updateDaily = () => {
  //     const now = new Date().toLocaleString("en-US", {
  //       timeZone: "Asia/Karachi",
  //     });
  //     const currentDate = new Date(now);
  //     currentDate.setHours(0, 0, 0, 0);

  //     // Trigger the same logic as above
  //     if (!currentTournament?.dates?.length) return;

  //     const sortedDates = [...currentTournament.dates].sort((a, b) =>
  //       a.localeCompare(b)
  //     );
  //     const parseDate = (dateStr) => {
  //       const [year, month, day] = dateStr.split("-").map(Number);
  //       return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  //     };
  //     const tournamentDates = sortedDates.map(parseDate);

  //     let selectedDateIndex = 0;
  //     let minFutureDiff = Infinity;
  //     let foundCurrentDate = false;

  //     for (let i = 0; i < tournamentDates.length; i++) {
  //       const diff = tournamentDates[i] - currentDate;
  //       if (diff === 0) {
  //         foundCurrentDate = true;
  //         selectedDateIndex = i;
  //         break;
  //       }
  //       if (diff > 0 && diff < minFutureDiff) {
  //         minFutureDiff = diff;
  //         selectedDateIndex = i;
  //       }
  //     }

  //     if (!foundCurrentDate && minFutureDiff === Infinity) {
  //       selectedDateIndex = tournamentDates.length - 1;
  //     }

  //     const selectedDateStr = sortedDates[selectedDateIndex];
  //     handleDateSelect(selectedDateStr, selectedDateIndex);
  //   };

  //   // Run immediately and then every 24 hours
  //   updateDaily();
  //   const interval = setInterval(updateDaily, 24 * 60 * 60 * 1000); // 24 hours

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [currentTournament]);

  const handleDateSelect = (date, index) => {
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    setResultDate((prev) => ({
      ...prev,
      date: formattedDate,
      startTime: currentTournament?.startTime,
    }));
    setSelectedDateIndex(index);
  };

  const selectDefaultDate = () => {
    if (!currentTournament?.dates?.length) return;

    // Get current date in Pakistan timezone and convert to UTC midnight
    const pakistanTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
    });
    const currentDateLocal = new Date(pakistanTime);
    const currentDate = new Date(
      Date.UTC(
        currentDateLocal.getFullYear(),
        currentDateLocal.getMonth(),
        currentDateLocal.getDate(),
        0,
        0,
        0
      )
    );

    // Sort dates
    const sortedDates = [...currentTournament.dates].sort((a, b) =>
      a.localeCompare(b)
    );

    // Parse "YYYY-MM-DD" to Date object
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      return isNaN(date) ? null : date;
    };

    // Map sorted dates to Date objects, filter out invalid dates
    const tournamentDates = sortedDates
      .map(parseDate)
      .filter((date) => date !== null);

    // Find current or nearest future date
    let selectedDateIndex = 0;
    let minFutureDiff = Infinity;
    let foundCurrentDate = false;

    for (let i = 0; i < tournamentDates.length; i++) {
      const diff = tournamentDates[i] - currentDate;
      if (diff === 0) {
        foundCurrentDate = true;
        selectedDateIndex = i;
        break;
      }
      if (diff > 0 && diff < minFutureDiff) {
        minFutureDiff = diff;
        selectedDateIndex = i;
      }
    }

    // If no current or future date is found, use the last date
    if (!foundCurrentDate && minFutureDiff === Infinity) {
      selectedDateIndex = tournamentDates.length - 1;
    }

    // Set the selected date
    const selectedDateStr = sortedDates[selectedDateIndex];
    if (selectedDateStr) {
      handleDateSelect(selectedDateStr, selectedDateIndex);
    }
  };

  // Run on mount or when currentTournament changes
  useEffect(() => {
    selectDefaultDate();
  }, [currentTournament]);

  // Run daily at Pakistan midnight
  useEffect(() => {
    let interval;

    // Schedule first update at Pakistan midnight
    const now = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
    });
    const currentDate = new Date(now);
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeToMidnight = midnight - currentDate;

    // Run immediately
    selectDefaultDate();

    // Schedule daily updates
    const timeout = setTimeout(() => {
      selectDefaultDate();
      interval = setInterval(selectDefaultDate, 24 * 60 * 60 * 1000); // 24 hours
    }, timeToMidnight);

    // Cleanup
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [currentTournament]);

  // xxxxxxxxxxxxxxxxxxxxxxxxxx>> Get tournament owners <<xxxxxxxxxxxxxxxxxxxxxxxxxx

  const [owners, setOwners] = useState();

  const GetTournamentOwners = async () => {
    try {
      const response = await GetTournamentOwnersReq(currentTournament?._id);
      setOwners(response);
    } catch (err) {
      console.error("Error in getting Tourament Owners", err);
    }
  };

  useEffect(() => {
    if (currentTournament?._id) {
      GetTournamentOwners();
    }
  }, [currentTournament]);

  // xxxxxxxxxxxxxxxxxxxxxxxxxx>> Get tournament Result <<xxxxxxxxxxxxxxxxxxxxxxxxxx

  const [gerResult, setGetResult] = useState([]);

  const resultByDate = async () => {
    try {
      const response = await getResultByDate(
        currentTournament?._id,
        resultDate?.date
      );
      setGetResult(response);
    } catch (err) {
      console.error("Error in gettin result by Date", err);
    }
  };

  useEffect(() => {
    resultByDate();
  }, [resultDate]);

  // Add new state for total results and show total
  const [totalDaysResult, setTotalDaysResult] = useState([]);
  const [showTotal, setShowTotal] = useState(false);

  const [allDaysResults, setAllDaysResults] = useState([]);

  const getAllDaysResults = async () => {
    try {
      const allResults = await Promise.all(
        currentTournament?.dates?.map(async (date) => {
          const formattedDate = date.split("-").reverse().join("-");
          const response = await getResultByDate(
            currentTournament?._id,
            formattedDate
          );
          return { date: formattedDate, results: response };
        })
      );
      setAllDaysResults(allResults);
    } catch (err) {
      console.error("Error in getting all days results", err);
    }
  };

  // Add this useEffect to fetch all days' results when Total is clicked
  useEffect(() => {
    if (showTotal && currentTournament?._id) {
      getAllDaysResults();
    }
  }, [showTotal, currentTournament]);

  // Add the getTotalDaysResult function
  const getTotalDaysResult = async () => {
    try {
      const response = await getTotalDaysResultReq(currentTournament?._id);
      setTotalDaysResult(response);
    } catch (err) {
      console.error("Error in getting Total Days Result", err);
    }
  };

  // Add useEffect for total days result

  useEffect(() => {
    if (currentTournament?._id) {
      getTotalDaysResult();
    }
  }, [currentTournament]);

  // Find global highest time across all owners and pigeons
  const findGlobalHighestTime = () => {
    if (showTotal) {
      if (!totalDaysResult?.ownerResults) return null;
      let highest = 0;
      let highestOwnerId = null;
      let highestPigeonIndex = null;

      totalDaysResult.ownerResults.forEach((owner) => {
        owner.pigeons?.forEach((pigeon, index) => {
          if (pigeon.totalTime && pigeon.totalTime > highest) {
            highest = pigeon.totalTime;
            highestOwnerId = owner.ownerId;
            highestPigeonIndex = index;
          }
        });
      });
      return {
        time: highest,
        ownerId: highestOwnerId,
        pigeonIndex: highestPigeonIndex,
      };
    } else {
      if (!Array.isArray(gerResult)) return null;
      let highest = "00:00";
      let highestOwnerId = null;
      let highestPigeonIndex = null;

      gerResult.forEach((owner) => {
        owner.timeList?.forEach((time, index) => {
          if (time && time > highest) {
            highest = time;
            highestOwnerId = owner.pigeonOwnerId;
            highestPigeonIndex = index;
          }
        });
      });
      return {
        time: highest,
        ownerId: highestOwnerId,
        pigeonIndex: highestPigeonIndex,
      };
    }
  };

  // const findFirstPigeonLowestTime = () => {
  //   if (showTotal) {
  //     if (!totalDaysResult?.ownerResults) return null;
  //     let lowest = Infinity;
  //     let lowestOwnerId = null;

  //     totalDaysResult.ownerResults.forEach((owner) => {
  //       // Find the first non-excluded pigeon
  //       const firstValidPigeon = owner.pigeons?.find(
  //         (pigeon, index) =>
  //           !owner.excludedIndices?.includes(index) && pigeon.totalTime
  //       );

  //       if (
  //         firstValidPigeon?.totalTime &&
  //         firstValidPigeon.totalTime < lowest
  //       ) {
  //         lowest = firstValidPigeon.totalTime;
  //         lowestOwnerId = owner.ownerId;
  //       }
  //     });

  //     return lowest === Infinity
  //       ? null
  //       : { time: lowest, ownerId: lowestOwnerId };
  //   } else {
  //     if (!Array.isArray(gerResult)) return null;
  //     let lowest = "99:99"; // Set to a high default value for comparison
  //     let lowestOwnerId = null;

  //     gerResult.forEach((owner) => {
  //       // Find index of first non-excluded time
  //       const firstValidIndex = owner.timeList?.findIndex(
  //         (time, index) => !owner.excludedIndices?.includes(index) && time
  //       );

  //       if (firstValidIndex !== -1) {
  //         const firstValidTime = owner.timeList[firstValidIndex];
  //         if (firstValidTime && firstValidTime < lowest) {
  //           lowest = firstValidTime;
  //           lowestOwnerId = owner.pigeonOwnerId;
  //         }
  //       }
  //     });

  //     return lowest === "99:99"
  //       ? null
  //       : { time: lowest, ownerId: lowestOwnerId };
  //   }
  // };

  const findFirstPigeonHighestTime = () => {
    if (showTotal) {
      if (!totalDaysResult?.ownerResults) return null;
      let highest = 0;
      let highestOwnerId = null;

      totalDaysResult.ownerResults.forEach((owner) => {
        // Find the first non-excluded pigeon
        const firstValidPigeon = owner.pigeons?.find(
          (pigeon, index) =>
            !owner.excludedIndices?.includes(index) && pigeon.totalTime
        );

        if (
          firstValidPigeon?.totalTime &&
          firstValidPigeon?.totalTime > highest
        ) {
          highest = firstValidPigeon.totalTime;
          highestOwnerId = owner.ownerId;
        }
      });

      return highest === 0 ? null : { time: highest, ownerId: highestOwnerId };
    } else {
      if (!Array.isArray(gerResult)) return null;
      let highest = "00:00"; // Set to a low default value for comparison
      let highestOwnerId = null;

      gerResult.forEach((owner) => {
        // Find index of first non-excluded time
        const firstValidIndex = owner.timeList?.findIndex(
          (time, index) => !owner.excludedIndices?.includes(index) && time
        );

        if (firstValidIndex !== -1) {
          const firstValidTime = owner.timeList[firstValidIndex];
          if (firstValidTime && firstValidTime > highest) {
            highest = firstValidTime;
            highestOwnerId = owner.pigeonOwnerId;
          }
        }
      });

      return highest === "00:00"
        ? null
        : { time: highest, ownerId: highestOwnerId };
    }
  };

  const pOwners = owners ?? []; // Ensure owners is an array

  const sortedPOwners = Array.isArray(pOwners)
    ? [...pOwners].sort((a, b) => {
        const getResult = (owner) => {
          if (showTotal) {
            // For total view, calculate sum of all days
            const ownerDayResults = allDaysResults
              .map((dayResult) => {
                if (!Array.isArray(dayResult.results)) return null;
                const result = dayResult.results.find(
                  (r) => r.pigeonOwnerId === owner?._id
                );
                return result?.formattedTotalTime;
              })
              .filter((time) => time);

            // Convert all times to minutes and sum them
            const totalMinutes = ownerDayResults.reduce((sum, time) => {
              if (!time) return sum;
              const [hours, minutes] = time.split(":").map(Number);
              return sum + (hours * 60 + minutes);
            }, 0);

            return totalMinutes;
          } else {
            // For single day view, use the existing logic
            const time =
              gerResult && gerResult?.length
                ? gerResult?.find(
                    (result) => result?.pigeonOwnerId === owner?._id
                  )?.formattedTotalTime || "00:00"
                : "00:00";

            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes || 0;
          }
        };

        const resultA = getResult(a);
        const resultB = getResult(b);

        return resultB - resultA; // Sort in descending order
      })
    : [];

  const [highestTime, setHighestTime] = useState(() => {
    return localStorage.getItem("highestTime") || null;
  });
  const [isBlinking, setIsBlinking] = useState(false);
  const leadBlinkTimerRef = useRef(null);
  const leadTournamentIdRef = useRef(null);

  useEffect(() => {
    return () => {
      if (leadBlinkTimerRef.current) {
        clearTimeout(leadBlinkTimerRef.current);
        leadBlinkTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const tid = tournamentId;
    if (leadTournamentIdRef.current !== tid) {
      leadTournamentIdRef.current = tid;
      setHighestTime(null);
      setIsBlinking(false);
      return;
    }

    const globalHighest = findGlobalHighestTime();
    if (!globalHighest) return;

    const nextVal = globalHighest.time;
    if (!showTotal) {
      if (!nextVal || nextVal === "00:00") return;
    } else {
      if (typeof nextVal !== "number" || nextVal <= 0) return;
    }

    const nextStr = String(nextVal);
    const prevStr = highestTime == null ? "" : String(highestTime);
    if (nextStr === prevStr) return;

    const storageKey = `spLead:${tid || "na"}:${nextStr}`;
    if (!localStorage.getItem(storageKey)) {
      if (leadBlinkTimerRef.current) {
        clearTimeout(leadBlinkTimerRef.current);
      }
      setIsBlinking(true);
      localStorage.setItem(storageKey, "1");
      localStorage.setItem("highestTime", nextStr);
      leadBlinkTimerRef.current = window.setTimeout(() => {
        setIsBlinking(false);
        leadBlinkTimerRef.current = null;
      }, 5000);
    }

    setHighestTime(nextVal);
  }, [
    gerResult,
    totalDaysResult,
    showTotal,
    highestTime,
    tournamentId,
  ]);

  return (
    <div className="sp-public">
      <HomeBanner />
      <HomeNavbar />
      <div
        className="w-100 d-flex align-items-center justify-content-start p-1"
        style={{ backgroundColor: "#1e3d8f" }}
      >
        <span className="fw-bold text-white fs-5">
          Currect Tournament : {currentTournament?.tournamentName}
        </span>
      </div>

      <div className="sp-date-row w-100" style={{ padding: "10px" }}>
        {currentTournament?.dates
          ?.slice()
          .sort((a, b) => a.localeCompare(b))
          .map((date, index) => {
            const isSelected = !showTotal && selectedDateIndex === index;
            const formattedDate = date.split("-").reverse().join("-");
            return (
              <button
                type="button"
                key={index}
                className={`sp-date-tab${
                  isSelected ? " sp-date-tab--active" : ""
                }`}
                onClick={() => {
                  handleDateSelect(date, index);
                  setShowTotal(false);
                }}
              >
                {formattedDate}
              </button>
            );
          })}

        <button
          type="button"
          className={`sp-date-tab${showTotal ? " sp-date-tab--active" : ""}`}
          onClick={() => setShowTotal(true)}
        >
          Total
        </button>
      </div>

      {!showTotal && (
        <div className="sp-winner-box">
          <span className="sp-label">Today&apos;s first pigeon winner:</span>{" "}
          <span>
            {(() => {
              const firstPigeonHighest = findFirstPigeonHighestTime();
              if (!firstPigeonHighest || !firstPigeonHighest.time)
                return "No results yet";

              const winnerOwner =
                owners?.find((o) => o._id === firstPigeonHighest.ownerId)
                  ?.name || "";

              const [hours, minutes] = firstPigeonHighest?.time.split(":");
              return `${hours}:${minutes}, ${winnerOwner}`;
            })()}
          </span>
        </div>
      )}

      <div className="sp-stats-strip">
        <div className="sp-stats-row d-flex align-items-center gap-3">
          <div>
            <span className="fw-bold" style={{ color: "var(--sp-gold-light)" }}>
              Lofts:
            </span>{" "}
            <span className="text-white">
              {currentTournament?.participatingLofts?.length}
            </span>
          </div>
          <div>
            <span className="fw-bold" style={{ color: "var(--sp-gold-light)" }}>
              Pigeons:
            </span>{" "}
            <span className="text-white">
              {(currentTournament?.numberOfPigeons +
                (currentTournament?.helperPigeons || 0)) *
                currentTournament?.participatingLofts?.length}
            </span>{" "}
          </div>

          <div>
            <span className="fw-bold" style={{ color: "var(--sp-gold-light)" }}>
              Landed:
            </span>{" "}
            <span className="text-white">
              {showTotal
                ? totalDaysResult?.ownerResults?.reduce((total, owner) => {
                    return (
                      total +
                      owner.pigeons?.filter(
                        (pigeon) => pigeon.totalTime !== null
                      ).length
                    );
                  }, 0) || 0
                : Array.isArray(gerResult)
                ? gerResult.reduce((total, owner) => {
                    return (
                      total +
                      (owner.timeList?.filter((time) => time !== null)
                        ?.length || 0)
                    );
                  }, 0)
                : 0}
            </span>{" "}
          </div>

          <div>
            <span className="fw-bold" style={{ color: "var(--sp-gold-light)" }}>
              Pigeons remaining:
            </span>{" "}
            <span className="text-white">
              {(() => {
                const totalPigeons =
                  (currentTournament?.numberOfPigeons +
                    (currentTournament?.helperPigeons || 0)) *
                  currentTournament?.participatingLofts?.length;

                const landedPigeons = showTotal
                  ? totalDaysResult?.ownerResults?.reduce((total, owner) => {
                      return (
                        total +
                        (owner.pigeons?.filter(
                          (pigeon) => pigeon.totalTime !== null
                        ).length || 0)
                      );
                    }, 0) || 0
                  : Array.isArray(gerResult)
                  ? gerResult.reduce((total, owner) => {
                      return (
                        total +
                        (owner.timeList?.filter((time) => time !== null)
                          ?.length || 0)
                      );
                    }, 0)
                  : 0;

                return Math.max(0, totalPigeons - landedPigeons);
              })()}
            </span>
          </div>
        </div>

        {showTotal
          ? totalDaysResult?.ownerResults?.length > 0 && <></>
          : gerResult?.length > 0 && (
              <>
                <div
                  className="rounded-3 shadow-lg"
                  style={{
                    backgroundColor: "#2d55c8",
                    border: "1px solid white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
                    color: "white", // Dark text for better visibility
                    fontSize: "16px", // Improve readability
                    fontWeight: "500", // Slightly bold
                    padding: "5px",
                  }}
                >
                  <span className="fw-bold" style={{ color: "white" }}>
                    Last pigeon winner:
                  </span>{" "}
                  <span>
                    {(() => {
                      const globalHighest = findGlobalHighestTime();
                      if (!globalHighest || !globalHighest.time)
                        return "No results yet";

                      const winnerOwner =
                        owners?.find((o) => o._id === globalHighest.ownerId)
                          ?.name || "";

                      if (showTotal) {
                        const hours = Math.floor(globalHighest.time / 3600);
                        const minutes = Math.floor(
                          (globalHighest.time % 3600) / 60
                        );
                        return `${hours}h ${minutes}m, ${winnerOwner}`;
                      } else {
                        const [hours, minutes] = globalHighest.time.split(":");
                        return `${hours}:${minutes}, ${winnerOwner}`;
                      }
                    })()}
                  </span>
                  <br />
                </div>
              </>
            )}
      </div>

      <div className="sp-table-shell table-responsive-app card-body p-0">
        <table
          className="table table-sm mb-0 sp-results-table"
          style={{
            fontSize: "0.9rem",
            borderCollapse: "collapse",
            border: "1px solid #dee2e6",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #dee2e6",
              }}
            >
              <th scope="col" className="text-center p-0 border">
                #
              </th>
              <th scope="col" className="text-start p-0 border">
                Owner
              </th>
              <th scope="col" className="text-center p-0 border">
                Pigeons
              </th>
              <th scope="col" className="text-center p-0 border">
                Time
              </th>
              {showTotal ? (
                // Show dates as columns when Total is selected
                <>
                  {currentTournament?.dates?.map((date, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="text-center p-1 border"
                    >
                      {date.split("-").reverse().join("-")}
                    </th>
                  ))}
                </>
              ) : (
                // Show pigeon numbers when specific date is selected
                <>
                  {Array.from(
                    { length: currentTournament?.numberOfPigeons },
                    (_, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="text-center p-1 border"
                      >
                        #{index + 1}
                      </th>
                    )
                  )}
                  {Array.from(
                    { length: currentTournament?.helperPigeons || 0 },
                    (_, index) => (
                      <th
                        key={`helper-${index}`}
                        scope="col"
                        className="text-center p-1 border"
                      >
                        #{currentTournament?.numberOfPigeons + index + 1}
                      </th>
                    )
                  )}
                </>
              )}
              <th scope="col" className="text-center p-0 border">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPOwners?.map((owner, idx) => {
              const ownerResult = showTotal
                ? totalDaysResult?.ownerResults?.find(
                    (result) => result.ownerId === owner?._id
                  )
                : Array.isArray(gerResult)
                ? gerResult &&
                  gerResult?.find(
                    (result) => result?.pigeonOwnerId === owner?._id
                  )
                : null;

              return (
                <tr
                  key={owner?._id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9fa",
                  }}
                  className="hover-row"
                >
                  <td className="text-center p-1 border fw-bold">{idx + 1}</td>
                  <td className="text-start p-1 border fw-bold">
                    <div className="d-flex align-items-center justify-content-start gap-2">
                      <div
                        className="overflow-hidden"
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "100%",
                        }}
                      >
                        <img
                          src={
                            owner?.ownerPicture
                              ? owner?.ownerPicture
                              : "/default_avatar.avif"
                          }
                          className="rounded-3 h-100 w-100 object-fit-cover"
                          alt=""
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start justify-content-start fw-bold">
                        {owner?.name}
                        <span className="fw-normal">{owner?.address}</span>
                        <span className="fw-normal">{owner?.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-1 border fw-bold">
                    {currentTournament?.numberOfPigeons}
                  </td>
                  <td className="text-center p-1 border fw-bold">
                    {(
                      (gerResult &&
                        gerResult?.length > 0 &&
                        gerResult?.find((o) => o.pigeonOwnerId === owner?._id)
                          ?.startTime) ||
                      currentTournament?.startTime
                    )?.slice(0, 5)}
                  </td>
                  {showTotal ? (
                    // Show results for each date when Total is selected
                    <>
                      {currentTournament?.dates?.map((date, dateIndex) => {
                        const formattedDate = date
                          .split("-")
                          .reverse()
                          .join("-");
                        const dateResults = allDaysResults.find(
                          (dayResult) => dayResult.date === formattedDate
                        );
                        // Add null check and ensure results is an array
                        const ownerResult = Array.isArray(dateResults?.results)
                          ? dateResults.results.find(
                              (result) => result.pigeonOwnerId === owner?._id
                            )
                          : null;

                        return (
                          <td
                            key={dateIndex}
                            className="text-center p-1 border fw-bold"
                          >
                            {ownerResult?.formattedTotalTime?.slice(0, 5) ||
                              "No Result"}
                          </td>
                        );
                      })}
                    </>
                  ) : (
                    // Show individual pigeon times when specific date is selected
                    <>
                      {/* {Array.from({
                        length:
                          currentTournament?.numberOfPigeons +
                          (currentTournament?.helperPigeons || 0),
                      }).map((_, index) => {
                        const pigeonTime = showTotal
                          ? ownerResult?.pigeons?.[index]?.totalTime
                          : ownerResult?.timeList?.[index];
                        const formattedPigeonTime =
                          pigeonTime?.length > 0 &&
                          pigeonTime?.split(":").slice(0, 2).join(":");

                        const globalHighest = findGlobalHighestTime();
                        const lastIndexOfHighest =
                          globalHighest &&
                          ownerResult?.timeList?.lastIndexOf(
                            globalHighest.time
                          );

                        const isHighestTime =
                          globalHighest &&
                          owner._id === globalHighest.ownerId &&
                          index === lastIndexOfHighest;

                        const isExcluded =
                          ownerResult?.excludedIndices?.includes(index);
                        const isHelper =
                          index >= currentTournament?.numberOfPigeons;

                        return (
                          <td
                            key={index}
                            className={`text-center p-1 border ${
                              isExcluded ? "text-muted" : ""
                            }`}
                            style={{
                              backgroundColor: isHighestTime ? "#78B3CE" : "",
                              color: isHighestTime ? "white" : "inherit",
                            }}
                          >
                            {showTotal
                              ? pigeonTime
                                ? (() => {
                                    const hours = Math.floor(pigeonTime / 3600);
                                    const minutes = Math.floor(
                                      (pigeonTime % 3600) / 60
                                    );
                                    return `${hours}:${minutes}${
                                      isExcluded ? "" : ""
                                    }`;
                                  })()
                                : isExcluded
                                ? "(excluded)"
                                : ""
                              : pigeonTime
                              ? `${formattedPigeonTime}${isExcluded ? "" : ""}`
                              : isExcluded
                              ? "(excluded)"
                              : ""}
                          </td>
                        );
                      })} */}
                      {Array.from({
                        length:
                          currentTournament?.numberOfPigeons +
                          (currentTournament?.helperPigeons || 0),
                      }).map((_, index) => {
                        const pigeonTime = showTotal
                          ? ownerResult?.pigeons?.[index]?.totalTime
                          : ownerResult?.timeList?.[index];

                        const formattedPigeonTime =
                          pigeonTime?.length > 0 &&
                          pigeonTime?.split(":").slice(0, 2).join(":");

                        const globalHighest = findGlobalHighestTime();
                        const lastIndexOfHighest =
                          globalHighest &&
                          ownerResult?.timeList?.lastIndexOf(
                            globalHighest.time
                          );

                        const isHighestTime =
                          globalHighest &&
                          owner._id === globalHighest.ownerId &&
                          index === lastIndexOfHighest;

                        const isExcluded =
                          ownerResult?.excludedIndices?.includes(index);
                        const isHelper =
                          index >= currentTournament?.numberOfPigeons;

                        const shouldBlink = isHighestTime && isBlinking;

                        return (
                          <td
                            key={index}
                            className={`text-center p-1 border fw-bold ${
                              isExcluded ? "text-muted" : ""
                            } ${isHighestTime ? "sp-pigeon-cell--lead" : ""} ${
                              shouldBlink ? "sp-pigeon-cell--blink" : ""
                            }`}
                          >
                            {showTotal
                              ? pigeonTime
                                ? (() => {
                                    const hours = Math.floor(pigeonTime / 3600);
                                    const minutes = Math.floor(
                                      (pigeonTime % 3600) / 60
                                    );
                                    return `${hours}:${minutes}${
                                      isExcluded ? "" : ""
                                    }`;
                                  })()
                                : isExcluded
                                ? "(excluded)"
                                : ""
                              : pigeonTime
                              ? `${formattedPigeonTime}${isExcluded ? "" : ""}`
                              : isExcluded
                              ? "(excluded)"
                              : ""}
                          </td>
                        );
                      })}
                    </>
                  )}
                  <td className="text-center p-1 border fw-bold">
                    {showTotal
                      ? (() => {
                          const ownerDayResults = allDaysResults
                            .map((dayResult) => {
                              if (!Array.isArray(dayResult.results))
                                return null;
                              const result = dayResult.results.find(
                                (r) => r.pigeonOwnerId === owner?._id
                              );
                              return result?.formattedTotalTime;
                            })
                            .filter((time) => time);

                          if (ownerDayResults.length === 0) return "No Result";

                          // Convert times to minutes and sum
                          const totalMinutes = ownerDayResults.reduce(
                            (sum, time) => {
                              if (!time) return sum;
                              const [hours, minutes] = time
                                .split(":")
                                .map(Number);
                              return sum + (hours * 60 + minutes);
                            },
                            0
                          );

                          // Convert back to HH:MM format
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          return `${String(hours).padStart(2, "0")}:${String(
                            minutes
                          ).padStart(2, "0")}`;
                        })()
                      : gerResult?.length > 0
                      ? gerResult
                          ?.find(
                            (result) => result.pigeonOwnerId === owner?._id
                          )
                          ?.formattedTotalTime?.slice(0, 5) || "No Result"
                      : "No Result"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtherTournamentresult;
