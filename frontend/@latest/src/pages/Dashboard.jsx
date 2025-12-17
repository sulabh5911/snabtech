import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import toast from "react-hot-toast";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [originalUsers, setOriginalUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active"); // active | inactive


  // ================= ADMIN INFO =================
  
  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    const res = await userAPI.get("/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setUsers(res.data);
    setOriginalUsers(res.data);
  };

  // ================= DELETE USER =================
  const deleteUser = (id) => {
  toast.custom(
    (t) => (
      <div
        style={{
          position: "absolute",              // ✅ FIXED
          top: "-450px",                      // ✅ CENTER
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          textAlign: "center",
          minWidth: "320px",
          zIndex: 9999
        }}
      >
        <p style={{ marginBottom: "15px", fontWeight: "500" }}>
          Are you sure you want to deactivate this user?
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button
            onClick={async () => {
              toast.dismiss("delete-confirm"); // ✅ CLOSE CONFIRM

              await userAPI.put(`/deactivate/${id}`,null, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              });

              fetchUsers();

              // ✅ SUCCESS TOAST (TOP RIGHT)
              toast.success("User successfully deactivated", {
                position: "top-right"
              });
            }}
            style={{
              background: "#e53935",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Yes
          </button>

          <button
            onClick={() => toast.dismiss("delete-confirm")}
            style={{
              background: "#ccc",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      id: "delete-confirm",        // ✅ ONLY ONE INSTANCE
      duration: Infinity,          // ✅ jab tak click na ho
      position: "center"
    }
  );
};

  // ================= SORT TOGGLE =================
  const toggleSort = () => {
    if (sortOrder === "none") setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder("none");
  };

  // ================= SEARCH + FILTER + SORT =================
  useEffect(() => {
    let data = [...originalUsers];
    const today = new Date();

    // Search
    if (search) {
      data = data.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      data = data.filter((u) => {
        if (!u.dateOfJoining) return false;
        const joinDate = new Date(u.dateOfJoining);
        const diffDays =
          (today - joinDate) / (1000 * 60 * 60 * 24);

        if (dateFilter === "today") return diffDays < 1;
        if (dateFilter === "7") return diffDays <= 7;
        if (dateFilter === "30") return diffDays <= 30;
        return true;
      });
    }

    // Type filter
    if (typeFilter !== "all") {
      data = data.filter(
        (u) =>
          u.employmentType?.toLowerCase() ===
          typeFilter.toLowerCase()
      );
    }

    // Sort
    if (sortOrder === "asc") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }
    // 🔹 ACTIVE / INACTIVE FILTER
    if (statusFilter === "active") {
    data = data.filter(u => u.isActive === true);
  }

  if (statusFilter === "inactive") {
    data = data.filter(u => u.isActive === false);
  }

    setUsers(data);
  }, [search,  dateFilter, typeFilter,sortOrder,statusFilter, originalUsers]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "90px 20px 20px 20px" }}>
      {/* ================= TOP NAV BAR ================= */}
      <div
      style={{
    position: "fixed",
    top: "15px",
    left: "20px",
    background: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 1000
  }}
>
        {/* LEFT TOP ADMIN PROFILE */}
<div
  style={{
    position: "fixed",
    top: "15px",
    left: "20px",
    background: "#fff",
    padding: "12px 16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 1000
  }}
>
  {/* Avatar Circle */}
  <div
    style={{
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      background: "#e0e0e0ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: "16px"
    }}
  >
    {admin?.name?.charAt(0)}
  </div>

  {/* Name + Email */}
  <div>
    <div style={{ fontWeight: "600", fontSize: "15px" }}>
      {admin?.name}
      <span style={{ fontSize: "13px", color: "#777" }}>
        {" "} (Admin)
      </span>
    </div>

    <div style={{ fontSize: "13px", color: "#555" }}>
      {admin?.email}
    </div>
  </div>
</div>


        {/* RIGHT : LOGOUT */}
        <button
          onClick={handleLogout}
           style={{
            position: "fixed",
            top: "15px",
            right: "20px",
            background: "#e53935",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            zIndex: 1000
  }}
        >
          Logout
        </button>
      </div>

      {/* ================= USERS HEADER BOX ================= */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h2>All Users</h2>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Intern">Intern</option>
            </select>

            <button onClick={toggleSort}>
              {sortOrder === "none" && "↕️"}
              {sortOrder === "asc" && "⬆️"}
              {sortOrder === "desc" && "⬇️"}
            </button>

            <Link to="/add-user">
              <button>+ Add User</button>
            </Link>
            <button
  onClick={() => setStatusFilter("active")}
  style={{
    background: statusFilter === "active" ? "#1976d2" : "#ccc",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none"
  }}
>
  Active Users
</button>

<button
  onClick={() => setStatusFilter("inactive")}
  style={{
    background: statusFilter === "inactive" ? "#1976d2" : "#ccc",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none"
  }}
>
  Inactive Users
</button>

          </div>
        </div>
      </div>

      {/* ================= TABLE BOX ================= */}
      <div
        style={{
          background: "#fff",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <table width="100%" cellPadding="12">
          <thead>
            <tr>
              <th>Profile</th>  
              <th>Employee Id</th>
              <th>Name</th>
              <th>Email / Phone</th>
              <th>Joining Date</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                {/* ================= PROFILE IMAGE COLUMN ================= */}
  <td>
    {u.profileImage ? (
      <img
        src={u.profileImage}
        alt={u.name}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
    ) : (
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600"
        }}
      >
        {u.name?.charAt(0)?.toUpperCase()}
      </div>
    )}
  </td>

                <td>{u.employeeId}</td>
                <td>{u.name}</td>
                <td>
                  {u.professionalEmail}
                  <br />
                  {u.phone}
                </td>
                <td>
                  {u.dateOfJoining
                    ? new Date(u.dateOfJoining).toDateString()
                    : "-"}
                </td>
                <td>{u.employmentType}</td>
                <td>
  {u.isActive ? (
    <>
      <Link to={`/edit-user/${u._id}`}>✏️</Link>{" "}
      <button
        onClick={() => deleteUser(u._id)}
        style={{ border: "none", background: "none", cursor: "pointer" }}
      >
        🗑️
      </button>
    </>
  ) : (
    <button
      onClick={async () => {
        await userAPI.put(`/activate/${u._id}`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        fetchUsers();
        toast.success("User activated", { position: "top-right" });
      }}
      style={{
        background: "#43a047",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      Activate
    </button>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
