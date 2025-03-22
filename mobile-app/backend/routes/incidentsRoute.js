const express = require('express');
const router = express.Router();
const incidentsController = require('../controllers/incidentsController');

router.post('/add', incidentsController.addIncident);
router.post('/daily', incidentsController.getDailyIncidents);
router.post('/weekly', incidentsController.getWeeklyIncidents);
router.post('/weeklyp', incidentsController.getPreviousWeeklyIncidents);
router.post('/count', incidentsController.getIncidentsCount);
router.post('/threehourly', incidentsController.getThreeHourlyIncidents);

module.exports = router;