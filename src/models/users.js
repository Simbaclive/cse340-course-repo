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

export async function getUserByEmail(email) {
    try {
        const sql = 'SELECT user_id, name, email, password, role FROM users WHERE email = $1';
        const result = await db.query(sql, [email]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}

export async function createUser(name, email, hashedPassword, role = 'Client') {
    try {
        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, name, email, role
        `;
        const result = await db.query(sql, [name, email, hashedPassword, role]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}