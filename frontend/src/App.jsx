// import Login from "./pages/Login"

// function App() {

//   return (
//    <Login/>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import UserDetails from "./pages/UserDetails";
import AddUser from "./pages/AddUser";
import AddStore from "./pages/AddStore";
import UserDashboard from "./pages/UserDashboard";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/admin/users/:id" element={<UserDetails />} /> */}
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/admin/users/add" element={<AddUser />} /> */}
        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/admin/stores/add" element={<AddStore />} /> */}
        <Route
          path="/admin/stores/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddStore />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/user" element={<UserDashboard />} /> */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />

        {/* <Route path="/change-password" element={<ChangePassword />} /> */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/owner" element={<OwnerDashboard />} /> */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
