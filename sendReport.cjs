// require('dotenv').config();
// const nodemailer = require('nodemailer');

// async function sendEmail() {

//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   let mailOptions = {
//   from: process.env.EMAIL_USER,
//   to: process.env.EMAIL_TO,
//   subject: 'Playwright Automation Report',

//   html: `
//     <p>Hi Sir,</p>

//     <p>Automation execution has been completed successfully.</p>

//     <p>Please click the link below to view the detailed report:</p>

//     <a href="https://rohitsolanki401.github.io/playwright-automation-reports/"
//        style="display:inline-block;
//               padding:10px 20px;
//               background-color:#0078D7;
//               color:white;
//               text-decoration:none;
//               border-radius:5px;">
//        View Automation Report
//     </a>

//     <br><br>
//     <p>Thanks,<br>Rohit</p>
//   `
// };

//   await transporter.sendMail(mailOptions);
//   console.log("Email sent successfully ✅");
// }

// sendEmail();