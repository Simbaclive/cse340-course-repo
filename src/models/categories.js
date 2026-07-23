import db from './db.js';


const getAllCategories = async () => {
    const query = 'SELECT category_id, category_name FROM categories ORDER BY category_name ASC';
    const result = await db.query(query);
    return result.rows;
};


const getCategoryById = async (id) => {
    const query = 'SELECT * FROM categories WHERE category_id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};


const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.* 
        FROM public.project p
        JOIN project_categories pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1`;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};


const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.* 
        FROM categories c
        JOIN project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1`;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

export { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId };
