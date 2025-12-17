const nodemailer = require("nodemailer");

/* ✅ CREATE TRANSPORTER ONCE */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= ADMIN FORGOT PASSWORD ================= */
const sendMail = async (email, link) => {
  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `<a href="${link}">Reset Password</a>`
  });
};

/* ================= NEW USER CREDENTIAL MAIL ================= */
const sendUserCredentialsMail = async (email, employeeId, password, name) => {
  await transporter.sendMail({
    to: email,
    subject: "Your Employee Account Details",
    html: `
      <h2>Welcome ${name}</h2>
      <p>Your account has been created.</p>
      <p><b>Employee ID:</b> ${employeeId}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Please login and change your password.</p>
    `
  });
};

module.exports = {
  sendMail,
  sendUserCredentialsMail
};
