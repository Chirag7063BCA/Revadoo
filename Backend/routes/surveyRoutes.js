const express = require('express');
const router = express.Router();
// Controller se functions nikalna
const { addSurvey, getSurveys, deleteSurvey, submitSurvey } = require('../Controllers/surveyController');

// Routes define karna
router.get('/all', getSurveys);
router.post('/add', addSurvey);
router.delete('/delete/:id', deleteSurvey);
router.post('/submit/:id', submitSurvey); // 👈 Check karein ye line line 5 ke aas-pass hogi

module.exports = router;