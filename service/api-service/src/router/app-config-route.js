const express = require('express');
const router = express.Router();
const appConfigService = require("../service/app-config-service");

router.post('/add',appConfigService.addConfig);
router.post('/update',appConfigService.updateConfig);
router.get('/getall',appConfigService.getAll);
router.get('/getallbyname',appConfigService.getAllByName);

module.exports = router