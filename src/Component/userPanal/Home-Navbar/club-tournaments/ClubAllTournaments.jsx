import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import {
  clunRefreshDispatcher,
  tournamentDataDispatcher,
} from "../../../../redux/action";
import {
  GetTournamentOwnersReq,
  getTotalDaysResultReq,
} from "../../../adminPanal/create-tournaments/__request/CraeteTournamentRequest";
import HomeBanner from "../../Home-Banne/HomeBanner";
import HomeNavbar from "../HomeNavbar";
import { getClubTournaments } from "./__requests/ClubTournamentsRequests";
import { useParams } from "react-router-dom";

const ClubAllTournaments = () => {
  const [clubAllTournaments, setClubAllTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tournamentOwners, setTournamentOwners] = useState({});
  const [tournamentResults, setTournamentResults] = useState({});
  const [activeYear, setActiveYear] = useState(null);
  // const clubName = useSelector((state) => state.clubNameReducer);
  const refreshClub = useSelector((state) => state.clubRefreshReducer);

  const { clubName } = useParams();

  const dispatch = useDispatch();

  const fetchTournamentData = async (tournamentId) => {
    try {
      const [ownersResponse, resultsResponse] = await Promise.all([
        GetTournamentOwnersReq(tournamentId),
        getTotalDaysResultReq(tournamentId),
      ]);

      if (ownersResponse) {
        setTournamentOwners((prev) => ({
          ...prev,
          [tournamentId]: ownersResponse,
        }));
      }

      if (resultsResponse) {
        setTournamentResults((prev) => ({
          ...prev,
          [tournamentId]: resultsResponse,
        }));
      }
    } catch (error) {
      console.error(
        `Error fetching data for tournament ${tournamentId}:`,
        error
      );
    }
  };

  const handleClubTournaments = async () => {
    try {
      setLoading(true);
      const response = await getClubTournaments(clubName);

      if (response?.success === true && response?.tournaments?.length > 0) {
        setClubAllTournaments(response.tournaments);

        // Fetch data for all tournaments in parallel
        await Promise.all(
          response.tournaments.map((tournament) =>
            fetchTournamentData(tournament._id)
          )
        );
      } else {
        setClubAllTournaments([]);
      }
      dispatch(clunRefreshDispatcher(false));
    } catch (err) {
      console.error("Error in fetching club tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedOwners = (tournamentId, tournament) => {
    const owners = tournamentOwners[tournamentId] || [];
    const results = tournamentResults[tournamentId]?.ownerResults || [];
    const prizes = [...(tournament.prizes || [])].sort((a, b) => b - a);

    // Debug logs

    if (!owners.length) {
      console.error("No owners found");
      return [];
    }

    // Combine owners with their results
    const ownersWithResults = owners.map((owner) => {
      const ownerResult = results.find(
        (result) => result.ownerId === owner._id
      );

      // Debug log for each owner mapping

      return {
        ...owner,
        grandTotal: ownerResult?.grandTotal || 0,
        hasResult: Boolean(ownerResult),
      };
    });

    // If there are results, sort and filter owners
    if (results.length > 0) {
      const sortedOwners = ownersWithResults
        .filter((owner) => owner.hasResult)
        .sort((a, b) => b.grandTotal - a.grandTotal);

      // Map prizes to top performers
      return sortedOwners.map((owner, index) => ({
        ...owner,
        prize: index < prizes.length ? prizes[index] : null,
      }));
    }

    // If no results yet, return all owners without prizes
    return ownersWithResults.map((owner) => ({
      ...owner,
      prize: null,
    }));
  };

  const formatTime = (seconds) => {
    if (!seconds) return "No Result";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  // Add this new function to get unique years and sort them
  const getUniqueYears = () => {
    const years = clubAllTournaments.map((tournament) =>
      new Date(tournament.dates[0]).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a); // Sort descending
  };

  // Add this function to filter and sort tournaments
  const getFilteredTournaments = () => {
    return clubAllTournaments
      .filter((tournament) => {
        const tournamentYear = new Date(tournament.dates[0]).getFullYear();
        return tournamentYear === activeYear;
      })
      .sort((a, b) => new Date(a.dates[0]) - new Date(b.dates[0])); // Sort by month
  };

  // Initialize data when component mounts or when clubName/refreshClub changes
  useEffect(() => {
    if (clubName) {
      handleClubTournaments();
    }
  }, [clubName, refreshClub]);

  // Set active year when tournaments are loaded
  useEffect(() => {
    if (clubAllTournaments.length > 0 && !activeYear) {
      const years = getUniqueYears();
      setActiveYear(years[0]);
    }
  }, [clubAllTournaments]);

  return (
    <div className="">
      <HomeBanner />
      <HomeNavbar />
      <div
        className="w-100 d-flex align-items-center justify-content-start p-1"
        style={{ backgroundColor: "#608BC1" }}
      >
        <span className="fw-bold text-white fs-5">Club Name : {clubName}</span>
      </div>

      <div className="container mt-3">
        <div className="d-flex gap-2 mb-3">
          {getUniqueYears().map((year) => (
            <button
              key={year}
              className={`btn ${
                activeYear === year ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 w-100">
        {loading ? (
          <div
            className="card p-5 d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <ScaleLoader color="#0d6efd" />
          </div>
        ) : clubAllTournaments.length === 0 ? (
          <div className="card p-5 text-center">
            <h4 className="text-muted">No tournaments available</h4>
            <p className="text-secondary">
              There are currently no tournaments in this club.
            </p>
          </div>
        ) : (
          getFilteredTournaments().map((tournament) => {
            const sortedOwners = getSortedOwners(tournament._id, tournament);
            return (
              <div key={tournament._id} className="card mb-4">
                <div className="d-flex align-items-start flex-column flex-md-row">
                  <Link
                    to={`/tournament-view/${tournament?._id}`}
                    onClick={() => {
                      dispatch(tournamentDataDispatcher(tournament));
                    }}
                  >
                    <img
                      src={tournament?.tournamentPicture}
                      height={200}
                      width={200}
                      alt=""
                      className="rounded"
                    />
                  </Link>
                  <div className="d-flex flex-column w-100">
                    <div className="card-header">
                      <div>
                        <Link
                          to={`/tournament-view/${tournament?._id}`}
                          onClick={() => {
                            dispatch(tournamentDataDispatcher(tournament));
                          }}
                        >
                          <h5 className="mb-2">{tournament.tournamentName}</h5>
                        </Link>
                        <p className="text-muted">
                          {new Date(tournament.dates[0]).toLocaleDateString()} -{" "}
                          {tournament.numberOfDays} days
                        </p>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table
                          className="table table-sm table-hover table-striped mb-0"
                          style={{
                            fontSize: "0.9rem",
                            borderCollapse: "collapse",
                            border: "1px solid #dee2e6",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <thead>
                            <tr className="bg-light">
                              <th
                                scope="col"
                                className="text-center p-1 border"
                              >
                                #
                              </th>
                              <th scope="col" className="text-start p-1 border">
                                Owner Name
                              </th>
                              <th
                                scope="col"
                                className="text-center p-1 border"
                              >
                                Time
                              </th>
                              <th
                                scope="col"
                                className="text-center p-1 border"
                              >
                                Prize
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedOwners.map((owner, index) => {
                              return (
                                <tr key={owner?._id}>
                                  <td className="text-center p-1 border fw-bold">
                                    {index + 1}
                                  </td>
                                  <td className="text-start p-1 border fw-bold">
                                    <div className="d-flex align-items-center gap-2">
                                      <img
                                        src={
                                          owner?.ownerPicture
                                            ? owner?.ownerPicture
                                            : "/default_avatar.avif"
                                        }
                                        alt=""
                                        className="rounded-circle"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <span className="fw-bold">
                                        {owner?.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="text-center p-1 border fw-bold">
                                    {formatTime(owner?.grandTotal)}
                                  </td>
                                  <td className="text-center p-1 border fw-bold">
                                    {owner?.hasResult && owner?.prize ? (
                                      <span className="fw-bold">
                                        {owner?.prize}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3 text-muted p-2">
                        <small>
                          <strong>Total Participants:</strong>{" "}
                          {sortedOwners.length} |{" "}
                          <strong>Total Prize Pool:</strong>{" "}
                          {tournament.prizes.reduce(
                            (a, b) => Number(a) + Number(b),
                            0
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClubAllTournaments;
