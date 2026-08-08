import express from 'express';
import { body } from 'express-validator';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    renderNewProjectForm, 
    processNewProject, 
    renderEditProjectForm, 
    processEditProject,
    processVolunteerSignup,
    processVolunteerRemoval
} from './controllers/projects.js';
import { 
    showOrganizationDetailsPage, 
    showOrganizationsPage, 
    renderNewOrganizationForm, 
    processNewOrganization, 
    renderEditOrganizationForm, 
    processEditOrganization 
} from './controllers/organizations.js';
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

const organizationValidationRules = [
    body('name', 'Organization name must be between 3 and 150 characters')
        .trim().isLength({ min: 3, max: 150 }).escape(),
    body('description', 'Description is required')
        .trim().notEmpty(),
    body('contact_email', 'A valid email is required')
        .trim().isEmail().normalizeEmail(),
    body('logo_filename', 'Logo filename is required')
        .trim().notEmpty().escape()
];

const projectValidationRules = [
    body('organization_id', 'Organization is required')
        .notEmpty().isInt(),
    body('title', 'Title must be between 3 and 150 characters')
        .trim().isLength({ min: 3, max: 150 }).escape(),
    body('description', 'Description is required')
        .trim().notEmpty(),
    body('location', 'Location is required')
        .trim().notEmpty().escape(),
    body('date', 'A valid date is required')
        .notEmpty().isDate()
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
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireLogin, requireAdmin, renderNewOrganizationForm);
router.post('/new-organization', requireLogin, requireAdmin, organizationValidationRules, processNewOrganization);
router.get('/edit-organization/:id', requireLogin, requireAdmin, renderEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireAdmin, organizationValidationRules, processEditOrganization);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireLogin, requireAdmin, renderNewProjectForm);
router.post('/new-project', requireLogin, requireAdmin, projectValidationRules, processNewProject);
router.get('/edit-project/:id', requireLogin, requireAdmin, renderEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireAdmin, projectValidationRules, processEditProject);

router.get('/categories', showCategoriesPage); 
router.get('/category/:id', showCategoryDetailsPage); 
router.get('/new-category', requireLogin, requireAdmin, renderNewCategoryForm);
router.post('/new-category', requireLogin, requireAdmin, categoryValidationRules, processNewCategory);
router.get('/edit-category/:id', requireLogin, requireAdmin, renderEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireAdmin, categoryValidationRules, processEditCategory);

router.get('/users', requireLogin, requireAdmin, buildUsersView);

router.get('/login', buildLoginView);
router.post('/login', processLogin);
router.get('/register', buildRegisterView);
router.post('/register', processRegistration);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, buildDashboardView);

router.post('/volunteer/:id', requireLogin, processVolunteerSignup);
router.post('/unvolunteer/:id', requireLogin, processVolunteerRemoval);

export default router;