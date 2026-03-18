import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllClubs } from "../../adminPanal/club/__requests/ClubRequests";
import {
  clunNameDispatcher,
  clunRefreshDispatcher,
} from "../../../redux/action";
import "./HomeNavbar.css";

const HomeNavbar = () => {
  const [allClubs, setAllClubs] = useState();

  const handleAllClubs = async () => {
    try {
      const response = await getAllClubs();
      if (response?.success === true) {
        setAllClubs(response?.clubs);
      }
    } catch (err) {
      console.error("Error in fetching tourament list", err);
    }
  };

  useEffect(() => {
    handleAllClubs();
  }, []);

  const dispatch = useDispatch();

  return (
    <>
      <div
        className="w-100 d-flex align-items-start justify-content-between p-3"
        style={{ backgroundColor: "#133E87", color: "white" }}
      >
        <div>
          <Link to="/" className="nav-btn">
            Home
          </Link>
        </div>
        <div className="w-100 px-5 d-flex align-items-start justify-content-center gap-5 flex-wrap">
          {allClubs?.length > 0 ? (
            allClubs?.map((Club) => {
              return (
                <>
                  <Link
                    to={`/club-all-tournaments/${Club?.name}`}
                    style={{
                      maxWidth: "100px",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                    className="club-link"
                    onClick={() => {
                      dispatch(clunNameDispatcher(Club?.name));
                      dispatch(clunRefreshDispatcher(true));
                    }}
                  >
                    <span
                      className="club-name"
                      style={{
                        // whiteSpace: "pre-wrap",
                        textAlign: "start",
                      }}
                    >
                      {Club?.name.split(" ").join("\n")}
                    </span>
                  </Link>
                </>
              );
            })
          ) : (
            <></>
          )}
        </div>
        <div className="d-flex align-items-center justify-content-center flex-column gap-2">
          <Link
            to="/login"
            className="nav-btn w-100"
            style={{ textWrap: "nowrap" }}
          >
            Sona Punjab
          </Link>
          <Link
            className="nav-btn"
            to="https://wa.me/13063510172"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomeNavbar;
