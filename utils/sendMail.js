const nodemailer = require('nodemailer');

// 📬 Hàm gửi email
const sendMail = (to, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thangtnph52751@gmail.com',       
      pass: 'gmnz smmb kuco hrso',          
    },
  });

  const mailOptions = {
    from: 'thangtnph52751@gmail.com',
    to,
    subject,
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error sending mail:', error);
    } else {
      console.log('✅ Email sent:', info.response);
    }
  });
};

module.exports = sendMail;
