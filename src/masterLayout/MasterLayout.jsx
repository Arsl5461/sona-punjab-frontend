import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { CiBoxList, CiLogout } from "react-icons/ci";
import { PiFlagBannerFoldThin } from "react-icons/pi";
import "./MasterLayout.css";
import { useSelector } from "react-redux";
import { LuUsers } from "react-icons/lu";
import { IoMdHome } from "react-icons/io";

const MasterLayout = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  const loginUser = useSelector((state) => state.userDataReducer);

  useEffect(() => {
    // Function to handle dropdown clicks
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    // Function to open submenu based on current route
    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
          }
        });
      });
    };

    // Open the submenu that contains the open route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/dashboard" className="sidebar-logo">
            <img
              src="/SonaPunjab.jpg"
              alt="site logo"
              className="light-logo w-100 object-fit-cover"
            />
            <img
              src="/SonaPunjab.jpg"
              alt="site logo"
              className="dark-logo w-100 object-fit-cover"
            />
            <img src="SonaPunjab.jpg" alt="site logo" className="logo-icon" />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li>
              <NavLink
                to="/dashboard"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="mage:home" className="menu-icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <IoMdHome className="menu-icon" />
                <span>Home</span>
              </NavLink>
            </li>
            {loginUser?.role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/banners"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <PiFlagBannerFoldThin className="menu-icon" />

                    <span>Banners</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/all-clubs"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <LuUsers className="menu-icon" />

                    <span>Categories</span>
                  </NavLink>
                </li>
              </>
            )}

            <li>
              <NavLink
                to="/all-pigeon-owners"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <LuUsers className="menu-icon" />

                <span>Pigeon Owners</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/all-tournaments"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                {/* <Icon icon="mage:bar" className="menu-icon" /> */}
                <CiBoxList className="menu-icon" />

                <span>Tournaments List</span>
              </NavLink>
            </li>

            {loginUser?.role === "admin" && (
              <li>
                <NavLink
                  to="/all-subAdmin"
                  className={(navData) =>
                    navData.isActive ? "active-page" : ""
                  }
                >
                  <Icon icon="mage:user" className="menu-icon" />
                  <span>SubAdmin List</span>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/login"
                className="text-danger danger-Border"
                onClick={handleLogout}
              >
                <CiLogout className="menu-icon" />
                <span>Log Out</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon
                    icon="heroicons:bars-3-solid"
                    className="icon"
                    style={{ height: "80px", width: "80px" }}
                  />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ThemeToggleButton */}
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>
      </main>
    </section>
  );
};

export default MasterLayout;
