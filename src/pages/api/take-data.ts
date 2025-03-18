import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'save-data.json');

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const resFile = await fs.readFile(filePath, 'utf-8');
            if (!resFile || resFile === "") {
                res.status(405).json({ message: 'Empty file' })
            }
            const data = JSON.parse(resFile);
            console.log(data);
            res.status(200).json({ message: 'Il file è vuoto' })
        }
    } catch (error) {
        res.status(500).json({ message:'Qualcosa è andato storto' })
    }
}