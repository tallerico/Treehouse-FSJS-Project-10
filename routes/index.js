const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('home')
})

module.exports = router
