import React, { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import CreateBannerModal from "./CreateBannerModal";
import "./AllBannersList.css";
import { FaTrashCan } from "react-icons/fa6";
import { getAllBanners } from "./__request/BannerRequest";
import DeleteBannerModal from "./DeleteBannerModal";
import { ScaleLoader } from "react-spinners";

const AllBannersList = () => {
  const [showCraeteBanner, setShowCraeteBanner] = useState(false);
  const handleClose = () => setShowCraeteBanner(false);
  const handleShow = () => setShowCraeteBanner(true);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const [banner, setBanners] = useState();

  const [loading, setLoading] = useState(true);

  const getBanners = async () => {
    try {
      setLoading(true);
      const response = await getAllBanners();
      setBanners(response?.banners);
    } catch (err) {
      console.error("Error in fetching Banners", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);

  const [imageSrc, setImageSrc] = useState();

  return (
    <>
      <MasterLayout>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">List of Banners</h5>

              <button className="btn btn-primary" onClick={handleShow}>
                Create New Banners
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
                  <ScaleLoader color="#0d6efd" />
                </div>
              ) : banner?.length > 0 ? (
                <div className="row">
                  {banner?.map((banner, index) => {
                    return (
                      <div className="col-lg-3">
                        <div
                          style={{ height: "100px", cursor: "pointer" }}
                          key={index}
                          className="border-1 border-secondary rounded-2 overflow-hidden mb-3"
                        >
                          <div
                            className="Conatiner-Tournament-poster w-100 h-100"
                            onClick={() => {
                              handleShowDelete();
                              setImageSrc(banner);
                            }}
                          >
                            <img
                              src={banner?.bannerPicture}
                              alt={`Banner ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <span className="Remove-Tournament-poster">
                              <FaTrashCan />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-muted"
                  style={{ minHeight: "200px" }}
                >
                  <h5 className="mb-0">No banners available</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </MasterLayout>

      <CreateBannerModal
        handleClose={handleClose}
        showCraeteBanner={showCraeteBanner}
        getBanners={getBanners}
      />

      <DeleteBannerModal
        handleClose={handleCloseDelete}
        showDelete={showDelete}
        banner={imageSrc}
        getBanners={getBanners}
      />
    </>
  );
};

export default AllBannersList;
