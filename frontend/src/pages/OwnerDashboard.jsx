import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [raters, setRaters] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        getOwnerDashboard();
    }, []);

    const getOwnerDashboard = async () => {
        try {
            const response =
                await api.get("/owner/dashboard");

            setStores(response.data.stores);
            setRaters(response.data.raters);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not load owner dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Store Rating System</h1>

                    <p>
                        Welcome, {user?.name || "Store Owner"}
                    </p>
                </div>

                <div>

                    <button
                        className="view-button"
                        onClick={() =>
                            navigate("/change-password")
                        }
                    >
                        Change Password
                    </button>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        style={{ marginLeft: "10px" }}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="dashboard-content">

                <h2>Store Owner Dashboard</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (

                    <p>Loading dashboard...</p>

                ) : (

                    <>
                        <div className="dashboard-section">

                            <h2>My Stores</h2>

                            {stores.length === 0 ? (

                                <p>
                                    No store has been assigned
                                    to you yet.
                                </p>

                            ) : (

                                <div className="table-container">

                                    <table>

                                        <thead>
                                            <tr>
                                                <th>Store Name</th>
                                                <th>Address</th>
                                                <th>
                                                    Average Rating
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {stores.map(
                                                (store) => (
                                                    <tr
                                                        key={store.id}
                                                    >
                                                        <td>
                                                            {store.name}
                                                        </td>

                                                        <td>
                                                            {store.address}
                                                        </td>

                                                        <td>
                                                            ⭐{" "}
                                                            {
                                                                store.average_rating
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                        <div className="dashboard-section">

                            <h2>
                                Users Who Rated My Store
                            </h2>

                            {raters.length === 0 ? (

                                <p>
                                    No users have rated your
                                    store yet.
                                </p>

                            ) : (

                                <div className="table-container">

                                    <table>

                                        <thead>
                                            <tr>
                                                <th>Store</th>
                                                <th>User Name</th>
                                                <th>Email</th>
                                                <th>Rating</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {raters.map(
                                                (rater, index) => (
                                                    <tr
                                                        key={`${rater.store_id}-${rater.user_id}-${index}`}
                                                    >
                                                        <td>
                                                            {
                                                                rater.store_name
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                rater.user_name
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                rater.user_email
                                                            }
                                                        </td>

                                                        <td>
                                                            ⭐{" "}
                                                            {
                                                                rater.rating
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>
                    </>

                )}

            </main>

        </div>
    );
}

export default OwnerDashboard;