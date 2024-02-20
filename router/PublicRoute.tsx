import { Navigate } from "react-router-dom";

export default function PublicRoute(props: any) {
  const { redirectPath, children } = props;

  const isVerified = localStorage.getItem("AUTHTOKEN") ? true : false;

  if (isVerified) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
