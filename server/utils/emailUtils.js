import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // App password for Gmail
        },
    });

    // Define the email options
    const mailOptions = {
        from: `Miazii Shop <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export const getWelcomeTemplate = (name) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ebebeb; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #fed700; padding: 40px 20px; text-align: center;">
            <img src="https://miazii-shop.vercel.app/logo.png" alt="Miazii Shop" style="width: 120px; margin-bottom: 20px;">
            <h1 style="color: #333e48; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Club!</h1>
        </div>
        <div style="padding: 40px 30px; color: #333e48; line-height: 1.6;">
            <h2 style="font-size: 20px; border-bottom: 2px solid #fed700; display: inline-block; padding-bottom: 5px;">Hi ${name},</h2>
            <p style="font-size: 16px; margin-top: 20px;">We're absolutely thrilled to have you at <strong>Miazii Shop</strong> – your new home for premium electronics and high-performance tech.</p>
            <p style="font-size: 16px;">Whether you're looking for the latest flagship smartphone, a beast of a gaming laptop, or sleek audiophile gear, we've got you covered.</p>
            
            <div style="background-color: #f5f5f5; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; font-weight: bold; color: #333e48; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Ready to Explore?</p>
                <a href="https://miazii-shop.vercel.app" style="display: inline-block; margin-top: 15px; background-color: #fed700; color: #333e48; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">SHOP THE COLLECTION</a>
            </div>

            <p style="font-size: 14px; color: #666666; font-style: italic;">Need any help? Just reply to this email and our elite support team will be right there with you.</p>
        </div>
        <div style="background-color: #333e48; color: #ffffff; padding: 30px 20px; text-align: center; font-size: 12px; letter-spacing: 1px;">
            <p style="margin: 0;">&copy; 2026 MIAZII SHOP | All Rights Reserved</p>
            <p style="margin: 5px 0 0 0;">Stay Tech-Forward. Stay Ahead.</p>
        </div>
    </div>
    `;
};

export default sendEmail;
