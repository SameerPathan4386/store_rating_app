import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddStore() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [owners, setOwners] = useState([]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingOwners, setLoadingOwners] = useState(true);

   

    const getStoreOwners = async () => {
        try {
            const response =
                await api.get("/admin/store-owners");

            setOwners(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not load store owners"
            );
        } finally {
            setLoadingOwners(false);
        }
    };
 useEffect(() => {
        getStoreOwners();
    }, []);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            formData.name.length < 20 ||
            formData.name.length > 60
        ) {
            setError(
                "Store name must be between 20 and 60 characters"
            );
            return;
        }

        if (formData.address.length > 400) {
            setError(
                "Address cannot exceed 400 characters"
            );
            return;
        }

        if (!formData.owner_id) {
            setError("Please select a store owner");
            return;
        }

        try {
            setLoading(true);

            await api.post("/stores", {
                name: formData.name,
                email: formData.email,
                address: formData.address,
                owner_id: Number(formData.owner_id)
            });

            setSuccess("Store created successfully");

            setFormData({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not create store"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div>
                    <h1>Store Rating System</h1>
                    <p>Add New Store</p>
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

                    <h2>Add Store</h2>

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

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Store Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter store name"
                                minLength="20"
                                maxLength="60"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Store Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter store email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter store address"
                                maxLength="400"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Store Owner</label>

                            <select
                                name="owner_id"
                                value={formData.owner_id}
                                onChange={handleChange}
                                required
                                disabled={loadingOwners}
                            >
                                <option value="">
                                    {loadingOwners
                                        ? "Loading owners..."
                                        : "Select store owner"}
                                </option>

                                {owners.map((owner) => (
                                    <option
                                        key={owner.id}
                                        value={owner.id}
                                    >
                                        {owner.name} - {owner.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="view-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Store"}
                        </button>

                    </form>

                </div>

            </main>
        </div>
    );
}

export default AddStore;