import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, password, department, level } = req.body;
        
        if (!name || !email || !password || !level) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const { rows: existingUsers } = await sql`
            SELECT id FROM users WHERE email = ${email.toLowerCase()};
        `;
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // In a real app, you should hash the password here before saving
        // const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await sql`
            INSERT INTO users (name, email, password, department, level, role)
            VALUES (${name}, ${email.toLowerCase()}, ${password}, ${department}, ${level}, 'student')
            RETURNING id, name, email, department, level, role;
        `;

        return res.status(201).json(rows[0]);

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}