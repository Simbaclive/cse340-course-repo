import { getAllUsers } from '../models/users.js';

export const buildUsersView = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('users', {
            title: 'Registered Users',
            users,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};