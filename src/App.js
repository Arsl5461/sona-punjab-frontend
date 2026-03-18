import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateSubAdmin from "./Component/adminPanal/create-user/CreateSubAdmin";
import HomePageOne from "./Component/adminPanal/HomePageOne";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import CreateTournaments from "./Component/adminPanal/create-tournaments/CreateTournaments";
import AllTournaments from "./Component/adminPanal/create-tournaments/AllTournaments";
import AllSubAdminList from "./Component/adminPanal/create-user/AllSubAdminList";
import Login from "./Component/adminPanal/Authentication/Login";
import AllBannersList from "./Component/adminPanal/Banners/AllBannersList";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Home from "./Component/userPanal/Home";
import PigeonOwnersList from "./Component/adminPanal/pigeon-owners/PigeonOwnersList";
import CreatePigeonOwner from "./Component/adminPanal/pigeon-owners/CreatePigeonOwner";
import TournamentResult from "./Component/adminPanal/create-tournaments/TournamentResult";
import OtherTournamentresult from "./Component/userPanal/other-tournament-result/OtherTournamentresult";
import ClubLists from "./Component/adminPanal/club/ClubLists";
import ClubAllTournaments from "./Component/userPanal/Home-Navbar/club-tournaments/ClubAllTournaments";

function App() {
  const [token, setToken] = useState(() => {
    const savedTokenLocal = localStorage.getItem("token");
    const savedTokenSession = sessionStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (
      (savedTokenLocal &&
        expiration &&
        Date.now() < parseInt(expiration, 10)) ||
      savedTokenSession
    ) {
      return savedTokenLocal || savedTokenSession; // Return the valid token
    } else {
      // Remove expired token from localStorage and sessionStorage
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      sessionStorage.removeItem("token");
      return null;
    }
  });

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiration = localStorage.getItem("tokenExpiration");
      if (expiration && Date.now() >= parseInt(expiration, 10)) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        sessionStorage.removeItem("token");
        setToken(null);
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournament-view/:tournamentId" element={<OtherTournamentresult />} />
        <Route path="/club-all-tournaments/:clubName" element={<ClubAllTournaments />} />
        {!token ? (
          <Route path="*" element={<Login setToken={setToken} />} />
        ) : (
          <>
            <Route
              path="/login"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route path="/dashboard" element={<HomePageOne />} />
            <Route path="/all-subAdmin" element={<AllSubAdminList />} />
            <Route path="/create-subAdmin" element={<CreateSubAdmin />} />
            <Route path="/create-tournaments" element={<CreateTournaments />} />
            <Route path="/all-tournaments" element={<AllTournaments />} />
            <Route path="/banners" element={<AllBannersList />} />
            <Route path="/all-pigeon-owners" element={<PigeonOwnersList />} />
            <Route path="/all-clubs" element={<ClubLists />} />

            <Route
              path="/create-pigeon-owner"
              element={<CreatePigeonOwner />}
            />
            <Route path="/create-result" element={<TournamentResult />} />
          </>
        )}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
