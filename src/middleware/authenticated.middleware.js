import { verify } from '../utils/token.js';
import { db } from '../utils/db.js';

export default async function authenticated(req, res, next) {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const authToken = bearer.split('Bearer ')[1].trim();

    const verified = await verify(authToken);

    if (!verified) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [verified.id.userId]
    });

    if(result.rowAffected === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
        
    req.user = result.rows[0];
    next();
}