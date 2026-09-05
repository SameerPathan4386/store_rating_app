import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [searchStoreName, setSearchStoreName] = useState("");
    const [searchStoreEmail, setSearchStoreEmail] = useState("");
    const [searchStoreAddress, setSearchStoreAddress] = useState("");

    const [storeSortField, setStoreSortField] = useState("name");
    const [storeSortDirection, setStoreSortDirection] = useState("asc");

    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    

    // Get dashboard statistics
    const getDashboardStats = async () => {
        try {

            const response =
                await api.get("/admin/dashboard");

            setStats(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Could not load dashboard"
            );
        }
    };

    // Get users
    const getUsers = async () => {
        try {

            const response =
                await api.get("/admin/users");

            setUsers(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Could not load users"
            );
        }
    };

    const getStores = async () => {
    try {
        const response =
            await api.get("/admin/stores");

        setStores(response.data);

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Could not load stores"
        );
    }
};
useEffect(() => {
    getDashboardStats();
    getUsers();
    getStores();
}, []);
    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // Sorting
    const handleSort = (field) => {

        if (sortField === field) {

            setSortDirection(
                sortDirection === "asc"
                    ? "desc"
                    : "asc"
            );

        } else {

            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleStoreSort = (field) => {
    if (storeSortField === field) {
        setStoreSortDirection(
            storeSortDirection === "asc"
                ? "desc"
                : "asc"
        );
    } else {
        setStoreSortField(field);
        setStoreSortDirection("asc");
    }
};

    // Filter users
    const filteredUsers = users
        .filter((item) =>
            item.name
                .toLowerCase()
                .includes(searchName.toLowerCase())
        )
        .filter((item) =>
            item.email
                .toLowerCase()
                .includes(searchEmail.toLowerCase())
        )
        .filter((item) =>
            item.address
                .toLowerCase()
                .includes(searchAddress.toLowerCase())
        )
        .filter((item) =>
            roleFilter === ""
                ? true
                : item.role === roleFilter
        )
        .sort((a, b) => {

            const valueA =
                String(a[sortField] || "").toLowerCase();

            const valueB =
                String(b[sortField] || "").toLowerCase();

            if (valueA < valueB) {
                return sortDirection === "asc"
                    ? -1
                    : 1;
            }

            if (valueA > valueB) {
                return sortDirection === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        });

        const filteredStores = stores
    .filter((item) =>
        item.name
            .toLowerCase()
            .includes(searchStoreName.toLowerCase())
    )
    .filter((item) =>
        item.email
            .toLowerCase()
            .includes(searchStoreEmail.toLowerCase())
    )
    .filter((item) =>
        item.address
            .toLowerCase()
            .includes(searchStoreAddress.toLowerCase())
    )
    .sort((a, b) => {
        let valueA = a[storeSortField];
        let valueB = b[storeSortField];

        if (storeSortField === "rating") {
            valueA = Number(valueA);
            valueB = Number(valueB);

            return storeSortDirection === "asc"
                ? valueA - valueB
                : valueB - valueA;
        }

        valueA = String(valueA || "").toLowerCase();
        valueB = String(valueB || "").toLowerCase();

        if (valueA < valueB) {
            return storeSortDirection === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
            return storeSortDirection === "asc" ? 1 : -1;
        }

        return 0;
    });

    return (
        <div className="dashboard">

            {/* Header */}

            <header className="dashboard-header">

                <div>
                    <h1>Store Rating System</h1>

                    <p>
                        Welcome, {user?.name || "Administrator"}
                    </p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            <main className="dashboard-content">

                <h2>Admin Dashboard</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* Statistics */}

                <div className="stats-container">

                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p>{stats.totalUsers}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Stores</h3>
                        <p>{stats.totalStores}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Ratings</h3>
                        <p>{stats.totalRatings}</p>
                    </div>

                </div>


                {/* User Management */}

                <div className="dashboard-section">

                    <h2>User Management</h2>
                    
                    <button
                     className="view-button"
                    onClick={() => navigate("/admin/users/add")}
                    >
                        + Add User
                    </button>
                    
                    {/* Filters */}

                    <div className="filters">

                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={(e) =>
                                setSearchName(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search by email"
                            value={searchEmail}
                            onChange={(e) =>
                                setSearchEmail(e.target.value)
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

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                        >
                            <option value="">
                                All Roles
                            </option>

                            <option value="user">
                                Normal User
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="owner">
                                Store Owner
                            </option>

                        </select>

                    </div>


                    {/* Users Table */}

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th
                                        onClick={() =>
                                            handleSort("name")
                                        }
                                    >
                                        Name ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort("email")
                                        }
                                    >
                                        Email ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort("address")
                                        }
                                    >
                                        Address ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort("role")
                                        }
                                    >
                                        Role ↕
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="no-data"
                                        >
                                            No users found
                                        </td>
                                    </tr>

                                ) : (

                                    filteredUsers.map((item) => (

                                        <tr key={item.id}>

                                            <td>
                                                {item.name}
                                            </td>

                                            <td>
                                                {item.email}
                                            </td>

                                            <td>
                                                {item.address}
                                            </td>

                                            <td>
                                                {item.role}
                                            </td>

                                            <td>

                                                <button
                                                    className="view-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${item.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Store Management - we'll build this next */}

                <div className="dashboard-section">

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
        }}
    >
        <h2>Store Management</h2>

        <button
            className="view-button"
            onClick={() => navigate("/admin/stores/add")}
        >
            + Add Store
        </button>
    </div>

    <div className="filters">

        <input
            type="text"
            placeholder="Search by store name"
            value={searchStoreName}
            onChange={(e) =>
                setSearchStoreName(e.target.value)
            }
        />

        <input
            type="text"
            placeholder="Search by email"
            value={searchStoreEmail}
            onChange={(e) =>
                setSearchStoreEmail(e.target.value)
            }
        />

        <input
            type="text"
            placeholder="Search by address"
            value={searchStoreAddress}
            onChange={(e) =>
                setSearchStoreAddress(e.target.value)
            }
        />

    </div>

    <div className="table-container">

        <table>

            <thead>
                <tr>

                    <th
                        onClick={() =>
                            handleStoreSort("name")
                        }
                    >
                        Store Name ↕
                    </th>

                    <th
                        onClick={() =>
                            handleStoreSort("email")
                        }
                    >
                        Email ↕
                    </th>

                    <th
                        onClick={() =>
                            handleStoreSort("address")
                        }
                    >
                        Address ↕
                    </th>

                    <th
                        onClick={() =>
                            handleStoreSort("rating")
                        }
                    >
                        Rating ↕
                    </th>
                    <th>
    Owner
</th>

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

                    filteredStores.map((store) => (

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
                            <td>
    {store.owner_name}
</td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>

    </div>

</div>

            </main>

        </div>
    );
}

export default AdminDashboard;