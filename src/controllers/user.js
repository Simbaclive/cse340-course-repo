import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, authenticateUser } from '../models/user.js';
import { getVolunteeredProjectsByUserId } from '../models/volunteers.js';

export const showLoginForm = async (req, res, next) => {
    try {
        res.render('login', {
            title: 'Login',
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};

export const showUserRegistrationForm = async (req, res, next) => {
    try {
        res.render('register', {
            title: 'Register',
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};

export const processUserRegistrationForm = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'An account with that email already exists.');
            return res.status(400).render('register', {
                title: 'Register',
                errors: null,
                name,
                email,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(name, email, hashedPassword);

        req.flash('success', 'Registration successful. Please log in.');
        return res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

export const processLoginForm = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.status(400).render('login', {
                title: 'Login',
                errors: null,
                email,
            });
        }

        req.session.loggedin = true;
        req.session.accountData = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        return res.redirect('/dashboard');
    } catch (error) {
        next(error);
    }
};

export const processLogout = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    } catch (error) {
        next(error);
    }
};

export const showDashboard = async (req, res, next) => {
    try {
        const volunteeredProjects = await getVolunteeredProjectsByUserId(req.session.accountData.user_id);
        res.render('dashboard', {
            title: 'Dashboard',
            accountData: req.session.accountData,
            volunteeredProjects,
        });
    } catch (error) {
        next(error);
    }
};

export const requireLogin = (req, res, next) => {
    if (req.session && req.session.loggedin) {
        return next();
    }
    return res.redirect('/login');
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.accountData && req.session.accountData.role === role) {
            return next();
        }
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/dashboard');
    };
};