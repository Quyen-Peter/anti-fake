import { Navigate, useLocation } from "react-router-dom";
type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return (
      <Navigate
        to="/auth"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
}
