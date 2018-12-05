const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

router.get('/overdue_books', (req, res, next) => {
	const mainDate = new Date()
	const date = JSON.stringify(mainDate)
	const currDate = date.split('T')[0]
	console.log(currDate)
	books
		.findAll({
			include: {
				model: loans,
				where: {
					return_by: {
						[Op.lt]: mainDate,
					},
					returned_on: null,
				},
			},
		})
		.then(books => {
			res.render('overdue_books', { books })
		})
})

router.get('/checked_books', (req, res, next) => {
	const mainDate = new Date()
	const date = JSON.stringify(mainDate)
	const currDate = date.split('T')[0]
	console.log(currDate)
	books
		.findAll({
			include: {
				model: loans,
				where: {
					returned_on: null,
				},
			},
		})
		.then(books => {
			console.log(books)
			res.render('checked_books', { books })
		})
})

router.get('/new_book', (req, res, next) => {
	res.render('new_book')
})

router.post('/create_book', (req, res) => {
	console.log(req), res.render('new_book', {})
})

module.exports = router
