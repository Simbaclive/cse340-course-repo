import db from './db.js';

export async function getAllUsers() {
    try {
        const sql = 'SELECT user_id, name, email, role FROM users ORDER BY name ASC';
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}