const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const resetUrl = options.message.split('PUT request to:')[1]?.trim() || options.message;

  // Check if real password is provided in .env
  if (!process.env.EMAIL_PASS ||
      process.env.EMAIL_PASS === 'your-app-password' ||
      process.env.EMAIL_PASS.includes('PASTE_YOUR') ||
      process.env.EMAIL_PASS.length < 8) {

    console.log('\n===============================================================');
    console.log('[DEVELOPMENT MODE: GMAIL APP PASSWORD NOT CONFIGURED]');
    console.log(`To send real emails to: ${options.email}`);
    console.log('1. Go to: https://myaccount.google.com/apppasswords');
    console.log('2. Generate a 16-character App Password');
    console.log('3. Set EMAIL_PASS=your_app_password in backend/.env');
    console.log('');
    console.log('FOR TESTING NOW, USE THIS RESET LINK:');
    console.log(resetUrl);
    console.log('===============================================================\n');

    return { sent: false, resetUrl };
  }

  // Optimized for Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.replace(/\s+/g, ''), // strip spaces if copied with spaces
    },
  });

  const message = {
    from: `"${process.env.FROM_NAME || 'BookConnect Support'}" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #f97316; text-align: center;">BookConnect</h2>
        <h3 style="color: #333;">Password Reset Request</h3>
        <p style="color: #555; line-height: 1.5;">
          You requested to reset your password for your BookConnect account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset My Password
          </a>
        </div>
        <p style="color: #777; font-size: 13px;">
          If the button above does not work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #f97316;">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; text-align: center;">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(message);
  return { sent: true };
};

module.exports = sendEmail;