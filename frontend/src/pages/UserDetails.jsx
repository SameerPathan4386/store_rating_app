import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UserDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserDetails();
    }, [id]);

    const getUserDetails = async () => {
        try {
            const response =
                await api.get(`/admin/users/${id}`);

            setUser(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not load user details"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content">
                <p>Loading user details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-content">
                <div className="error-message">
                    {error}
                </div>

                <button
                    className="view-button"
                    onClick={() => navigate("/admin")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Store Rating System</h1>
                    <p>User Details</p>
                </div>

                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    }}
                >
                    Logout
                </button>

            </header>


            <main className="dashboard-content">

                <button
                    className="back-button"
                    onClick={() => navigate("/admin")}
                >
                    ← Back to Dashboard
                </button>


                <div className="dashboard-section">

                    <h2>User Details</h2>

                    <div className="user-details">

                        <div className="detail-item">
                            <strong>Name</strong>
                            <span>{user.name}</span>
                        </div>

                        <div className="detail-item">
                            <strong>Email</strong>
                            <span>{user.email}</span>
                        </div>

                        <div className="detail-item">
                            <strong>Address</strong>
                            <span>{user.address}</span>
                        </div>

                        <div className="detail-item">
                            <strong>Role</strong>
                            <span>{user.role}</span>
                        </div>

                    </div>

                </div>


                {/* Store Owner Information */}

                {user.role === "owner" && (
                    <div className="dashboard-section">

                        <h2>Store Information</h2>

                        {user.stores &&
                        user.stores.length > 0 ? (

                            <div className="table-container">

                                <table>

                                    <thead>
                                        <tr>
                                            <th>Store Name</th>
                                            <th>Email</th>
                                            <th>Address</th>
                                            <th>Rating</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {user.stores.map(
                                            (store) => (

                                            <tr key={store.id}>

                                                <td>
                                                    {store.name}
                                                </td>

                                                <td>
                                                    {store.email}
                                                </td>

                                                <td>
                                                    {store.address}
                                                </td>

                                                <td>
                                                    ⭐ {store.rating}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <p>
                                This store owner has no
                                store assigned yet.
                            </p>

                        )}

                    </div>
                )}

            </main>

        </div>
    );
}

export default UserDetails;