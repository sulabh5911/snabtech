import { useState } from "react";
import { userAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./AddUser.css";

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    professionalEmail: "",
    personalEmail: "",
    dob: "",
    dateOfJoining: "",
    role: "",
    employmentType: "",
    address: "",
    phone: ""
  });
   const [image, setImage] = useState(null);
   const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const submit = async (e) => {
  e.preventDefault();

  // 🔐 VALIDATIONS
  if (!form.name.trim()) {
    toast.error("Name is required");
    return;
  }

  if (!form.professionalEmail.trim()) {
    toast.error("Professional email is required");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.professionalEmail)) {
    toast.error("Enter a valid professional email");
    return;
  }

  if (!form.phone.trim()) {
    toast.error("Phone number is required");
    return;
  }

  if (!/^\d{10}$/.test(form.phone)) {
    toast.error("Phone number must be exactly 10 digits");
    return;
  }

  // ✅ API CALL
  try {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (image) formData.append("profileImage", image);

    await userAPI.post("/add", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data"
      }
    });

    toast.success("User created successfully", { position: "top-right" });
    navigate("/dashboard");

  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to add user");
  }
};


  return (
    <div className="add-user-wrapper">
      <div className="header">
        <h2>Create User</h2>
        <button className="add-fields">Add Fields</button>
      </div>

      <div className="add-user-container">
        {/* LEFT FORM */}
        <form className="user-form" onSubmit={submit}>
          <div className="row">
            <div className="field">
              <label>Name *</label>
              <input name="name" placeholder="Enter Name" onChange={handleChange} />
            </div>

            <div className="field">
              <label>Professional Email *</label>
              <input
                name="professionalEmail"
                placeholder="Enter Professional Email"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Personal Email</label>
              <input
                name="personalEmail"
                placeholder="Enter Personal Email"
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Date of Joining</label>
              <input type="date" name="dateOfJoining" onChange={handleChange} />
            </div>

            <div className="field">
              <label>Role</label>
              <select name="role" onChange={handleChange}>
                <option value="">Search for a role…</option>
                <option>Developer</option>
                <option>Manager</option>
                <option>HR</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Employment Type</label>
              <select name="employmentType" onChange={handleChange}>
                <option value="">Select Employment Type</option>
                <option>Full Time</option>
                <option>Intern</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="field">
              <label>Permanent Address</label>
              <input
                name="address"
                placeholder="Enter Permanent Address"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Phone Number</label>
              <input
                name="phone"
                placeholder="Enter Phone Number"
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="submit-btn">Create User</button>
        </form>

        {/* RIGHT PROFILE IMAGE */}
        <div className="profile-box">
  <div className="avatar">
    {image ? (
      <img
        src={URL.createObjectURL(image)}
        alt="preview"
        width="100"
        height="100"
        style={{ borderRadius: "50%" }}
      />
    ) : (
      <span className="a">No Image</span>
    )}
  </div>

  <input
    type="file"
    accept="image/*"
    hidden
    id="profileImage"
    onChange={(e) => setImage(e.target.files[0])}
  />

  <button
    type="button"
    className="upload-btn"
    onClick={() => document.getElementById("profileImage").click()}
  >
    Upload
  </button>

  <button
    type="button"
    className="remove-btn"
    onClick={() => setImage(null)}
  >
    Remove
  </button>
</div>

      </div>
    </div>
  );
}
