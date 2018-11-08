const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

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
			console.log(books)
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

module.exports = router
