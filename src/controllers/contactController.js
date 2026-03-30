require("dotenv").config({ quiet: true });

const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Save to MongoDB
    const contact = await Contact.create({ name, email, phone, subject, message });

    // 2. Send notification email to the clinic
    await transporter.sendMail({
      from: `"Dental Website" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `📬 New Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <hr/>
        <small>Submitted at: ${new Date().toLocaleString()}</small>
      `,
    });

    // 3. Send auto-reply to the user
    await transporter.sendMail({
      from: `"DentalCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We received your message, ${name}!`,
      html: `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We've received your message about "<strong>${subject}</strong>" and will get back to you within 24 hours.</p>
        <p>If this is a dental emergency, please call us immediately at <strong>+1 (555) 123-4567</strong>.</p>
        <br/>
        <p>Best regards,<br/>DentalCare Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: { id: contact._id },
    });
    console.log("Contact submission successful:");
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = { submitContact };