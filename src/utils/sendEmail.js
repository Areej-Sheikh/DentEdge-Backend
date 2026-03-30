const nodemailer = require("nodemailer");

/* =========================
   SEND EMAIL FUNCTION
========================= */

const sendEmail = async ({ to, subject, html }) => {

  try {

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"DentalCare Platform" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

  } catch (error) {

    console.error("Email error:", error);

  }

};


/* =========================
   EMAIL TEMPLATES
========================= */

const resetPasswordTemplate = (resetLink) => {

return `
<div style="font-family:Arial;max-width:600px;margin:auto">

<h2>Password Reset Request</h2>

<p>You requested a password reset for your Dental Clinic account.</p>

<p>Click the button below to reset your password:</p>

<a href="${resetLink}"
style="
display:inline-block;
padding:12px 20px;
background:#2563eb;
color:#fff;
text-decoration:none;
border-radius:6px;
margin-top:10px;
">
Reset Password
</a>

<p style="margin-top:20px">
If you did not request this, please ignore this email.
</p>

<hr>

<p style="font-size:12px;color:#777">
DentalCare Platform
</p>

</div>
`;

};


module.exports = {
  sendEmail,
  resetPasswordTemplate
};