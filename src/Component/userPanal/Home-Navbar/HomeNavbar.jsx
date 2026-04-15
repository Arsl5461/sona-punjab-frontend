import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const clubListPath = (name) =>
    `/club-all-tournaments/${encodeURIComponent(name || "")}`;

  const activeClubFromPath = (() => {
    const prefix = "/club-all-tournaments/";
    if (!location.pathname.startsWith(prefix)) return null;
    const raw = location.pathname.slice(prefix.length);
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  return (
    <header className="sp-topnav">
      <div className="sp-topnav-row">
        <div className="sp-topnav-brand">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "sp-nav-home sp-nav-home--active" : "sp-nav-home"
            }
          >
            Home
          </NavLink>
        </div>
        <nav className="sp-topnav-scroll" aria-label="Clubs">
          {allClubs?.length > 0 ? (
            allClubs.map((Club) => {
              const path = clubListPath(Club?.name);
              const isClubActive = activeClubFromPath === Club?.name;
              return (
                <Link
                  key={Club?._id || Club?.name}
                  to={path}
                  className={`sp-club-link urdu${
                    isClubActive ? " sp-club-link--active" : ""
                  }`}
                  onClick={() => {
                    dispatch(clunNameDispatcher(Club?.name));
                    dispatch(clunRefreshDispatcher(true));
                  }}
                >
                  {Club?.name}
                </Link>
              );
            })
          ) : null}
        </nav>
        <div className="sp-topnav-side">
          <Link to="/login" className="sp-nav-pill sp-nav-pill--accent sp-nav-pill--brand">
            Sona Punjab
          </Link>
          <Link
            className="sp-nav-pill"
            to="https://wa.me/13063510172"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
