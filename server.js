import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './models/db.js';
import { getAllOrganizations } from './models/organizations.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const handleHome = async (req, res) => {
    res.render('home', { title: 'Home' });
};

const handleOrganizations = async (req, res) => {
    res.render('organizations', { title: 'Organizations' });
};

const handleProjects = async (req, res) => {
    res.render('projects', { title: 'Service Projects' });
};

const handleCategories = async (req, res) => {
    res.render('categories', { title: 'Service Project Categories' });
};

app.get('/', handleHome);
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error("Error loading organizations view:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/projects', handleProjects);
app.get('/categories', handleCategories);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});