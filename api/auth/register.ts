import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, password, department, level } = req.body;
        
        if (!name || !email || !password || !level) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { rows: existingUsers } = await sql`
            SELECT id FROM users WHERE email = ${email.toLowerCase()};
        `;
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { rows } = await sql`
            INSERT INTO users (name, email, password, department, level, role)
            VALUES (${name}, ${email.toLowerCase()}, ${hashedPassword}, ${department}, ${level}, 'student')
            RETURNING id, name, email, department, level, role;
        `;

        return res.status(201).json(rows[0]);

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}