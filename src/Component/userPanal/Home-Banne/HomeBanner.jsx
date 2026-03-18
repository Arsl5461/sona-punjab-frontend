import React, { useEffect, useState, useRef } from "react";
import "./HomeBanner.css";
import { getAllBanners } from "../../adminPanal/Banners/__request/BannerRequest";

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  // Fetch banners
  const getBanners = async () => {
    try {
      const response = await getAllBanners();
      setBanners(response?.banners || []);
    } catch (err) {
      console.lerrorog("Error in fetching Banners", err);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(slideInterval); // Cleanup on unmount
  }, [banners]);

  // Infinite loop effect for the slider
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (!banners.length) return <p>Loading...</p>;

  return (
    <div
      className="slider-container"
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div
        ref={sliderRef}
        className="slider-wrapper"
        style={{
          display: "flex",
          width: `100%`,
        }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner.bannerPicture}
            alt={`Banner ${index + 1}`}
            style={{
              width: "100%",
              height: "auto",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
