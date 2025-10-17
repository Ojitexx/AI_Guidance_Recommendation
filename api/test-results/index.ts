import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { rows } = await sql`
                SELECT id, user_id AS "userId", recommended_career AS "recommendedCareer", date_taken AS "dateTaken"
                FROM test_results 
                ORDER BY created_at DESC;
            `;
            return res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching test results:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { userId, recommendedCareer, dateTaken } = req.body;
            if (!userId || !recommendedCareer || !dateTaken) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const { rows } = await sql`
                INSERT INTO test_results (user_id, recommended_career, date_taken)
                VALUES (${userId}, ${recommendedCareer}, ${dateTaken})
                RETURNING id, user_id AS "userId", recommended_career AS "recommendedCareer", date_taken AS "dateTaken";
            `;
            return res.status(201).json(rows[0]);

        } catch (error) {
            console.error('Error saving test result:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
