import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDashboard() {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");

    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [ratingLoading, setRatingLoading] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    

    const getStores = async () => {
        try {
            setLoading(true);

            const response =
                await api.get("/stores");

            setStores(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not load stores"
            );
        } finally {
            setLoading(false);
        }
    };
useEffect(() => {
        getStores();
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const openRating = (store) => {
        setSelectedStore(store);

        setSelectedRating(
            store.user_rating
                ? Number(store.user_rating)
                : 0
        );

        setError("");
        setSuccess("");
    };

    const closeRating = () => {
        setSelectedStore(null);
        setSelectedRating(0);
    };

    const submitRating = async () => {
        if (selectedRating < 1 || selectedRating > 5) {
            setError("Please select a rating from 1 to 5");
            return;
        }

        try {
            setRatingLoading(true);
            setError("");
            setSuccess("");

            if (selectedStore.user_rating) {
                await api.put(
                    `/ratings/${selectedStore.id}`,
                    {
                        rating: selectedRating
                    }
                );

                setSuccess(
                    "Rating updated successfully"
                );

            } else {
                await api.post("/ratings", {
                    store_id: selectedStore.id,
                    rating: selectedRating
                });

                setSuccess(
                    "Rating submitted successfully"
                );
            }

            closeRating();

            await getStores();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not submit rating"
            );
        } finally {
            setRatingLoading(false);
        }
    };

    const filteredStores = stores
        .filter((store) =>
            store.name
                .toLowerCase()
                .includes(searchName.toLowerCase())
        )
        .filter((store) =>
            store.address
                .toLowerCase()
                .includes(searchAddress.toLowerCase())
        );

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Store Rating System</h1>

                    <p>
                        Welcome, {user?.name || "User"}
                    </p>
                </div>

                {/* <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button> */}

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

                <h2>Store Listings</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <div className="dashboard-section">

                    <div className="filters">

                        <input
                            type="text"
                            placeholder="Search by store name"
                            value={searchName}
                            onChange={(e) =>
                                setSearchName(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search by address"
                            value={searchAddress}
                            onChange={(e) =>
                                setSearchAddress(e.target.value)
                            }
                        />

                    </div>

                    {loading ? (

                        <p>Loading stores...</p>

                    ) : (

                        <div className="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Store Name</th>
                                        <th>Address</th>
                                        <th>Overall Rating</th>
                                        <th>Your Rating</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredStores.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="no-data"
                                            >
                                                No stores found
                                            </td>
                                        </tr>

                                    ) : (

                                        filteredStores.map(
                                            (store) => (
                                                <tr key={store.id}>

                                                    <td>
                                                        {store.name}
                                                    </td>

                                                    <td>
                                                        {store.address}
                                                    </td>

                                                    <td>
                                                        ⭐{" "}
                                                        {store.rating}
                                                    </td>

                                                    <td>
                                                        {store.user_rating
                                                            ? `⭐ ${store.user_rating}`
                                                            : "Not rated"}
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="view-button"
                                                            onClick={() =>
                                                                openRating(store)
                                                            }
                                                        >
                                                            {store.user_rating
                                                                ? "Modify Rating"
                                                                : "Rate Store"}
                                                        </button>
                                                    </td>

                                                </tr>
                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                {selectedStore && (

                    <div className="dashboard-section">

                        <h2>
                            {selectedStore.user_rating
                                ? "Modify Rating"
                                : "Rate Store"}
                        </h2>

                        <p>
                            <strong>
                                {selectedStore.name}
                            </strong>
                        </p>

                        <p>
                            Select your rating:
                        </p>

                        <div className="rating-buttons">

                            {[1, 2, 3, 4, 5].map(
                                (rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        className={
                                            selectedRating === rating
                                                ? "rating-button selected"
                                                : "rating-button"
                                        }
                                        onClick={() =>
                                            setSelectedRating(rating)
                                        }
                                    >
                                        {rating} ⭐
                                    </button>
                                )
                            )}

                        </div>

                        <div className="rating-actions">

                            <button
                                className="view-button"
                                onClick={submitRating}
                                disabled={ratingLoading}
                            >
                                {ratingLoading
                                    ? "Saving..."
                                    : "Submit Rating"}
                            </button>

                            <button
                                className="back-button"
                                onClick={closeRating}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default UserDashboard;