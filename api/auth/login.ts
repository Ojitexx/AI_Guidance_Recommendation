import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { rows } = await sql`
            SELECT id, name, email, password, department, level, role 
            FROM users 
            WHERE email = ${email.toLowerCase()};
        `;

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];

        // IMPORTANT: In a production app, compare hashed passwords here
        const passwordMatch = user.password === password;

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
