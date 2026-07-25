import { validationResult } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId, 
    createCategory, 
    updateCategory 
} from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    res.render('category_details', { 
        title: category.category_name, 
        category, 
        projects 
    });
};

const renderNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Create New Category', errors: [], formData: {} });
};

const processNewCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('new-category', {
            title: 'Create New Category',
            errors: errors.array(),
            formData: req.body || {}
        });
    }

    try {
        await createCategory(req.body.category_name);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while creating the category.');
        res.status(500).send('Server Error');
    }
};

const renderEditCategoryForm = async (req, res) => {
    try {
        const category = await getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.render('edit-category', { title: 'Edit Category', category, errors: [] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const processEditCategory = async (req, res) => {
    const errors = validationResult(req);
    const categoryName = req.body ? req.body.category_name : undefined;

    if (!errors.isEmpty()) {
        return res.status(400).render('edit-category', {
            title: 'Edit Category',
            category: { 
                category_id: req.params.id, 
                category_name: categoryName 
            },
            errors: errors.array()
        });
    }

    try {
        await updateCategory(req.params.id, categoryName);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while updating the category.');
        res.status(500).send('Server Error');
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    renderNewCategoryForm, 
    processNewCategory, 
    renderEditCategoryForm, 
    processEditCategory 
};
