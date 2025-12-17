import { useState } from "react";
import { adminAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
  e.preventDefault();
  try {
    const res = await adminAPI.post("/login", { email, password, rememberMe });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};


 
return (
  <div className="auth-container">
    <h2>Login</h2>

    <form onSubmit={login}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-box">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      {/* ✅ REMEMBER ME */}
      <div className="login-options">
      <label className="remember-me">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <span>Remember Me</span>
      </label>

      {/* ✅ FORGOT PASSWORD (REMEMBER ME KE NICHE) */}
      <div className="forgot-box">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      </div>

      <button type="submit">Login</button>
    </form>

    <div className="links">
      <p>
        Don't Have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  </div>
);

}