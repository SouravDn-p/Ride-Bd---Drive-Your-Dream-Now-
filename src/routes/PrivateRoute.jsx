import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContexts);

  if (user) {
    return children;
  }
  return (
    <div>
      <Navigate to="/login" />;
    </div>
  );
};

export default PrivateRoute;
