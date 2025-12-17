import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../services/api";
import "./Dashboard.css";


export default function Dashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await userAPI.get("/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await userAPI.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>All Users</h2>
        <Link to="/add-user">
          <button>+ Add User</button>
        </Link>
      </div>

      <table width="100%" cellPadding="12" style={{ marginTop: "15px" }}>
        <thead>
          <tr>
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
              <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  {u.profileImage ? (
    <img
      src={u.profileImage}
      alt="profile"
      width="40"
      height="40"
      style={{
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
        background: "#ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px"
      }}
    >
      {u.name?.charAt(0).toUpperCase()}
    </div>
  )}

  <span style={{ fontWeight: 500 }}>{u.employeeId}</span>
</td>


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

              <td>{u.employmentType || "-"}</td>

              <td>
                
                <Link to={`/edit-user/${u._id}`}>✏️</Link>{" "}
                <button
                  style={{ border: "none", background: "none", cursor: "pointer" }}
                  onClick={() => deleteUser(u._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
