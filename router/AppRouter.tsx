import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "../Component/Login/Login";
import SideBar from "../Component/SideBar/SideBar";
import Events from "../Pages/Events/Events";
import Venues from "../Pages/Venues/Venues";
import Packages from "../Pages/Packages/Packages";
import Sponser from "../Pages/Sponsor/Sponser";
import Notification from "../Pages/Notification/Notification";
import Team from "../Pages/Team/Team";
import Banners from "../Pages/HomeBanners/Banners";
import Faq from "../Pages/FAQ/Faq";
import Cities from "../Pages/Cities/Cities";
import Tickets from "../Pages/Tickets/Tickets";
import EventChild from "../Pages/Events/EventChild";
import VenuesChild from "../Pages/Venues/VenuesChild";
import PackagesChild from "../Pages/Packages/PackagesChild";
import SponserChild from "../Pages/Sponsor/SponserChild";
import TeamChild from "../Pages/Team/TeamChild";
import BannersChild from "../Pages/HomeBanners/BannersChild";
import FAQChild from "../Pages/FAQ/FAQChild";
import CitesChild from "../Pages/Cities/CitesChild";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import AddCity from "../Pages/Cities/AddCity";
import AddNewTeam from "../Pages/Team/AddNewTeam";
import AdBannerChild from "../Pages/HomeBanners/BannerChild/AddAddBannerChild";
import StoreBannerChild from "../Pages/HomeBanners/BannerChild/AddStoreBannerChild";
import Jobs from "../Pages/Jobs/Jobs";
import JobsChild from "../Pages/Jobs/JobsChild/JobsChild";
import ForgotPassword from "../Component/ForgotPassword/ForgotPassword";
import ResetPassword from "../Component/ResetPassword/ResetPassword";
import Applicent from "../Pages/Jobs/Applicent/Applicent";
import Category from "../Pages/Category/Category";
import ArchivedList from "../Pages/Jobs/Applicent/Archived/ArchivedList";

function AppRouter(): JSX.Element {
  const [isVerified, setVerified] = useState(false);

  const navigate = useNavigate();
  const setSigninStatus = (status: any) => {
    setVerified(status);
    if (status) {
      navigate("/events");
    }
  };

  const location = useLocation();

  useEffect(() => {
    const isVerified = localStorage.getItem("AUTHTOKEN") ? true : false;
    setVerified(isVerified);
  }, [location]);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute redirectPath="/events">
              <Login setSigninStatus={setSigninStatus} />
            </PublicRoute>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <PublicRoute redirectPath="/events">
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset"
          element={
            <PublicRoute redirectPath="/events">
              <ResetPassword />
            </PublicRoute>
          }
        />
      </Routes>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              {isVerified ? (
                <SideBar setSigninStatus={setSigninStatus} />
              ) : (
                <></>
              )}
            </div>
            <div className="col-lg-10 ColumbWidth">
              <Routes>
                <Route path="/" element={<Navigate to="/events" />} />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Events />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/eventchild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <EventChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/eventchild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <EventChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/venues"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Venues />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/venuesChild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <VenuesChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/package"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Packages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/packages-child/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <PackagesChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sponsors"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Sponser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/category"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Category />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/SponserChild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <SponserChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/SponserChild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <SponserChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Jobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobsdetails"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <JobsChild />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/jobsdetails/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <JobsChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applicent/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Applicent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/archived/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <ArchivedList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Notification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Team />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teamChild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <TeamChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AddNewTeam"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <AddNewTeam />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/home"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Banners />
                    </ProtectedRoute>
                  }
                />
                {/* Event Banner */}
                <Route
                  path="/bannerChild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <BannersChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bannerChild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <BannersChild />
                    </ProtectedRoute>
                  }
                />

                {/*  For Add Banner */}
                <Route
                  path="/adBannerChild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <AdBannerChild />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/adBannerChild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <AdBannerChild />
                    </ProtectedRoute>
                  }
                />

                {/* For store banner */}
                <Route
                  path="/storeBannerChild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <StoreBannerChild />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/storeBannerChild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <StoreBannerChild />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/faq"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Faq />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/FAQChild/:id"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <FAQChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/city"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Cities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citiesChild"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <CitesChild />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/AddNew"
                  element={
                    <ProtectedRoute redirectPath="/city">
                      <AddCity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ticket"
                  element={
                    <ProtectedRoute redirectPath="/login">
                      <Tickets />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppRouter;
