import { validationResult } from 'express-validator';
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { addVolunteer, removeVolunteer, isVolunteering } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', { title: 'Upcoming Service Projects', projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
        return res.status(404).send('Project not found');
    }

    const categories = await getCategoriesByProjectId(projectId);

    let volunteering = false;
    if (req.session && req.session.loggedin) {
        volunteering = await isVolunteering(req.session.accountData.user_id, projectId);
    }

    res.render('project', {
        title: project.title,
        project,
        categories,
        volunteering
    });
};

const renderNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', {
        title: 'Add New Project',
        errors: [],
        formData: {},
        organizations
    });
};

const processNewProject = async (req, res) => {
    const errors = validationResult(req);
    const { organization_id, title, description, location, date } = req.body;

    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        return res.status(400).render('new-project', {
            title: 'Add New Project',
            errors: errors.array(),
            formData: req.body || {},
            organizations
        });
    }

    try {
        await createProject(organization_id, title, description, location, date);
        req.flash('success', 'Project created successfully!');
        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while creating the project.');
        res.status(500).send('Server Error');
    }
};

const renderEditProjectForm = async (req, res) => {
    try {
        const project = await getProjectDetails(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        const organizations = await getAllOrganizations();
        res.render('edit-project', {
            title: 'Edit Project',
            project,
            organizations,
            errors: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const processEditProject = async (req, res) => {
    const errors = validationResult(req);
    const { organization_id, title, description, location, date } = req.body;

    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        return res.status(400).render('edit-project', {
            title: 'Edit Project',
            project: {
                project_id: req.params.id,
                organization_id,
                title,
                description,
                location,
                date
            },
            organizations,
            errors: errors.array()
        });
    }

    try {
        await updateProject(req.params.id, organization_id, title, description, location, date);
        req.flash('success', 'Project updated successfully!');
        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while updating the project.');
        res.status(500).send('Server Error');
    }
};

const processVolunteerSignup = async (req, res) => {
    const projectId = req.params.id;
    try {
        await addVolunteer(req.session.accountData.user_id, projectId);
        req.flash('success', 'You have signed up to volunteer for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while signing up to volunteer.');
        res.redirect(`/project/${projectId}`);
    }
};

const processVolunteerRemoval = async (req, res) => {
    const projectId = req.params.id;
    try {
        await removeVolunteer(req.session.accountData.user_id, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while removing your volunteer signup.');
        res.redirect(`/project/${projectId}`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    renderNewProjectForm,
    processNewProject,
    renderEditProjectForm,
    processEditProject,
    processVolunteerSignup,
    processVolunteerRemoval
};