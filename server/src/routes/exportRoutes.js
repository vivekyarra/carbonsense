/**
 * @file Routes for export.
 */

const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const exportController = require('../controllers/exportController');

const router = express.Router();

router.use(authenticate);

router.get('/csv', exportController.exportCSV);

module.exports = router;
