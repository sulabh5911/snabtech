const SibApiV3Sdk = require("sib-api-v3-sdk");

/* ================= BREVO CONFIG ================= */
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* ================= ADMIN FORGOT PASSWORD ================= */
const sendMail = async (email, link) => {
  try {
    await transactionalEmailApi.sendTransacEmail({
      sender: {
        email:  "sulabh@snabbtech.com",// ⚠️ must be VERIFIED in Brevo
        name: "SnabTech"
      },
      to: [{ email }],
      subject: "Reset Your Password",
      htmlContent: `
        <h3>Password Reset</h3>
        <p>Click the button below to reset your password:</p>
        <a href="${link}"
           style="padding:10px 15px;background:#1976d2;color:#fff;text-decoration:none;border-radius:5px">
           Reset Password
        </a>
      `
    });
  } catch (error) {
    console.error("❌ Brevo Forgot Mail Error:", error.response?.body || error);
    throw error;
  }
};

/* ================= NEW USER CREDENTIAL MAIL ================= */
const sendUserCredentialsMail = async (email, employeeId, password, name) => {
  try {
    await transactionalEmailApi.sendTransacEmail({
      sender: {
        email: "sulabh@snabbtech.com",
        name: "SnabTech"
      },
      to: [{ email }],
      subject: "Your Account Credentials",
      htmlContent: `
        <h2>Welcome ${name}</h2>
        <p>Your account has been created successfully.</p>
        <p><b>Employee ID:</b> ${employeeId}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please login and change your password.</p>
      `
    });
  } catch (error) {
    console.error("❌ Brevo Credential Mail Error:", error.response?.body || error);
    throw error;
  }
};

module.exports = {
  sendMail,
  sendUserCredentialsMail
};
