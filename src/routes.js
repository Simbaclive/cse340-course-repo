import express from 'express';
import { body } from 'express-validator';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationDetailsPage, showOrganizationsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    renderNewCategoryForm, 
    processNewCategory, 
    renderEditCategoryForm, 
    processEditCategory 
} from './controllers/categories.js'; 

const router = express.Router();

const categoryValidationRules = [
    body('category_name', 'Category name must be between 3 and 100 characters')
        .trim()
        .isLength({ min: 3, max: 100 })
        .escape()
];

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

export default router;
