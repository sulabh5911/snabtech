import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminAPI } from "../services/api";


export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await adminAPI.post(`/reset-password/${token}`, { password });
    alert("Password Updated");
    navigate("/");
  };

  return (
    <form onSubmit={submit}>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New Password" onChange={e => setPassword(e.target.value)} />
      <button>Reset</button>
    </form>
  );
}
