const express = require('express');
const docsController = require('../controllers/docsController');

const router = express.Router();

router.get('/', docsController.getOverviewPage);
router.get('/playground', docsController.protect, docsController.getPlaygroundPage);

router.get('/:id', docsController.getRoutesPage);

module.exports = router;