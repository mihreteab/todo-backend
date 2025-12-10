import jwt from 'jsonwebtoken';

async function verify(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return false;
    }
    
}

async function create(user_id) {
    return jwt.sign({ id:user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export { verify, create };