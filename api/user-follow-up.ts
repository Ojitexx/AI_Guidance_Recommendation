import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userId, status } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ error: 'User ID and status are required' });
        }

        // Basic validation for status
        const allowedStatuses = ['none', 'pending', 'contacted'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status provided.' });
        }

        await sql`
            UPDATE users 
            SET follow_up_status = ${status} 
            WHERE id = ${userId};
        `;
        
        return res.status(200).json({ success: true, message: 'Status updated.' });

    } catch (error) {
        console.error('Error updating follow-up status:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}