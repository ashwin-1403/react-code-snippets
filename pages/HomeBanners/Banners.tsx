import { useRef, useState, useEffect } from "react";
import eye from "../../Assets/SideBar-Image/ic-eye.png";
import featured from "../../Assets/SideBar-Image/ic-featured.png";
import "./Banners.style.scss";

import { useLocation, useNavigate } from "react-router-dom";
import HomeBanners from "../../Component/Header/HomeBanners";
import del from "../../Assets/SideBar-Image/del.png";

import PageOption from "../../Utills/Option/PageOption";
import { ToastFailure, ToastSuccess } from "../../Share/toast/ToastMsg";
import Loader from "../../Utills/Loader/Loader";
import NoData from "../../Utills/NoData/NoData";
import Pagination from "react-js-pagination";
import { ConfirmDelete } from "../../Utills/ConfirmAlerts";
import useApiService from "../../Utills/ApiAxiosHandler/ApiAxiosHandler";

function Banners() {
  const axiosInstance = useApiService();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const tabValue: any = searchParams.get("tab");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<any>();
  const pageSize = 10;

  const [loading, setLoading] = useState(false);

  const [bannerItem, setBannerItem] = useState([]);
  const [adBanner, setAdBanner] = useState([]);
  const [storeBanner, setStoreBanner] = useState([]);

  const dragItem = useRef<any>();
  const dragOverItem = useRef<any>();

  /** api calls start here  */

  const getBanneritems = () => {
    setLoading(true);
    const params: any = {
      currentPage: page,
      pageSize: pageSize,
    };

    if (search.length > 0) {
      params.search = search;
    }
    axiosInstance
      .get(`admin/banners`, {
        params: params,
      })
      .then((response) => {
        setBannerItem(response?.data?.data || []);
        setTotal(response?.data?.totalBanner || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getAdItems = () => {
    setLoading(true);
    axiosInstance
      .get(`admin/ad-banners`)
      .then((response) => {
        setAdBanner(response?.data?.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // storeBanners
  const getStoreItem = () => {
    setLoading(true);
    axiosInstance
      .get(`admin/storeBanners`)
      .then((response) => {
        setLoading(false);
        setStoreBanner(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const deleteStoreBanner = async (_id: any) => {
    if (_id) {
      setLoading(true);
      await axiosInstance
        .delete(`admin/deleteStoreBanner`, {
          params: { _id },
        })
        .then((response) => {
          setLoading(false);
          if (response?.data?.status) {
            ToastSuccess(response.data.message);
            getStoreItem();
          } else {
            ToastFailure(response?.data?.error);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const dragPackages = async (data: any) => {
    setLoading(true);
    await axiosInstance
      .put(returnSequenceApiUrl(), {
        bannerIds: data,
        type:
          tabValue == 1
            ? "banner"
            : tabValue == 2
            ? "addBanner"
            : "storeBanner",
      })
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const bannerActiveHandler = async (
    e: any,
    _id: any,
    active: any,
    title: any,
    imageUrl: any,
    isFeature: any,
    eventid: any
  ) => {
    e.stopPropagation();
    setLoading(true);

    await axiosInstance
      .put(`admin/banner`, {
        _id,
        isActive: active,
        title,
        image: imageUrl,
        isFeatured: isFeature,
        eventId: eventid,
      })
      .then((response) => {
        setLoading(false);
        ToastSuccess(response.data.message);
        getBanneritems();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const adBannerActiveHandler = async (
    e: any,
    _id: any,
    active: any,
    imageUrl: any
  ) => {
    e.stopPropagation();
    await axiosInstance
      .put(`admin/ad-banner`, {
        _id,
        isActive: active,
        image: imageUrl,
      })
      .then((response) => {
        ToastSuccess(response.data.message);
        getAdItems();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const bannerFeaturedHandler = async (e: any, _id: any, isFeatured: any) => {
    e.stopPropagation();
    if (_id) {
      await axiosInstance
        .put(`admin/isFeatured`, {
          eventId: _id,
          isFeature: isFeatured,
        })
        .then((response) => {
          ToastSuccess(response.data.message);
          getBanneritems();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      ToastFailure("This banner has no event.");
    }
  };

  const deleteAdBanner = async (_id: any) => {
    if (_id) {
      setLoading(true);
      await axiosInstance
        .delete(`admin/ad-banner`, {
          params: { _id },
        })
        .then((response) => {
          setLoading(false);
          if (response?.data?.status) {
            ToastSuccess(response.data.message);
            getAdItems();
          } else {
            ToastFailure(response?.data?.error);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  /** api calls end here  */
  /** drag function start here ----> */

  const handleDragStart = (e: any, position: any) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragEnter = (e: any, position: any) => {
    e.preventDefault();
    if (dragItem.current !== position) {
      window.requestAnimationFrame(() => {
        let copyListItems;
        if (tabValue == "1") {
          copyListItems = [...bannerItem];
        } else if (tabValue == "2") {
          copyListItems = [...adBanner];
        } else {
          copyListItems = [...storeBanner];
        }

        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);

        // If dragOverItem.current is null, set it to the last item's position
        if (dragOverItem.current === null) {
          if (tabValue == "1") {
            dragOverItem.current = bannerItem.length - 1;
          } else if (tabValue == "2") {
            dragOverItem.current = adBanner.length - 1;
          } else {
            dragOverItem.current = storeBanner.length - 1;
          }
        }

        // Update the copyListItems array and the dragOverItem position
        let newIndex = position;
        if (dragOverItem.current < newIndex) newIndex--;
        copyListItems.splice(newIndex, 0, dragItemContent);
        dragItem.current = newIndex;
        dragOverItem.current = newIndex;

        if (tabValue == "1") {
          setBannerItem(copyListItems);
        } else if (tabValue == "2") {
          setAdBanner(copyListItems);
        } else {
          setStoreBanner(copyListItems);
        }
      });
    }
  };

  const handleDragOver = (e: any, position: any) => {
    e.preventDefault();
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    dragPackages(
      renderStateBasedOnId().map((item: any, index) => ({
        _id: item?._id,
        sequenceNumber: index + 1,
      }))
    );
  };

  const returnNaviagationUrl = () => {
    return tabValue == "1"
      ? `/bannerChild`
      : tabValue === "2"
      ? `/adBannerChild`
      : `/storeBannerChild`;
  };

  const returnSequenceApiUrl = () => {
    return tabValue == "1"
      ? `admin/bannerSequence`
      : tabValue === "2"
      ? `admin/ad-bannerSequence`
      : `admin/storeBannerSequence`;
  };

  const onNavigate = (_id: any) => {
    navigate(`${returnNaviagationUrl()}/${_id}`);
  };

  const uiRenderBasedOnId = (
    _id: any,
    isActive: any,
    title: any,
    image: any,
    isFeatured: any,
    eventId: any
  ) => {
    return tabValue == 1 ? (
      <div className="banner-btn">
        <a className="button-btn-btn" aria-disabled={isActive}>
          <a
            onClick={(e) =>
              bannerActiveHandler(
                e,
                _id,
                isActive,
                title,
                image,
                isFeatured,
                eventId
              )
            }
            className={`${isActive ? `btn-icon` : `btn-icon-active`} `}
          >
            <img src={eye} alt="" className="icon" />
          </a>
        </a>
        <div
          className={`${
            isFeatured ? `btn-feature-icon-active` : `btn-feature-icon`
          } `}
        >
          <a
            className={`${
              isFeatured ? `btn-feature-icon-active` : `btn-feature-icon`
            } `}
            onClick={(e) => bannerFeaturedHandler(e, eventId, !isFeatured)}
          >
            <img src={featured} alt="" className="icon" />
          </a>
        </div>
      </div>
    ) : tabValue == 2 ? (
      <div
        className={`${
          isActive ? `banner-btn-inactive` : `banner-btn-nActive`
        } `}
      >
        <a
          className={`${
            isActive ? `button-btn-btn-inactive` : `button-btn-btn-nActive`
          } `}
          onClick={(e) => adBannerActiveHandler(e, _id, isActive, image)}
        >
          <a
            className={`${
              isActive ? `btn-icon-inactive` : `btn-icon-nActive`
            } `}
          >
            <img src={eye} alt="" className="icon" />
            <span className={`${isActive ? `inactive` : `nActive`} `}>
              {isActive ? `Inactive` : `Active`}
            </span>
          </a>
        </a>
        <div
          className="Delete-icone"
          onClick={(e) => {
            e.stopPropagation();
            ConfirmDelete(_id, deleteAdBanner);
          }}
        >
          <a className="Delete-Adbanner">
            <img src={del} className="fa-solid fa-trash-can" />
          </a>
        </div>
      </div>
    ) : tabValue == 3 ? (
      <div className="banner-btn">
        <div className="Delete-icone-Adbanner">
          <a className="Delete-Adbanner">
            <img
              src={del}
              style={{ cursor: "pointer" }}
              className="fa-solid fa-trash-can"
              onClick={(e) => {
                e.stopPropagation();
                ConfirmDelete(_id, deleteStoreBanner);
              }}
            />
          </a>
        </div>
      </div>
    ) : (
      <></>
    );
  };

  const dragBtnShow = () => {
    return (
      <div className="icons">
        <span className="moveicon">
          <i className="fa-sharp fa-solid fa-ellipsis-vertical" />
          <i className="fa-sharp fa-solid fa-ellipsis-vertical" />
        </span>
      </div>
    );
  };

  const checkTitleEligibleToShow = (title: any) => {
    return tabValue == 1 ? <p className="headding">{title}</p> : <></>;
  };

  const returnHeading = () => {
    return tabValue == 1 ? (
      <button
        className="add-slide-btn"
        onClick={() => navigate("/bannerChild")}
      >
        ADD SLIDE
      </button>
    ) : tabValue == 2 ? (
      <button
        className="add-slide-btn"
        onClick={() => navigate("/adBannerChild")}
      >
        ADD AD BANNER
      </button>
    ) : (
      <button
        className="add-slide-btn"
        onClick={() => navigate("/storeBannerChild")}
      >
        ADD STORE BANNER
      </button>
    );
  };
  // storeBanner
  const renderStateBasedOnId = () => {
    if (tabValue == 1) {
      return bannerItem;
    }
    if (tabValue == 2) {
      return adBanner;
    }
    if (tabValue == 3) {
      return storeBanner;
    }
    return [];
  };

  const searchHandler = (data: any) => {
    setSearch(data);
    setPage(1);
  };

  const tabChangeHandler = (tabIndex: any) => {
    if (tabIndex == 1) {
      setPage(1);
      setSearch("");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tabValue == 1) getBanneritems();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, page, tabValue]);

  useEffect(() => {
    if (tabValue == 2) getAdItems();
    if (tabValue == 3) getStoreItem();
  }, [tabValue]);

  return (
    <>
      <HomeBanners setSearch={searchHandler} viewSearch={tabValue} />
      {loading ? (
        <Loader startLoader={loading} />
      ) : (
        <div className="Home-Banner TopCommon MainClass">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="StoreSlide">
                  <div className="Slide ">
                    <p className="slide-name">SLIDER</p>
                    {returnHeading()}
                  </div>
                </div>
                {renderStateBasedOnId().length > 0 ? (
                  renderStateBasedOnId()?.map((item: any, index: any) => {
                    return (
                      <div className="banner-box" key={index}>
                        <div
                          className="content-banner-list"
                          onClick={() => onNavigate(item?._id)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragEnter={(e) => handleDragEnter(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="banners">
                            {dragBtnShow()}
                            <div className="ContentImg">
                              <img
                                src={item?.image}
                                className="skillss-imges"
                                alt=""
                              />
                            </div>
                            <div className="banner-title">
                              <div className="content-heading">
                                {checkTitleEligibleToShow(item?.title)}
                              </div>
                            </div>
                          </div>
                          {uiRenderBasedOnId(
                            item?._id,
                            item?.isActive,
                            item?.title,
                            item?.image,
                            item?.isFeatured,
                            item?.eventId
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <NoData content="No banner found." />
                )}
              </div>
              <PageOption
                tabValue={tabValue}
                tabChangeHandler={tabChangeHandler}
              />
            </div>

            {tabValue == 1 && total > pageSize && (
              <Pagination
                activePage={page}
                itemsCountPerPage={pageSize}
                totalItemsCount={total}
                onChange={(page) => {
                  setPage(page);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Banners;
