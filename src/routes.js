import express from 'express';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationDetailsPage, showOrganizationsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';

import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js'; 

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/categories', showCategoriesPage); 

router.get('/category/:id', showCategoryDetailsPage); 

export default router;