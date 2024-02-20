import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PageOption.style.scss";
import { ToastSuccess } from "../../Share/toast/ToastMsg";
import useApiService from "../ApiAxiosHandler/ApiAxiosHandler";

function PageOption({ tabValue, tabChangeHandler }: any) {
  const axiosInstance = useApiService();
  const [upcomingSection, setUpcomingSection] = useState<any>({
    upcomingSectionTitle: "",
    onSaleSectionTitle: "",
  });
  const [isFlag, setIsFlag] = useState(false);
  const [defaultValue, setDefaultValue] = useState<any>();

  const navigate = useNavigate();

  const navigateOnButton = (value: any, tabIndex: any) => {
    navigate(`/${value}?tab=${tabIndex}`);
    tabChangeHandler(tabIndex);
  };

  const getUpcomingSection = async () => {
    await axiosInstance
      .get(`admin/get-home-page-title`)
      .then((response) => {
        setUpcomingSection(response.data.data);
        setDefaultValue(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDetails = () => {
    axiosInstance
      .put(`admin/update-home-page-title`, {
        _id: upcomingSection.id,
        upcomingSectionTitle: upcomingSection.upcomingSectionTitle,
        onSaleSectionTitle: upcomingSection.onSaleSectionTitle,
      })
      .then((response) => {
        setIsFlag(false);
        ToastSuccess(response.data.message);
        getUpcomingSection();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e: any) => {
    setUpcomingSection({ ...upcomingSection, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getUpcomingSection();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, []);

  return (
    <div className="col-md-4">
      <div className="pageOption">
        <div className="pages">
          <p className="heading-page">PAGE OPTIONS</p>
        </div>
        <div className="lable">
          <label htmlFor="/" className="section-head">
            UPCOMING SECTION CONTENT
          </label>
          <div className="option-btn">
            <button
              className={`events-page ${tabValue === "1" ? `PageOptions` : ``}`}
              onClick={() => navigateOnButton("home", 1)}
            >
              EVENTS
            </button>
            <button
              className={`events-page ${tabValue == "2" ? `PageOptions` : ``}`}
              onClick={() => navigateOnButton("home", 2)}
            >
              AD BANNERS
            </button>
            <button
              className={`events-page ${tabValue == "3" ? `PageOptions` : ``}`}
              onClick={() => navigateOnButton("home", 3)}
            >
              STORE BANNERS
            </button>
          </div>
        </div>
        <div className="upcoming-Section">
          {!isFlag && (
            <div className="text-end">
              <button className="editUpdateBtn" onClick={() => setIsFlag(true)}>
                Edit
              </button>
            </div>
          )}
          <label htmlFor="/" className="Section-title">
            UPCOMING SECTION TITLE
          </label>
          <input
            type="text"
            disabled={!isFlag}
            className="upcoming-Text"
            placeholder=""
            name="upcomingSectionTitle"
            value={upcomingSection?.upcomingSectionTitle}
            onChange={handleChange}
          />
        </div>
        <hr />
        <div className="upcoming-Section">
          <label htmlFor="/" className="Section-onsale">
            ON SALE SECTION TITLE
          </label>
          <input
            type="text"
            disabled={!isFlag}
            className="upcoming-Text"
            placeholder=""
            value={upcomingSection?.onSaleSectionTitle}
            name="onSaleSectionTitle"
            onChange={handleChange}
          />
          {isFlag && (
            <div className="text-end">
              <button
                className="editUpdateBtn"
                onClick={() => {
                  setIsFlag(false);
                  setUpcomingSection({
                    ...upcomingSection,
                    upcomingSectionTitle: defaultValue?.upcomingSectionTitle,
                    onSaleSectionTitle: defaultValue?.onSaleSectionTitle,
                  });
                }}
              >
                Cancel
              </button>
              <button className="editUpdateBtn" onClick={() => updateDetails()}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageOption;
