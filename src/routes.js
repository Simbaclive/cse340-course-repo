import express from 'express';
import { body } from 'express-validator';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationDetailsPage, showOrganizationsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';
import { buildUsersView } from './controllers/users.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    renderNewCategoryForm, 
    processNewCategory, 
    renderEditCategoryForm, 
    processEditCategory 
} from './controllers/categories.js'; 

import { 
    buildLoginView, 
    buildRegisterView, 
    processRegistration, 
    processLogin, 
    processLogout,
    buildDashboardView 
} from './controllers/account.js';


const router = express.Router();

const categoryValidationRules = [
    body('category_name', 'Category name must be between 3 and 100 characters')
        .trim()
        .isLength({ min: 3, max: 100 })
        .escape()
];

// Middleware for authentication and admin check
const requireLogin = (req, res, next) => {
    if (req.session && req.session.loggedin) {
        return next();
    }
    return res.redirect('/login');
};

const requireAdmin = (req, res, next) => {
    if (req.session && req.session.accountData && req.session.accountData.role === 'Admin') {
        return next();
    }
    return res.redirect('/dashboard');
};

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/categories', showCategoriesPage); 
router.get('/category/:id', showCategoryDetailsPage); 

router.get('/new-category', renderNewCategoryForm);
router.post('/new-category', categoryValidationRules, processNewCategory);

router.get('/edit-category/:id', renderEditCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, processEditCategory);

router.get('/users', requireLogin, requireAdmin, buildUsersView);

router.get('/login', buildLoginView);
router.post('/login', processLogin);
router.get('/register', buildRegisterView);
router.post('/register', processRegistration);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, buildDashboardView);

router.get('/new-category', requireLogin, requireAdmin, renderNewCategoryForm);
router.post('/new-category', requireLogin, requireAdmin, categoryValidationRules, processNewCategory);

router.get('/edit-category/:id', requireLogin, requireAdmin, renderEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireAdmin, categoryValidationRules, processEditCategory);
export default router;
