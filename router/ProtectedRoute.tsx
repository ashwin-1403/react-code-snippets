import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute(props: any) {
  const { redirectPath, children } = props;
  const location = useLocation();
  const isVerified = localStorage.getItem("AUTHTOKEN") ? true : false;

  if (!isVerified) {
    const previousState = location.pathname;
    sessionStorage.setItem("previousUrl", previousState);
    return <Navigate to={redirectPath} replace />;
  }

  if (sessionStorage.getItem("previousUrl")) {
    sessionStorage.removeItem("previousUrl");
  }
  return children;
}
