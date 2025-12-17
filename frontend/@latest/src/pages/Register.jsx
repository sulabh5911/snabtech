import { useState } from "react";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.post("/register", form);
     toast.success("Registration successful", {
      position: "top-right"
    });

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    }
  };

 return (
  <div className="auth-container">
    <h2>Register</h2>

    <form onSubmit={submit}>
      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />

      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <div className="password-box">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <button type="submit">Register</button>
    </form>

    <div className="links">
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  </div>
);
}