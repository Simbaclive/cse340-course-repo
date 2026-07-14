const showHomePage = async (req, res) => {
    const title = 'Home';

    res.render('index', { title });
};

export { showHomePage };