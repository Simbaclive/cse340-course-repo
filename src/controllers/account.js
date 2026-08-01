import bcrypt from 'bcrypt';
import { getUserByEmail, createUser } from '../models/users.js';

export const buildLoginView = async (req, res, next) => {
    try {
        res.render('login', {
            title: 'Login',
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};

export const buildRegisterView = async (req, res, next) => {
    try {
        res.render('register', {
            title: 'Register',
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};

export const processRegistration = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await getUserByEmail(email);
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

export const processLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.status(400).render('login', {
                title: 'Login',
                errors: null,
                email,
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
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

export const buildDashboardView = async (req, res, next) => {
    try {
        res.render('dashboard', {
            title: 'Dashboard',
            accountData: req.session.accountData,
        });
    } catch (error) {
        next(error);
    }
};