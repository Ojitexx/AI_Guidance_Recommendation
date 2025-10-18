import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { userId } = req.query;

            const baseQuery = `
                SELECT 
                    tr.id, 
                    tr.user_id AS "userId", 
                    u.name AS "userName",
                    tr.recommended_career AS "recommendedCareer", 
                    tr.date_taken AS "dateTaken",
                    tr.full_result AS "fullResult"
                FROM test_results tr
                JOIN users u ON tr.user_id = u.id
            `;

            let rows;
            if (userId && typeof userId === 'string') {
                // Fetch results for a specific user
                const result = await sql.query(
                    `${baseQuery} WHERE tr.user_id = $1 ORDER BY tr.created_at DESC;`,
                    [userId]
                );
                rows = result.rows;
            } else {
                // Fetch all results for admin dashboard
                const result = await sql.query(
                    `${baseQuery} ORDER BY tr.created_at DESC;`
                );
                rows = result.rows;
            }
            
            return res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching test results:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { userId, recommendedCareer, dateTaken, fullResult } = req.body;
            if (!userId || !recommendedCareer || !dateTaken || !fullResult) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const { rows } = await sql`
                INSERT INTO test_results (user_id, recommended_career, date_taken, full_result)
                VALUES (${userId}, ${recommendedCareer}, ${dateTaken}, ${JSON.stringify(fullResult)})
                RETURNING id, user_id AS "userId", recommended_career AS "recommendedCareer", date_taken AS "dateTaken", full_result AS "fullResult";
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