const express = require('express');
const router = express.Router();
const logService = require("../service/app-config-service");
router.get('/getall',appConfigService.getAll);

module.exports = router