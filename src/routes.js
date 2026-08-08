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
    showLoginForm,
    showUserRegistrationForm,
    processUserRegistrationForm,
    processLoginForm,
    processLogout,
    showDashboard,
    requireLogin,
    requireRole
} from './controllers/user.js';

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

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireLogin, requireRole('Admin'), renderNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('Admin'), organizationValidationRules, processNewOrganization);
router.get('/edit-organization/:id', requireLogin, requireRole('Admin'), renderEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('Admin'), organizationValidationRules, processEditOrganization);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireLogin, requireRole('Admin'), renderNewProjectForm);
router.post('/new-project', requireLogin, requireRole('Admin'), projectValidationRules, processNewProject);
router.get('/edit-project/:id', requireLogin, requireRole('Admin'), renderEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('Admin'), projectValidationRules, processEditProject);
router.post('/volunteer/:id', requireLogin, processVolunteerSignup);
router.post('/unvolunteer/:id', requireLogin, processVolunteerRemoval);

router.get('/categories', showCategoriesPage); 
router.get('/category/:id', showCategoryDetailsPage); 
router.get('/new-category', requireLogin, requireRole('Admin'), renderNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('Admin'), categoryValidationRules, processNewCategory);
router.get('/edit-category/:id', requireLogin, requireRole('Admin'), renderEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('Admin'), categoryValidationRules, processEditCategory);

router.get('/users', requireLogin, requireRole('Admin'), buildUsersView);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;