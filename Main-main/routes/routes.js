const express = require('express');
const router = express.Router();

const siteController = require('../controllers/siteController');
const dataBaseController = require('../controllers/dataBaseController');
const dataController = require('../controllers/dataController');

// Site requests.
router.get('/', siteController.index);
router.get('/history', siteController.history);
router.get('/about', siteController.about);
router.get('/analytics',siteController.analytics);

//data base requests
router.get('/userFeedBackScore', dataBaseController.userFeedBackScore); // returns all data from userFeedBackScore
router.get('/userFeedBackScoreGlobal', dataBaseController.userFeedBackScoreGlobal); //returns Global value of userFeedBackScore
router.get('/userFeedBackScoreIncrease', dataBaseController.userFeedBackScoreIncrease); //increases the Global value 
router.get('/userFeedBackScoreDecrease', dataBaseController.userFeedBackScoreDecrease); //decreases the Global value 

router.get('/userPositive', dataBaseController.userPositive); //decreases the Global value 
router.get('/userNegative', dataBaseController.userNegative); //decreases the Global value 

// API requests.
router.post('/api/query', dataController.processQuery);

module.exports = router;
