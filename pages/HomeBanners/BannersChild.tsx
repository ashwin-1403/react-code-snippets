import { useEffect } from "react";
import "./BannersChild.scss";
import Select from "react-select";
// import image from "../../Assets/SideBar-Image/img-.jpg";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../../Component/Footer/Footer";
import HomeBannerChildHeader from "../../Component/Header/ChildHeader/HomeBannerChildHeader";
import { validateUrl } from "../../Utills/utils";
import UploadEventImage from "./Modal/UploadEventImage";
import { ToastFailure, ToastSuccess } from "../../Share/toast/ToastMsg";
import Loader from "../../Utills/Loader/Loader";
import useApiService from "../../Utills/ApiAxiosHandler/ApiAxiosHandler";

function BannersChild() {
  const axiosInstance = useApiService();
  const { id } = useParams();
  const [modalShow, setModalShow] = useState(false);
  const [eventList, setEventList] = useState<any>([]);
  const [venueFinalDropData, setVenueFinalDropData] = useState<any>(null);
  const [bannerupdt, setbannerupdt] = useState<any>({
    _id: "",
    title: "",
    buttonText: "",
    buttonLink: "",
    bannerText: "",
    image: "",
    eventId: "",
    event: "",
  });
  const [activeTitle, setActiveTitle] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const UpdateBanner = () => {
    setLoading(true);
    const sendData: any = {
      _id: bannerupdt._id,
      title: bannerupdt.title,
      buttonText: bannerupdt.buttonText,
      buttonLink: bannerupdt.buttonLink,
      bannerText: bannerupdt.bannerText,
      image: bannerupdt.image,
      updatedBy: bannerupdt.updatedBy,
    };

    if (bannerupdt.event) {
      sendData.event = bannerupdt.event;
    }

    if (bannerupdt.eventId) {
      sendData.eventId = bannerupdt.eventId;
    }

    axiosInstance
      .put(`admin/banner`, sendData)
      .then((response) => {
        setLoading(false);
        navigate(`/home?tab=1`);
        ToastSuccess(response.data.message);
      })
      .catch((error) => {
        setLoading(false);
        ToastFailure(error.response.data.message);
      });
  };

  const getEventList = () => {
    axiosInstance
      .get(`admin/event-list`)
      .then((response) => {
        setEventList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBannerChildDetails = () => {
    if (id) {
      setLoading(true);
      axiosInstance
        .get(`admin/banner?_id=${id}`)
        .then((response) => {
          setActiveTitle(response.data.data.title);
          setbannerupdt({
            _id: response.data.data._id,
            title: response.data.data.title,
            buttonText: response.data.data.buttonText,
            buttonLink: response.data.data.buttonLink,
            bannerText: response.data.data.bannerText,
            image: response.data.data.image,
            updatedBy: response.data.data.updatedBy,
            eventId: response.data.data.eventId || "",
            event: response.data.data.event || "",
          });
          setVenueFinalDropData({
            label: response.data.data.event,
            value: response.data.data.eventId,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);

          console.log(error);
        });
    }
  };

  const submitHandler = () => {
    if (bannerupdt.title.length === 0) {
      ToastFailure("Please Enter Title");
      return;
    }
    if (bannerupdt.buttonText.length === 0) {
      ToastFailure("Please Add Button Text");
      return;
    }
    if (bannerupdt.bannerText.length === 0) {
      ToastFailure("Please Add Banner Text");
      return;
    }

    if (bannerupdt.buttonLink.length === 0) {
      ToastFailure("Please Add Link");
      return;
    }

    if (!validateUrl(bannerupdt.buttonLink)) {
      ToastFailure("Please enter valid link");
      return;
    }

    if (bannerupdt.image.length === 0) {
      ToastFailure("Please Upload an Image");
      return;
    }

    if (id) {
      UpdateBanner();
    } else {
      addHomeBannerInList();
    }
  };

  const imageHandler = (data: any) => {
    setbannerupdt({
      ...bannerupdt,
      image: data,
    });
  };

  const addHomeBannerInList = () => {
    setLoading(true);

    const sendData: any = {
      bannerText: bannerupdt.bannerText,
      buttonLink: bannerupdt.buttonLink,
      buttonText: bannerupdt.buttonText,
      image: bannerupdt.image,
      title: bannerupdt.title,
    };

    if (bannerupdt.event) {
      sendData.event = bannerupdt.event;
    }

    if (bannerupdt.eventId) {
      sendData.eventId = bannerupdt.eventId;
    }

    axiosInstance
      .post(`admin/banner`, sendData)
      .then((response) => {
        setLoading(false);
        if (response.data.status === 1) {
          ToastSuccess(response.data.message);
          navigate("/home?tab=1");
        } else {
          ToastFailure(response.data.error);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const deleteBanners = async () => {
    setLoading(true);

    await axiosInstance
      .delete(`admin/banner?_id=${bannerupdt._id}`)
      .then((response) => {
        if (response?.data?.status) {
          ToastSuccess("Successfully Deleted.");
          navigate(`/home?tab=1`);
          setLoading(false);
        } else {
          ToastFailure(response?.data?.error);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        ToastFailure("It is mandatory to enter banner first");
      });
  };

  useEffect(() => {
    getBannerChildDetails();
    getEventList();
  }, []);

  return (
    <>
      <HomeBannerChildHeader
        HeaderTitle={!activeTitle ? `Add New Banner` : activeTitle || ``}
        timeDate={id ? bannerupdt.updatedAt : null}
        id={id}
      />
      {loading ? (
        <Loader startLoader={loading} />
      ) : (
        <div className="HomeBannersChild-container TopCommon Home-Banner MainClass">
          <div className="homeBannerChild">
            <div className="homeChilren">
              <div className="existing-events">
                <div className="addBanner">
                  <label
                    htmlFor="ADD A BANNER BASED ON EXISTING EVENT"
                    className="banners-title-Heading CommonLabel"
                  >
                    ADD A BANNER BASED ON EXISTING EVENT
                  </label>

                  <Select
                    className="Banner-base"
                    options={eventList?.map((item: any) => ({
                      value: item._id,
                      label: item.title,
                    }))}
                    placeholder="Select"
                    value={venueFinalDropData || null}
                    onChange={(value: any) => {
                      setVenueFinalDropData(value);

                      setbannerupdt({
                        ...bannerupdt,
                        event: value.label,
                        eventId: value.value,
                      });
                    }}
                  />
                </div>
              </div>
              <hr />
              <div className="container">
                <div className="row">
                  <div className="col-md-8">
                    <div className="create-customer">
                      <div className="customer-banner">
                        <label
                          htmlFor="/"
                          className="customer-name CommonLabel"
                        >
                          CREATE CUSTOM BANNER
                        </label>
                        <input
                          type="text"
                          name="banner"
                          className="banner-names"
                          value={bannerupdt.title}
                          placeholder="Banner Title"
                          onChange={(e) =>
                            setbannerupdt({
                              ...bannerupdt,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="input-boxes">
                        <input
                          type="text"
                          name="bannersDate"
                          className="banners-date"
                          placeholder="Button Text"
                          value={bannerupdt.buttonText}
                          onChange={(e) =>
                            setbannerupdt({
                              ...bannerupdt,
                              buttonText: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          name="bannersDate"
                          className="banners-links "
                          placeholder="Button Link"
                          value={bannerupdt.buttonLink}
                          onChange={(e) =>
                            setbannerupdt({
                              ...bannerupdt,
                              buttonLink: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="text-area-banner">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            value={bannerupdt.bannerText}
                            placeholder="Banner Text"
                            style={{ height: "150px" }}
                            onChange={(e) =>
                              setbannerupdt({
                                ...bannerupdt,
                                bannerText: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="images-areas">
                      {bannerupdt.image && (
                        <div className="banner-image">
                          <img
                            src={bannerupdt.image}
                            alt=""
                            className="bannner-img"
                          />
                        </div>
                      )}
                      <div
                        className="upload-btn"
                        onClick={() => setModalShow(true)}
                      >
                        <button className="uploadbtn">UPLOAD IMAGES</button>
                      </div>
                      {modalShow && (
                        <UploadEventImage
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                          setCroppedBannerCloud={(data: any) =>
                            imageHandler(data)
                          }
                          imageURL={bannerupdt.image}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer
        isAddEvent={false}
        isBanner
        cancelSubmit={() => navigate(`/home?tab=1`)}
        isUpdate={!!id}
        isSubmit={submitHandler}
        footerDeleteEvent={deleteBanners}
      />
    </>
  );
}

export default BannersChild;
