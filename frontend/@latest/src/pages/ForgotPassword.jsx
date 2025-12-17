import { useState } from "react";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";




export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();


 const submit = async (e) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter email");
    return;
  }

  try {
    const res = await adminAPI.post("/forgot-password", { email });

    // ✅ SUCCESS TOAST
    toast.success(
      res.data.message || "Reset link sent successfully to email",
      { position: "top-right" }
    );
    navigate("/login");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  }
};


  return (
    <form onSubmit={submit}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Send Reset Link</button>
    </form>
  );
}
