import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

const BCRYPT_PREFIX = '$2b$';

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
        let passwordMatch = false;

        // Check if the stored password is a bcrypt hash
        if (user.password.startsWith(BCRYPT_PREFIX)) {
            // Compare hashed password
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            // This is a legacy plaintext password
            passwordMatch = user.password === password;
            if (passwordMatch) {
                // If it matches, hash it and update the DB for future logins
                console.log(`Upgrading password for user: ${user.email}`);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${user.id};`;
            }
        }
        
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