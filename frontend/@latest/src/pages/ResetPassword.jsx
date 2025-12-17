import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";



export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const submit = async (e) => {
  e.preventDefault();

  if (!password) {
    toast.error("Please enter new password");
    return;
  }

  try {
    await adminAPI.post(`/reset-password/${token}`, { password });

    // ✅ SUCCESS TOAST
    toast.success("Password updated successfully", {
      position: "top-right"
    });

    navigate("/");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};


  return (
    <form onSubmit={submit}>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New Password" onChange={e => setPassword(e.target.value)} />
      <button>Reset</button>
    </form>
  );
}
