import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePublicZoomLayout } from "../../helper/usePublicZoomLayout";
import Marquee from "react-fast-marquee";
import HomeBanner from "./Home-Banne/HomeBanner";
import HomeNavbar from "./Home-Navbar/HomeNavbar";
import "./apna-shauq-home.css";
import { getCurrentTournamentsReq } from "./__request/HomePagerequests";
import {
  getResultByDate,
  getTotalDaysResultReq,
  GetTournamentOwnersReq,
} from "../adminPanal/create-tournaments/__request/CraeteTournamentRequest";
import { usePublicMarqueeText } from "../../helper/usePublicMarqueeText";
import {
  isGlobalLeadCellNewlyFilled,
  isLastWinnerDayCellNewlyFilled,
  snapshotGerResultTimes,
  snapshotTotalOwnerPigeons,
} from "../../helper/tournamentLeadBlink";

const Home = () => {
  const headlineText = usePublicMarqueeText();
  const [currentTournament, setCurrentTournament] = useState();
  const [resultDate, setResultDate] = useState();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const getCurrentTournament = async () => {
    try {
      const tournament = await getCurrentTournamentsReq();
      setCurrentTournament(tournament ?? null);
    } catch (err) {
      console.error("Error in fetching current Tournament");
    }
  };

  useEffect(() => {
    getCurrentTournament();
  }, []);

  /** Wide canvas + iOS-friendly zoom classes (see `usePublicZoomLayout`). */
  usePublicZoomLayout();

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
  //     // Convert "YYYY-MM-DD" to "DD-MM-YYYY"
  //     const [year, month, day] = date.split("-");
  //     const formattedDate = `${day}-${month}-${year}`;
  //     setResultDate((prev) => ({
  //       ...prev,
  //       date: formattedDate,
  //       startTime: currentTournament?.startTime,
  //     }));
  //     setSelectedDateIndex(index);
  //   };
  
  //   useEffect(() => {
  //     if (!currentTournament?.dates?.length) return;
  
  //     // Get current date in Pakistan timezone (Asia/Karachi)
  //     const pakistanTime = new Date().toLocaleString("en-US", {
  //       timeZone: "Asia/Karachi",
  //     });
  //     const currentDate = new Date(pakistanTime);
  //     // Reset time to midnight for date-only comparison
  //     currentDate.setHours(0, 0, 0, 0);
  
  //     // Sort dates as strings in "YYYY-MM-DD" format
  //     const sortedDates = [...currentTournament.dates].sort((a, b) =>
  //       a.localeCompare(b)
  //     );
  
  //     // Function to parse "YYYY-MM-DD" into a Date object without timezone influence
  //     const parseDate = (dateStr) => {
  //       const [year, month, day] = dateStr.split("-").map(Number);
  //       return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // Use UTC, midnight
  //     };
  
  //     // Map sorted dates to Date objects
  //     const tournamentDates = sortedDates.map(parseDate);
  
  //     // Find the current date or nearest future date
  //     let selectedDateIndex = 0;
  //     let minFutureDiff = Infinity;
  //     let foundCurrentDate = false;
  
  //     for (let i = 0; i < tournamentDates.length; i++) {
  //       const diff = tournamentDates[i] - currentDate;
  //       // Check if the date is the current date (same day)
  //       if (diff === 0) {
  //         foundCurrentDate = true;
  //         selectedDateIndex = i;
  //         break; // Prioritize current date
  //       }
  //       // Check for future dates
  //       if (diff > 0 && diff < minFutureDiff) {
  //         minFutureDiff = diff;
  //         selectedDateIndex = i;
  //       }
  //     }
  
  //     // If no current or future date is found, use the last date
  //     if (!foundCurrentDate && minFutureDiff === Infinity) {
  //       selectedDateIndex = tournamentDates.length - 1;
  //     }
  
  //     // Set the selected date from the sorted array
  //     const selectedDateStr = sortedDates[selectedDateIndex];
  //     handleDateSelect(selectedDateStr, selectedDateIndex);
  //   }, [currentTournament]);
  
  //   // Add a daily update mechanism
  //   useEffect(() => {
  //     // Run the date selection logic every day at midnight
  //     const updateDaily = () => {
  //       const now = new Date().toLocaleString("en-US", {
  //         timeZone: "Asia/Karachi",
  //       });
  //       const currentDate = new Date(now);
  //       currentDate.setHours(0, 0, 0, 0);
  
  //       // Trigger the same logic as above
  //       if (!currentTournament?.dates?.length) return;
  
  //       const sortedDates = [...currentTournament.dates].sort((a, b) =>
  //         a.localeCompare(b)
  //       );
  //       const parseDate = (dateStr) => {
  //         const [year, month, day] = dateStr.split("-").map(Number);
  //         return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  //       };
  //       const tournamentDates = sortedDates.map(parseDate);
  
  //       let selectedDateIndex = 0;
  //       let minFutureDiff = Infinity;
  //       let foundCurrentDate = false;
  
  //       for (let i = 0; i < tournamentDates.length; i++) {
  //         const diff = tournamentDates[i] - currentDate;
  //         if (diff === 0) {
  //           foundCurrentDate = true;
  //           selectedDateIndex = i;
  //           break;
  //         }
  //         if (diff > 0 && diff < minFutureDiff) {
  //           minFutureDiff = diff;
  //           selectedDateIndex = i;
  //         }
  //       }
  
  //       if (!foundCurrentDate && minFutureDiff === Infinity) {
  //         selectedDateIndex = tournamentDates.length - 1;
  //       }
  
  //       const selectedDateStr = sortedDates[selectedDateIndex];
  //       handleDateSelect(selectedDateStr, selectedDateIndex);
  //     };
  
  //     // Run immediately and then every 24 hours
  //     updateDaily();
  //     const interval = setInterval(updateDaily, 24 * 60 * 60 * 1000); // 24 hours
  
  //     return () => clearInterval(interval); // Cleanup on unmount
  //   }, [currentTournament]);

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
    const currentDate = new Date(Date.UTC(
      currentDateLocal.getFullYear(),
      currentDateLocal.getMonth(),
      currentDateLocal.getDate(),
      0, 0, 0
    ));

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
    const tournamentDates = sortedDates.map(parseDate).filter(date => date !== null);

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

  // Run on mount or when currentTournament changes. Layout effect so `resultDate`
  // updates before other effects (e.g. resultByDate) run with a stale date + new id.
  useLayoutEffect(() => {
    selectDefaultDate();
  }, [currentTournament]);

  // Run daily at Pakistan midnight
  useEffect(() => {
    let interval;

    // Schedule first update at Pakistan midnight
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
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
      if (!currentTournament?._id || !resultDate?.date) {
        setGetResult([]);
        return;
      }
      const response = await getResultByDate(
        currentTournament._id,
        resultDate.date
      );
      setGetResult(response);
    } catch (err) {
      console.error("Error in gettin result by Date", err);
    }
  };

  useEffect(() => {
    resultByDate();
  }, [resultDate?.date, currentTournament?._id]);

  const [totalDaysResult, setTotalDaysResult] = useState([]);

  const getTotalDaysResult = async () => {
    try {
      const response = await getTotalDaysResultReq(currentTournament?._id);
      setTotalDaysResult(response);
    } catch (err) {
      console.error("Error in getting Total Days Result", err);
    }
  };

  useEffect(() => {
    if (!currentTournament?._id) {
      setTotalDaysResult([]);
      return;
    }
    getTotalDaysResult();
  }, [currentTournament?._id]);

  // Add a new state for tracking if total view is selected
  const [showTotal, setShowTotal] = useState(false);

  // Add this new state to store all days' results
  const [allDaysResults, setAllDaysResults] = useState([]);

  useEffect(() => {
    setShowTotal(false);
    setAllDaysResults([]);
  }, [currentTournament?._id]);

  // Add this new function to fetch all days' results
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

  /** First winner = pigeon #1 only (index 0): owner with greatest time in that column. */
  const findFirstPigeonHighestTime = () => {
    const firstCol = 0;
    const dayCellToMinutes = (t) => {
      const parts = String(t).trim().split(":");
      if (parts.length < 2) return null;
      const h = Number(parts[0]);
      const m = Number(parts[1]);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };

    if (showTotal) {
      if (!totalDaysResult?.ownerResults) return null;
      let best = null;
      let bestOwnerId = null;

      totalDaysResult.ownerResults.forEach((owner) => {
        if (owner.excludedIndices?.includes(firstCol)) return;
        const t = owner.pigeons?.[firstCol]?.totalTime;
        if (t == null || t === "" || t === 0) return;
        const n = Number(t);
        if (Number.isNaN(n)) return;
        if (best === null || n > best) {
          best = n;
          bestOwnerId = owner.ownerId;
        }
      });

      return best === null ? null : { time: best, ownerId: bestOwnerId };
    }

    if (!Array.isArray(gerResult)) return null;
    let bestMins = null;
    let bestOwnerId = null;
    let bestTimeStr = null;

    gerResult.forEach((owner) => {
      if (owner.excludedIndices?.includes(firstCol)) return;
      const t = owner.timeList?.[firstCol];
      if (!t || t === "") return;
      const mins = dayCellToMinutes(t);
      if (mins == null) return;
      if (bestMins === null || mins > bestMins) {
        bestMins = mins;
        bestOwnerId = owner.pigeonOwnerId;
        bestTimeStr = t;
      }
    });

    return bestOwnerId == null
      ? null
      : { time: bestTimeStr, ownerId: bestOwnerId };
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
            const time = gerResult && gerResult?.length
              ? gerResult?.find(
                  (result) => result?.pigeonOwnerId === owner?._id
                )?.formattedTotalTime || "00:00"
              : "00:00";
            
            const [hours, minutes] = time.split(":").map(Number);
            return (hours * 60 + minutes) || 0;
          }
        };

        const resultA = getResult(a);
        const resultB = getResult(b);

        return resultB - resultA; // Sort in descending order
      })
    : [];

  const [highestTime, setHighestTime] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const leadBlinkTimerRef = useRef(null);
  const leadTournamentIdRef = useRef(null);
  const prevDaySnapRef = useRef(null);
  const prevTotalSnapRef = useRef(null);
  const showTotalRef = useRef(showTotal);

  useEffect(() => {
    return () => {
      if (leadBlinkTimerRef.current) {
        clearTimeout(leadBlinkTimerRef.current);
        leadBlinkTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const tid = currentTournament?._id;

    if (showTotalRef.current !== showTotal) {
      showTotalRef.current = showTotal;
      prevDaySnapRef.current = null;
      prevTotalSnapRef.current = null;
      setHighestTime(null);
      setIsBlinking(false);
    }

    if (leadTournamentIdRef.current !== tid) {
      leadTournamentIdRef.current = tid;
      prevDaySnapRef.current = null;
      prevTotalSnapRef.current = null;
      setHighestTime(null);
      setIsBlinking(false);
      return;
    }

    const prevDaySnap = prevDaySnapRef.current;
    const prevTotalSnap = prevTotalSnapRef.current;

    const leadPeak = findGlobalHighestTime();

    const newlyFilled =
      !!leadPeak &&
      (showTotal
        ? prevTotalSnap !== null &&
          isGlobalLeadCellNewlyFilled(
            prevTotalSnap,
            totalDaysResult,
            leadPeak
          )
        : prevDaySnap !== null &&
          isLastWinnerDayCellNewlyFilled(prevDaySnap, gerResult, leadPeak));

    if (Array.isArray(gerResult)) {
      prevDaySnapRef.current = snapshotGerResultTimes(gerResult);
    } else {
      prevDaySnapRef.current = new Map();
    }
    prevTotalSnapRef.current =
      snapshotTotalOwnerPigeons(totalDaysResult);

    if (!leadPeak) return;

    const nextVal = leadPeak.time;
    if (!showTotal) {
      if (!nextVal || nextVal === "00:00") return;
    } else {
      if (typeof nextVal !== "number" || nextVal <= 0) return;
    }

    const nextStr = String(nextVal);
    const prevStr = highestTime == null ? "" : String(highestTime);

    const triggerBlinkForFiveSeconds = () => {
      if (leadBlinkTimerRef.current) {
        clearTimeout(leadBlinkTimerRef.current);
      }
      setIsBlinking(true);
      leadBlinkTimerRef.current = window.setTimeout(() => {
        setIsBlinking(false);
        leadBlinkTimerRef.current = null;
      }, 5000);
    };

    if (showTotal ? prevTotalSnap === null : prevDaySnap === null) {
      triggerBlinkForFiveSeconds();
      setHighestTime(nextVal);
      return;
    }

    if (nextStr === prevStr) return;

    if (!newlyFilled) {
      setHighestTime(nextVal);
      return;
    }

    triggerBlinkForFiveSeconds();

    setHighestTime(nextVal);
  }, [
    gerResult,
    totalDaysResult,
    showTotal,
    highestTime,
    currentTournament?._id,
  ]);

  const globalLastWinnerDay =
    !showTotal && Array.isArray(gerResult) && gerResult.length > 0
      ? findGlobalHighestTime()
      : null;
  const globalFirstWinnerPigeon =
    (showTotal
      ? totalDaysResult?.ownerResults?.length
      : Array.isArray(gerResult) && gerResult.length > 0) &&
    currentTournament
      ? findFirstPigeonHighestTime()
      : null;

  const { pigeonSlots, helperSlots } = useMemo(() => {
    const rawP = Number(currentTournament?.numberOfPigeons);
    const rawH = Number(currentTournament?.helperPigeons);
    const p = Number.isFinite(rawP) ? Math.floor(rawP) : 0;
    const h = Number.isFinite(rawH) ? Math.floor(rawH) : 0;
    return {
      pigeonSlots: Math.max(0, Math.min(50, p)),
      helperSlots: Math.max(0, Math.min(50, h)),
    };
  }, [
    currentTournament?._id,
    currentTournament?.numberOfPigeons,
    currentTournament?.helperPigeons,
  ]);

  return (
    <div className="sp-public">
      <HomeBanner />
      <HomeNavbar />
      <div className="sp-marquee-wrap">
        <span className="sp-marquee-label">Headline:</span>
        <Marquee speed={42} gradient={false} pauseOnHover>
          {headlineText}
        </Marquee>
      </div>

      {!currentTournament?._id ? (
        <div className="sp-empty-tournament">
          <p>
            No active tournament is set. An admin can activate one from the
            dashboard: <strong>Tournaments → Edit → Screen on/off</strong>.
          </p>
        </div>
      ) : (
        <>
          <div className="sp-tournament-head">
            <h3 className="sp-tournament-title urdu">
              {String(currentTournament?.tournamentName ?? "")
                .replace(/\r\n|\r|\n/g, " ")
                .replace(/\s+/g, " ")
                .trim()}
            </h3>
            {/* <p className="sp-tournament-meta">
              Start time:{" "}
              <strong>
                {(currentTournament?.startTime || "").toString().slice(0, 5)}
              </strong>
            </p> */}
          </div>

          <div className="sp-date-row">
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
        <div className="sp-winner-box sp-winner-box--dual">
          <div className="sp-winner-item">
            <span className="sp-label">First winner:</span>{" "}
            <span>
              {(() => {
                const firstPigeonHighest = findFirstPigeonHighestTime();
                if (!firstPigeonHighest || !firstPigeonHighest.time)
                  return "No results yet";

                const winnerOwner =
                  owners?.find((o) => o._id === firstPigeonHighest.ownerId)
                    ?.name || "";

                const t = firstPigeonHighest.time;
                if (typeof t === "number") {
                  const h = Math.floor(t / 3600);
                  const m = Math.floor((t % 3600) / 60);
                  return `${String(h).padStart(2, "0")}:${String(m).padStart(
                    2,
                    "0"
                  )}, ${winnerOwner}`;
                }
                const [hours, minutes] = String(t).split(":");
                return `${hours}:${minutes}, ${winnerOwner}`;
              })()}
            </span>
          </div>
          <div className="sp-winner-item">
            <span>|</span>{" "}
            <span className="sp-label">Last winner:</span>{" "}
            <span>
              {(() => {
                const globalHighest = findGlobalHighestTime();
                if (!globalHighest || !globalHighest.time)
                  return "No results yet";

                const winnerOwner =
                  owners?.find((o) => o._id === globalHighest.ownerId)?.name ||
                  "";

                const [hours, minutes] = globalHighest.time.split(":");
                return `${hours}:${minutes}, ${winnerOwner}`;
              })()}
            </span>
          </div>
        </div>
      )}

      <div className="sp-stats-strip">
        <div className="sp-stats-row">
          <div>
            <span className="fw-bold">Lofts:</span>{" "}
            <span>
              {currentTournament?.participatingLofts?.length}
            </span>
          </div>
          <div>
            <span className="fw-bold">Pigeons:</span>{" "}
            <span>
              {(pigeonSlots + helperSlots) *
                currentTournament?.participatingLofts?.length}
            </span>{" "}
          </div>

          <div>
            <span className="fw-bold">Landed:</span>{" "}
            <span>
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
            <span className="fw-bold">Pigeons remaining:</span>{" "}
            <span>
              {(() => {
                const totalPigeons =
                  (pigeonSlots + helperSlots) *
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
      </div>

      <div className="sp-table-shell card-body p-0">
        <table className="table table-sm mb-0 sp-results-table">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                Sr #
              </th>
              <th scope="col" className="text-center">
                Picture
              </th>
              <th scope="col" className="text-start">
                Name
              </th>
              <th scope="col" className="text-center">
                Flying time
              </th>
              {showTotal ? (
                // Show dates as columns when Total is selected
                <>
                  {currentTournament?.dates?.map((date, index) => (
                    <th key={index} scope="col" className="text-center">
                      {date.split("-").reverse().join("-")}
                    </th>
                  ))}
                </>
              ) : (
                // Show pigeon numbers when specific date is selected
                <>
                  {Array.from({ length: pigeonSlots }, (_, index) => (
                    <th key={index} scope="col" className="text-center">
                      #{index + 1}
                    </th>
                  ))}
                  {Array.from({ length: helperSlots }, (_, index) => (
                    <th key={`helper-${index}`} scope="col" className="text-center">
                      #{pigeonSlots + index + 1}
                    </th>
                  ))}
                </>
              )}
              <th scope="col" className="text-center">
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
                <tr key={owner?._id} className="hover-row">
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">
                    <img
                      src={
                        owner?.ownerPicture
                          ? owner?.ownerPicture
                          : "/default_avatar.avif"
                      }
                      className="sp-owner-pic"
                      alt=""
                    />
                  </td>
                  <td className="text-start">
                    <div className="d-flex flex-column align-items-start justify-content-start">
                      <span className="sp-owner-name urdu">{owner?.name}</span>
                      {owner?.address ? (
                        <span className="small text-muted urdu">
                          {owner.address}
                        </span>
                      ) : null}
                      {owner?.phone ? (
                        <a
                          href={`tel:${String(owner.phone).replace(/\s/g, "")}`}
                          className="sp-owner-phone small urdu"
                        >
                          {owner.phone}
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td className="text-center fw-bold sp-flying-time">
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
                          <td key={dateIndex} className="text-center fw-bold">
                            {ownerResult?.formattedTotalTime?.slice(0, 5)
                              ? ownerResult.formattedTotalTime.slice(0, 5)
                              : null}
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
                        length: pigeonSlots + helperSlots,
                      }).map((_, index) => {
                        const pigeonTime = showTotal
                          ? ownerResult?.pigeons?.[index]?.totalTime
                          : ownerResult?.timeList?.[index];

                        const formattedPigeonTime =
                          pigeonTime?.length > 0 &&
                          pigeonTime?.split(":").slice(0, 2).join(":");

                        const lastIdxGlobal =
                          globalLastWinnerDay &&
                          owner._id === globalLastWinnerDay.ownerId &&
                          ownerResult?.timeList
                            ? ownerResult.timeList.lastIndexOf(
                                globalLastWinnerDay.time
                              )
                            : -1;

                        const isHighestTime =
                          globalLastWinnerDay &&
                          owner._id === globalLastWinnerDay.ownerId &&
                          lastIdxGlobal !== -1 &&
                          index === lastIdxGlobal;
                        const isExcluded =
                          ownerResult?.excludedIndices?.includes(index);
                        const isHelper = index >= pigeonSlots;
                        const isFirstWinnerCell =
                          !isExcluded &&
                          index === 0 &&
                          globalFirstWinnerPigeon &&
                          owner._id === globalFirstWinnerPigeon.ownerId;

                        const shouldBlink =
                          (isHighestTime || isFirstWinnerCell) && isBlinking;

                        const pigeonCellInner = showTotal
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
                            : null
                          : pigeonTime
                          ? `${formattedPigeonTime}${isExcluded ? "" : ""}`
                          : isExcluded
                          ? "(excluded)"
                          : null;

                        return (
                          <td
                            key={index}
                            className={`text-center fw-bold ${
                              isExcluded ? "text-muted" : ""
                            } ${isHighestTime ? "sp-pigeon-cell--lead" : ""} ${
                              isFirstWinnerCell
                                ? "sp-pigeon-cell--first-winner"
                                : ""
                            } ${
                              shouldBlink ? "sp-pigeon-cell--blink" : ""
                            }`}
                          >
                            {pigeonCellInner != null && pigeonCellInner !== ""
                              ? pigeonCellInner
                              : null}
                          </td>
                        );
                      })}
                    </>
                  )}
                  <td className="text-center fw-bold">
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
        </>
      )}
    </div>
  );
};

export default Home;
