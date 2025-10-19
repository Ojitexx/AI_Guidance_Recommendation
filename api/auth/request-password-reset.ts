import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

/**
 * NOTE ON DATABASE SCHEMA:
 * This endpoint assumes a 'password_reset_tokens' table exists with the following schema:
 * 
 * CREATE TABLE password_reset_tokens (
 *     id SERIAL PRIMARY KEY,
 *     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *     token TEXT NOT NULL UNIQUE,
 *     expires_at TIMESTAMPTZ NOT NULL
 * );
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const { rows: users } = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()};`;

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = users[0];
        const token = randomBytes(32).toString('hex');
        const expires_at = new Date(Date.now() + 3600000); // 1 hour from now

        // Delete any existing tokens for this user to ensure only one is active
        await sql`DELETE FROM password_reset_tokens WHERE user_id = ${user.id};`;

        await sql`
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (${user.id}, ${token}, ${expires_at.toISOString()});
        `;

        // For demo purposes, return the token. In production, this would be emailed.
        return res.status(200).json({ token });

    } catch (error) {
        console.error('Request password reset error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}