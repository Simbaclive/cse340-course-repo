import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.get('/organizations', handleOrganizations);
app.get('/projects', handleProjects);
app.get('/categories', handleCategories);

app.listen(port, () => {
    console.log(`Application listening on http://localhost:${port}`);
});