import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

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

        // Frontend validation
        if (formData.name.length < 20 || formData.name.length > 60) {
            setError("Name must be between 20 and 60 characters");
            return;
        }

        if (formData.address.length > 400) {
            setError("Address cannot exceed 400 characters");
            return;
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(formData.password)) {
            setError(
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            );
            return;
        }

        try {
            setLoading(true);

            await api.post("/admin/users", formData);

            setSuccess("User created successfully");

            setFormData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "user"
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not create user"
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
                    <p>Add New User</p>
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

                    <h2>Add User</h2>

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
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                minLength="20"
                                maxLength="60"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8-16 characters"
                                minLength="8"
                                maxLength="16"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                maxLength="400"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">
                                    Normal User
                                </option>

                                <option value="admin">
                                    Administrator
                                </option>

                                <option value="owner">
                                    Store Owner
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="view-button"
                        >
                            {loading
                                ? "Creating..."
                                : "Create User"}
                        </button>

                    </form>

                </div>

            </main>
        </div>
    );
}

export default AddUser;