const express = require('express');
const router = express.Router();
const incidentsController = require('../controllers/incidentsController');

router.get('/daily', incidentsController.getDailyIncidents);
router.get('/weekly', incidentsController.getWeeklyIncidents);
router.get('/count', incidentsController.getIncidentsCount);
router.get('/threehourly', incidentsController.getThreeHourlyIncidents);

module.exports = router;