const path = require('path');

const siteController = {};

siteController.index = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
};

siteController.history = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'history.html'));
};

siteController.about = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'about.html'));
};

siteController.analytics = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'analytics.html'));
};


module.exports = siteController;