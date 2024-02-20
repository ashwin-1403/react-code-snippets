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

function AddStoreBannerChild() {
  const axiosInstance = useApiService();
  const [storeBannerDetails, setStoreBannerDetails] = useState<any>({
    image: "",
    link: "",
    title: "",
    _id: "",
    updatedAt: "",
    updatedBy: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getStoreItems = () => {
    if (id) {
      setLoading(true);

      axiosInstance
        .get(`admin/storeBannerDetails?_id=${id}`)
        .then((response) => {
          setStoreBannerDetails({
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
    axiosInstance
      .put(`admin/updateStoreBanner`, {
        _id: storeBannerDetails._id,
        title: storeBannerDetails.title,
        link: storeBannerDetails.link,
        image: storeBannerDetails.image,
      })
      .then((response) => {
        setLoading(false);
        ToastSuccess(response.data.message);
        navigate("/home?tab=3");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const addAdBanner = () => {
    setLoading(true);
    axiosInstance
      .post(`admin/addStorebanner`, {
        title: storeBannerDetails.title,
        link: storeBannerDetails.link,
        image: storeBannerDetails.image,
      })
      .then((response) => {
        if (response) {
          setLoading(false);
          navigate("/home?tab=3");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getStoreItems();
  }, []);

  const submitHandler = () => {
    if (storeBannerDetails.title.length === 0) {
      ToastFailure("Please enter title");
      return;
    }

    if (storeBannerDetails.link.length === 0) {
      ToastFailure("Please add link");
      return;
    }

    if (!validateUrl(storeBannerDetails.link)) {
      ToastFailure("Please enter valid link");
      return;
    }

    if (storeBannerDetails.image.length === 0) {
      ToastFailure("Please Upload an Image");
      return;
    }

    if (id) {
      updateDetails();
    } else {
      addAdBanner();
    }
  };

  const imageHandler = (data: any) => {
    setStoreBannerDetails({
      ...storeBannerDetails,
      image: data,
    });
  };

  return (
    <>
      <NewBannerHeader
        title={id ? storeBannerDetails.title : `ADD STORE BANNER`}
        tabIndex="3"
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
                      value={storeBannerDetails.title}
                      onChange={(e) =>
                        setStoreBannerDetails({
                          ...storeBannerDetails,
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
                      value={storeBannerDetails.link}
                      onChange={(e) =>
                        setStoreBannerDetails({
                          ...storeBannerDetails,
                          link: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="images-areas">
                  {storeBannerDetails.image && (
                    <div className="banner-image">
                      <img
                        alt=""
                        src={storeBannerDetails.image}
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
                      imageURL={storeBannerDetails.image}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer
        cancelSubmit={() => navigate(`/home?tab=${3}`)}
        isSubmit={submitHandler}
        isUpdate={!!id}
      />
    </>
  );
}
export default AddStoreBannerChild;
