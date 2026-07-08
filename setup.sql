CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY(organization_id) 
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);


INSERT INTO public.project (organization_id, title, description, location, date) VALUES

(1, 'Community Center Refurbishment', 'Painting and structural repairs for downtown shelter.', '123 Main St, Metro City', '2026-08-12'),
(1, 'Park Bench Restoration', 'Building and sealing 10 community benches.', 'Oakwood Park', '2026-08-19'),
(1, 'Sidewalk Ramp Installation', 'Pouring concrete ADA compliant ramps.', 'West End District', '2026-09-02'),
(1, 'Youth Shelter Drywalling', 'Hanging and taping drywall for the new game room.', '456 Elm Ave', '2026-09-15'),
(1, 'Roof Patching Workshop', 'Teaching fundamental weatherproofing methods.', 'Community Hall', '2026-10-01'),


(2, 'Community Orchard Planting', 'Planting 30 apple and pear saplings.', 'North Side Commons', '2026-08-15'),
(2, 'Raised Bed Irrigation Setup', 'Installing micro-drip hoses across 12 crop plots.', 'Urban Farm Lot B', '2026-08-22'),
(2, 'Compost Bin Assembly Drive', 'Constructing three-tier wooden composting bays.', 'Eco Center Yard', '2026-09-05'),
(2, 'Pollinator Garden Weeding', 'Clearing invasive weeds to prepare native wildflower seeding.', 'South Ridge Park', '2026-09-19'),
(2, 'Harvest Preservation Class', 'Canning and packing seasonal garden tomatoes.', 'Extension Office Kitchen', '2026-10-10'),

(3, 'Senior Center Care Package Drive', 'Sorting and boxing essential health goods.', 'Civic Center Ballroom', '2026-08-10'),
(3, 'Back-to-School Backpack Packing', 'Stuffing notebooks and pens for 200 children.', 'Central Library Basement', '2026-08-25'),
(3, 'Hot Meals Serving Shift', 'Preparing soup and distributing lunches.', 'Hope Kitchen Headquarters', '2026-09-01'),
(3, 'Mobile Food Pantry Distribution', 'Loading food crates into vehicles for home deliveries.', 'East Parking Deck', '2026-09-22'),
(3, 'Inclusion Games Event Support', 'Guiding participants and timing athletic heats.', 'High School Stadium', '2026-10-05');
