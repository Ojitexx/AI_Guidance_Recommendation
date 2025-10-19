import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token and new password are required.' });
    }
    
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
        const { rows: tokens } = await sql`
            SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ${token};
        `;

        if (tokens.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        const resetToken = tokens[0];
        if (new Date() > new Date(resetToken.expires_at)) {
            // Clean up expired token
            await sql`DELETE FROM password_reset_tokens WHERE token = ${token};`;
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await sql`
            UPDATE users SET password = ${hashedPassword} WHERE id = ${resetToken.user_id};
        `;

        // Invalidate the token after use
        await sql`DELETE FROM password_reset_tokens WHERE token = ${token};`;

        return res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}