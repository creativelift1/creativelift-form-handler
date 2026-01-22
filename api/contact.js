// api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
 if (req.method !== "POST") {
 return res.status(405).json({ success: false, error: "Method not allowed" });
 }

 const {
 firstName,
 lastName,
 phone,
 email,
 serviceInterest,
 message,
 } = req.body || {};

 if (!firstName || !lastName || !email || !message) {
 return res
 .status(400)
 .json({ success: false, error: "Missing required fields" });
 }

 try {
 const transporter = nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: Number(process.env.SMTP_PORT || 465),
 secure: process.env.SMTP_SECURE === "true",
 auth: {
 user: process.env.SMTP_USER,
 pass: process.env.SMTP_PASS,
 },
 });

 const mailOptions = {
 from: `"CreativeLift Forms" <${process.env.FROM_EMAIL}>`,
 to: process.env.TO_EMAIL,
 subject: `New Lead from ${firstName} ${lastName}`,
 replyTo: email,
 text: `
New lead from CreativeLift:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || "N/A"}
Service Interest: ${serviceInterest || "N/A"}

Message:
${message}
 `.trim(),
 };

 await transporter.sendMail(mailOptions);

 return res.status(200).json({ success: true });
 } catch (error) {
 console.error("Email send error:", error);
 return res
 .status(500)
 .json({ success: false, error: "Failed to send email" });
 }
}
