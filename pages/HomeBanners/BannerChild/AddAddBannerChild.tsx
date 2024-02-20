import { useEffect, useState } from "react";
import "./BannerChild.style.scss";
import { useNavigate, useParams } from "react-router-dom";
import NewBannerHeader from "../../../Component/Header/ChildHeader/NewBannerHeader";
import Footer from "../../../Component/Footer/Footer";
import UploadEventImage from "../Modal/UploadEventImage";
import { validateUrl } from "../../../Utills/utils";
import { ToastFailure, ToastSuccess } from "../../../Share/toast/ToastMsg";
import Loader from "../../../Utills/Loader/Loader";
import useApiService from "../../../Utills/ApiAxiosHandler/ApiAxiosHandler";

function AddAdBannerChild() {
  const axiosInstance = useApiService();
  const [adBannerDetails, setAdBannerDetails] = useState<any>({
    image: "",
    link: "",
    title: "",
    _id: "",
    updatedAt: "",
    updatedBy: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const [croppedBannerCloud, setCroppedBannerCloud] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getAdItems = () => {
    if (id) {
      setLoading(true);
      axiosInstance
        .get(`admin/ad-banner?_id=${id}`)
        .then((response) => {
          setAdBannerDetails({
            image: response.data.data.image,
            link: response.data.data.link,
            title: response.data.data.title,
            updatedAt: response.data.data.updatedAt,
            updatedBy: response.data.data.updatedBy,
            _id: response.data.data._id,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  const updateDetails = () => {
    setLoading(true);
    axiosInstance
      .put(`admin/ad-banner`, {
        _id: adBannerDetails._id,
        title: adBannerDetails.title,
        link: adBannerDetails.link,
        image: adBannerDetails.image,
      })
      .then((response) => {
        setLoading(false);
        ToastSuccess(response.data.message);
        navigate(`/home?tab=2`);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const addAdBanner = () => {
    setLoading(true);
    axiosInstance
      .post(`admin/ad-banner`, {
        title: adBannerDetails.title,
        link: adBannerDetails.link,
        image: adBannerDetails.image,
      })
      .then((response) => {
        setLoading(false);
        navigate("/home?tab=2");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getAdItems();
  }, []);

  const submitHandler = () => {
    if (adBannerDetails.title.length === 0) {
      ToastFailure("Please enter title");
      return;
    }

    if (adBannerDetails.link.length === 0) {
      ToastFailure("Please add link");
      return;
    }

    if (!validateUrl(adBannerDetails.link)) {
      ToastFailure("Please enter valid link");
      return;
    }

    if (adBannerDetails.image.length === 0) {
      ToastFailure("Please upload an image");
      return;
    }

    if (id) {
      updateDetails();
    } else {
      addAdBanner();
    }
  };

  const imageHandler = (data: any) => {
    setAdBannerDetails({
      ...adBannerDetails,
      image: data,
    });
  };

  return (
    <>
      <NewBannerHeader
        title={id ? adBannerDetails.title : `ADD AD BANNER`}
        tabIndex="2"
      />
      {loading ? (
        <Loader startLoader={loading} />
      ) : (
        <div className="Addadbanners TopCommon Home-Banner  MainClass">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="addaddbanner-addadbanner">
                  <div className="">
                    <input
                      type="text"
                      name="Name"
                      placeholder="Title"
                      value={adBannerDetails.title}
                      onChange={(e) =>
                        setAdBannerDetails({
                          ...adBannerDetails,
                          title: e.target.value,
                        })
                      }
                      className="add-adbanner-title"
                    />
                  </div>
                  <div className="">
                    <input
                      type="text"
                      name=""
                      placeholder="Link"
                      className="add-adbanner-link"
                      value={adBannerDetails.link}
                      onChange={(e) =>
                        setAdBannerDetails({
                          ...adBannerDetails,
                          link: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="images-areas">
                  {adBannerDetails.image && (
                    <div className="banner-image">
                      <img
                        alt=""
                        src={adBannerDetails.image}
                        className="AddAdbannner-img"
                      />
                    </div>
                  )}

                  <div className="upload-btn">
                    <button
                      className="uploadbtn"
                      onClick={() => setModalShow(true)}
                    >
                      UPLOAD IMAGES
                    </button>
                  </div>
                  {modalShow && (
                    <UploadEventImage
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      setCroppedBannerCloud={imageHandler}
                      imageURL={adBannerDetails.image}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer
        cancelSubmit={() => navigate(`/home?tab=${2}`)}
        isSubmit={submitHandler}
        isUpdate={!!id}
      />
    </>
  );
}
export default AddAdBannerChild;
