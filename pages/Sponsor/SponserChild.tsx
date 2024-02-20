import { useState, useEffect } from "react";
import "./SponserChild.scss";
import Select from "react-dropdown-select";
import { useNavigate, useParams } from "react-router";
import Footer from "../../Component/Footer/Footer";
import SponserChildHeader from "../../Component/Header/ChildHeader/SponserChildHeader";
import featured from "../../Assets/SideBar-Image/ic-featured.png";
import { ToastFailure, ToastSuccess } from "../../Share/toast/ToastMsg";
import { ConfirmDelete } from "../../Utills/ConfirmAlerts";
import UploadEventImage from "./Modal/UploadEventImage";
import { isRichTextContextEmpty, validateUrl } from "../../Utills/utils";
import Loader from "../../Utills/Loader/Loader";
import useApiService from "../../Utills/ApiAxiosHandler/ApiAxiosHandler";
import RichTag from "../../Utills/RichTag/RichTage";

function SponserChild() {
  const axiosInstance = useApiService();
  const { id } = useParams();
  const [venueList, setVenueList] = useState([]);
  const [activeTitle, setActiveTitle] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [addSponser, setAddSponsers] = useState<any>({
    _id: "",
    image: "",
    deActivateDate: null,
    activeDate: null,
    link: "",
    description: "",
    name: "",
    updatedAt: "",
    updatedBy: "",
    venueAssociation: [],
    isActive: true,
  });

  const [modalShow, setModalShow] = useState(false);

  const getVanuesItem = async () => {
    await axiosInstance
      .get(`admin/venue-list?limit=1000`)
      .then((response) => {
        setVenueList(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSponserChild = async () => {
    if (id) {
      setLoading(true);
      await axiosInstance
        .get(`admin/sponsor?_id=${id}`)
        .then((response) => {
          setLoading(false);
          setActiveTitle(response.data.data.name);
          setAddSponsers({
            _id: response?.data?.data?._id,
            image: response?.data?.data?.image,
            deActivateDate: response?.data?.data?.deActivateDate,
            activeDate: response?.data?.data?.activeDate,
            link: response?.data?.data?.link,
            description: response?.data?.data?.description || "",
            name: response?.data?.data?.name,
            isActive: response?.data?.data?.isActive,
            venueAssociation: response?.data?.data?.venueAssociation.map(
              (item: any) => ({
                value: item._id,
                label: item.title,
              })
            ),
            updatedAt: response?.data?.data?.updatedAt,
            updatedBy: response?.data?.data?.updatedBy,
          });
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  const updatedSponsers = async (id: any) => {
    setLoading(true);

    const sendData = {
      _id: addSponser._id,
      image: addSponser.image,
      deActivateDate: null,
      activeDate: null,
      link: addSponser.link,
      venueAssociation: addSponser.venueAssociation.map(
        (item: any) => item.value
      ),
      description: addSponser.description,
      name: addSponser.name,
      updatedAt: addSponser.updatedAt,
      updatedBy: addSponser.updatedBy,
      isActive: addSponser.isActive,
    };
    await axiosInstance
      .put(`admin/sponsor`, sendData)
      .then((response) => {
        setLoading(false);
        navigate("/sponsors", { replace: true });
        ToastSuccess(response.data.message);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const deleteSponsor = async (_id: any) => {
    if (id) {
      setLoading(true);
      await axiosInstance
        .delete(`admin/sponsor`, {
          params: { _id },
        })
        .then((response) => {
          setLoading(false);
          if (response?.data?.status) {
            ToastSuccess("Successfully Deleted.");
            navigate("/sponsors", { replace: true });
            getSponserChild();
          } else {
            ToastFailure(response?.data?.error);
          }
        })
        .catch((error) => {
          setLoading(false);
          ToastFailure(error.message);
        });
    }
  };

  const addSponsoritem = async () => {
    setLoading(true);

    const sendData = {
      activeDate: null,
      deActivateDate: null,
      description: addSponser.description,
      image: addSponser.image,
      link: addSponser.link,
      name: addSponser.name,
      isActive: addSponser.isActive,
      venueAssociation: addSponser.venueAssociation.map(
        (item: any) => item.value
      ),
    };

    await axiosInstance
      .post(`admin/sponsor`, sendData)
      .then((response) => {
        setLoading(false);
        navigate("/sponsors", { replace: true });
        ToastSuccess(response.data.message);
      })
      .catch((error) => {
        setLoading(false);
        ToastFailure(error.response.data.message);
      });
  };

  const submitHandler = () => {
    if (addSponser.name.length === 0) {
      ToastFailure("Please enter sponsor name");
      return;
    }

    if (addSponser.link.length === 0) {
      ToastFailure("Please enter sponsor link");
      return;
    }

    if (!validateUrl(addSponser.link)) {
      ToastFailure("Please enter valid link");
      return;
    }

    if (addSponser.venueAssociation.length === 0) {
      ToastFailure("Please select venue");
      return;
    }

    if (isRichTextContextEmpty(addSponser.description)) {
      ToastFailure("Please enter description");
      return;
    }

    if (addSponser.image.length === 0) {
      ToastFailure("Please upload an image");
      return;
    }

    if (id) {
      updatedSponsers(id);
    } else {
      addSponsoritem();
    }
  };
  useEffect(() => {
    getSponserChild();
    getVanuesItem();
  }, []);

  const imageHandler = (data: any) => {
    setAddSponsers({
      ...addSponser,
      image: data,
    });
  };

  return (
    <>
      <SponserChildHeader
        name={id ? activeTitle : `ADD SPONSOR`}
        updatedBy={id ? addSponser.updatedBy : ``}
      />

      {loading ? (
        <Loader startLoader={loading} />
      ) : (
        <div className="sponserChild-container TopCommonChild MainClass">
          <div className="sponser-child">
            <div className="row">
              <div className="col-md-8">
                <div className="sponser-names newFeaturedBtn">
                  <label htmlFor="/" className="CommonLabel">
                    NAME
                  </label>
                  <input
                    type="text"
                    className="sponser-sketck"
                    placeholder="Darling's Waterfront Pavilion"
                    value={addSponser.name}
                    onChange={(e) =>
                      setAddSponsers({
                        ...addSponser,
                        name: e.target.value,
                      })
                    }
                    maxLength={50}
                  />
                  <div className="sponsorFeaturedBtn">
                    <span
                      className={`genr-btn ${
                        addSponser.isActive
                          ? "activeFeature"
                          : "deactiveFeature"
                      }`}
                      onClick={() => {
                        setAddSponsers({
                          ...addSponser,
                          isActive:
                            addSponser.isActive === false ? true : false,
                        });
                      }}
                    >
                      <span className="featured">
                        <img src={featured} alt="/" />
                        <span className="grnt">Actived</span>
                      </span>
                    </span>
                  </div>
                </div>
                <div className="concert-links">
                  <div className="linksofsketch">
                    <label htmlFor="" className="CommonLabel">
                      LINK
                    </label>
                    <input
                      type="text"
                      name="text"
                      className="request-link"
                      placeholder=" www.darlings-w-p.com"
                      value={addSponser.link}
                      onChange={(e) =>
                        setAddSponsers({
                          ...addSponser,
                          link: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="select-item-component">
                  <div className="compo">
                    <label htmlFor="/" className="CommonLabel">
                      VENUES ASSOCIATION
                    </label>
                    <Select
                      options={venueList.map((item: any) => ({
                        value: item._id,
                        label: item.title,
                      }))}
                      multi
                      values={addSponser.venueAssociation}
                      onChange={(value) =>
                        setAddSponsers({
                          ...addSponser,
                          venueAssociation: value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="editor-component">
                  <div className="CommonLabel">DESCRIPTION</div>
                  <div className="textEditer-sponsers">
                    <RichTag
                      editerDetails={addSponser.description}
                      setEditerDetails={(value: any) => {
                        setAddSponsers({
                          ...addSponser,
                          description: value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="sponser-right-side">
                  {addSponser.image && (
                    <div className="sketch-images">
                      <img
                        src={addSponser.image}
                        alt=""
                        className="sponser-img"
                      />
                    </div>
                  )}

                  <div className="upld-btn">
                    <div className="upload-btn">
                      <button
                        className="uploadbtn"
                        onClick={() => setModalShow(true)}
                      >
                        UPLOAD IMAGES
                      </button>
                    </div>
                  </div>
                  {modalShow && (
                    <UploadEventImage
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      setCroppedBannerCloud={imageHandler}
                      imageURL={addSponser.image}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer
            isSubmit={submitHandler}
            isUpdate={!!id}
            isAddEvent={!id}
            footerDeleteEvent={() =>
              ConfirmDelete(addSponser._id, deleteSponsor)
            }
            isSponsor={true}
            cancelSubmit={() => navigate("/sponsors")}
          />
        </div>
      )}
    </>
  );
}

export default SponserChild;
