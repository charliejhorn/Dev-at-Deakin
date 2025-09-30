// this file contains the controller functions that handle the business logic for the application, responding to requests from the routes. 

const getWorkshops = (req, res) => {
    // return placeholder list until implemented
    res.json({ items: [] });
};

const createWorkshop = (req, res) => {
    // return not implemented placeholder
    res.status(501).json({ error: 'not implemented' });
};

const updateWorkshop = (req, res) => {
    // return not implemented placeholder
    res.status(501).json({ error: 'not implemented' });
};

const deleteWorkshop = (req, res) => {
    // return not implemented placeholder
    res.status(501).json({ error: 'not implemented' });
};

module.exports = {
    getWorkshops,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
};