const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

router.get('/all_loans', (req, res, next) => {
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
		})
		.then(loans => {
			res.render('all_loans', { loans })
		})
		.catch(error => {
			res.send(500, error)
		})
})

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

router.get('/new_loan', (req, res, next) => {
	const todaysDate = moment().format('YYYY-MM-DD')
	const returnBy = moment()
		.add(7, 'days')
		.format('YYYY-MM-DD')

	books.findAll().then(books => {
		patrons.findAll().then(patrons => {
			res.render('new_loan', { books, patrons, todaysDate, returnBy })
		})
	})
})

router.post('/create_loan', (req, res, next) => {
	loans
		.create({
			book_id: req.body.book_id,
			patron_id: req.body.patron_id,
			loaned_on: req.body.loanedOn,
			return_by: req.body.returnBy,
		})
		.then(response => {
			res.redirect('/all_loans')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				const todaysDate = moment().format('YYYY-MM-DD')
				const returnBy = moment()
					.add(7, 'days')
					.format('YYYY-MM-DD')

				books.findAll().then(books => {
					patrons.findAll().then(patrons => {
						res.render('new_loan', { errors: error.errors, books, patrons, todaysDate, returnBy })
					})
				})
			} else {
				throw error
				console.log(error)
			}
		})
})

module.exports = router
