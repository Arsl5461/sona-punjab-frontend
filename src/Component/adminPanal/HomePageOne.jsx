import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";

const HomePageOne = () => {
  return (
    <>
      <MasterLayout>
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <img
            src="/welcome.jpg"
            className="img-fluid"
            style={{ maxWidth: "100%", height: "80vh", objectFit: "contain" }}
            alt="Dashboard"
          />
        </div>
      </MasterLayout>
    </>
  );
};

export default HomePageOne;
