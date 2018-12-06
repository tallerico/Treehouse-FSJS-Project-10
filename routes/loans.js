const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

router.get('/overdue_loans', (req, res, next) => {
	const mainDate = new Date()
	loans
		.findAll({
			include: [
				{
					model: patrons,
				},
				{
					model: books,
				},
			],
			where: {
				return_by: {
					[Op.lt]: mainDate,
				},
				returned_on: null,
			},
		})
		.then(loans => {
			res.render('overdue_loans', { loans })
		})
		.catch(error => {
			res.send(500, error)
		})
})

router.get('/checked_loans', (req, res, next) => {
	const mainDate = new Date()
	loans
		.findAll({
			include: [
				{
					model: patrons,
				},
				{
					model: books,
				},
			],
			where: {
				returned_on: null,
			},
		})
		.then(loans => {
			res.render('checked_loans', { loans })
		})
		.catch(error => {
			res.send(500, error)
		})
})

module.exports = router
