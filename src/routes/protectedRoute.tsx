import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../ultil/auth";
type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();

  const token = getToken();

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
