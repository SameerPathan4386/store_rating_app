import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // User is not logged in
    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log(error)
        return <Navigate to="/login" replace />;
    }

    // check whether the users role is allowed
    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        if (user.role === "owner") {
            return <Navigate to="/owner" replace />;
        }

        return <Navigate to="/user" replace />;
    }

    return children;
}

export default ProtectedRoute;