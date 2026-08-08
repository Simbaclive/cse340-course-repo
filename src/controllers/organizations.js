import { validationResult } from 'express-validator';
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Organizations', organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
        return res.status(404).send('Organization not found');
    }

    const projects = await getProjectsByOrganizationId(organizationId);

    res.render('organization', {
        title: organizationDetails.name,
        organizationDetails,
        projects
    });
};

const renderNewOrganizationForm = (req, res) => {
    res.render('new-organization', { title: 'Add New Organization', errors: [], formData: {} });
};

const processNewOrganization = async (req, res) => {
    const errors = validationResult(req);
    const { name, description, contact_email, logo_filename } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).render('new-organization', {
            title: 'Add New Organization',
            errors: errors.array(),
            formData: req.body || {}
        });
    }

    try {
        await createOrganization(name, description, contact_email, logo_filename);
        req.flash('success', 'Organization created successfully!');
        res.redirect('/organizations');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while creating the organization.');
        res.status(500).send('Server Error');
    }
};

const renderEditOrganizationForm = async (req, res) => {
    try {
        const organization = await getOrganizationDetails(req.params.id);
        if (!organization) {
            return res.status(404).send('Organization not found');
        }
        res.render('edit-organization', { title: 'Edit Organization', organization, errors: [] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const processEditOrganization = async (req, res) => {
    const errors = validationResult(req);
    const { name, description, contact_email, logo_filename } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).render('edit-organization', {
            title: 'Edit Organization',
            organization: {
                organization_id: req.params.id,
                name,
                description,
                contact_email,
                logo_filename
            },
            errors: errors.array()
        });
    }

    try {
        await updateOrganization(req.params.id, name, description, contact_email, logo_filename);
        req.flash('success', 'Organization updated successfully!');
        res.redirect('/organizations');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while updating the organization.');
        res.status(500).send('Server Error');
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    renderNewOrganizationForm,
    processNewOrganization,
    renderEditOrganizationForm,
    processEditOrganization
};