import React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
}

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailProps>> = ({ userName, resetLink }) => (
  <html lang="en">
    <head>
        <style>{`
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 20px; }
            .button { display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #006400; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
        `}</style>
    </head>
    <body>
        <div className="container">
            <div className="header">
                <h2>CareerGuidance Password Reset</h2>
            </div>
            <p>Hello {userName},</p>
            <p>We received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
            <p>To reset your password, please click the button below. This link is valid for one hour.</p>
            <div style={{ textAlign: 'center' }}>
              <a href={resetLink} className="button" style={{ color: '#ffffff' }}>Reset Your Password</a>
            </div>
            <p>If the button above does not work, please copy and paste the following link into your browser:</p>
            <p><a href={resetLink}>{resetLink}</a></p>
            <p>Thank you,</p>
            <p>The CareerGuidance Team</p>
            <div className="footer">
                <p>&copy; {new Date().getFullYear()} CareerGuidance. All Rights Reserved.</p>
            </div>
        </div>
    </body>
  </html>
);