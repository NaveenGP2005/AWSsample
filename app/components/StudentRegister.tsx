import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb'; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, usn, email, event } = req.body;

    if (!name || !usn || !email || !event) {
        return res.status(400).json({ message: 'All fields are required (name, usn, email, event)' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('student-checkin');
        await db.collection('Registrations').insertOne({
            name,
            usn,
            email,
            event,
            createdAt: new Date(),
        });

        res.status(201).json({
            message: 'Student registered successfully',
            student: { name, usn, email, event },
        });
    } catch (err: any) {
        console.error('❌ DATABASE ERROR:', err.message);
        console.error(err.stack); // full error stack
        res.status(500).json({ message: 'Database error', error: err.message });
    }
}