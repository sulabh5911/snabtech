import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

export default function EditUser() {
  const { id } = useParams();          // user id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    professionalEmail: "",
    phone: "",
    dateOfJoining: "",
    employmentType: ""
  });

  // 🔹 Fetch single user
  useEffect(() => {
    userAPI
      .get("/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((res) => {
        const user = res.data.find(u => u._id === id);
        if (user) setForm(user);
      });
  }, [id]);

  // 🔹 Update user
  const submit = async (e) => {
    e.preventDefault();

    await userAPI.put(`/${id}`, form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    navigate("/dashboard"); // ✅ back to dashboard
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Edit User</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Professional Email"
          value={form.professionalEmail}
          onChange={(e) =>
            setForm({ ...form, professionalEmail: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="date"
          value={form.dateOfJoining?.slice(0, 10)}
          onChange={(e) =>
            setForm({ ...form, dateOfJoining: e.target.value })
          }
        />

        <select
          value={form.employmentType}
          onChange={(e) =>
            setForm({ ...form, employmentType: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option>Full time</option>
          <option>Intern</option>
          <option>Contract</option>
        </select>

        <button type="submit">Update User</button>
      </form>
    </div>
  );
}
