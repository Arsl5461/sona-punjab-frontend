import React, { useEffect, useState, useRef } from "react";
import "./HomeBanner.css";
import { getAllBanners } from "../../adminPanal/Banners/__request/BannerRequest";

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const getBanners = async () => {
    try {
      const response = await getAllBanners();
      setBanners(response?.banners || []);
    } catch (err) {
      console.error("Error in fetching Banners", err);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  useEffect(() => {
    if (!banners.length) return undefined;
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [banners]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (!banners.length) {
    return (
      <div className="sp-banner-outer">
        <div className="sp-banner-placeholder">
          Tournament banners appear here — add slides from the dashboard (Home
          slider).
        </div>
      </div>
    );
  }

  return (
    <div className="sp-banner-outer">
      <div
        className="slider-container"
        style={{ overflow: "hidden", width: "100%" }}
      >
        <div
          ref={sliderRef}
          className="slider-wrapper"
          style={{ display: "flex", width: "100%" }}
        >
          {banners.map((banner, index) => (
            <img
              key={banner._id || banner.id || index}
              src={banner.bannerPicture}
              alt=""
              className="sp-banner-slide-img"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
