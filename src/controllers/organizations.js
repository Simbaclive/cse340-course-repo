import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
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

export { showOrganizationsPage, showOrganizationDetailsPage };