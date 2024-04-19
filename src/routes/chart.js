const express = require("express");
const router = express.Router()
const ChartController = require('../controllers/ChartController')

router.get('/', ChartController.Index)
//router.post('/store', ChartController.Store)

module.exports = router