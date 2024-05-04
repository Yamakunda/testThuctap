const express = require("express");
const router = express.Router()
const StudentController = require('../controllers/StudentController')

router.get('/studentID/:id', StudentController.Index)
router.get('/name/:name', StudentController.Getname)
router.get('/', StudentController.Getall)
router.post('/', StudentController.Post)
module.exports = router