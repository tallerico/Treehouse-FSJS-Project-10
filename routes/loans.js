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

router.get('/new_loan', (req, res, next) => {
	function addDays(dateObj, numDays) {
		dateObj.setDate(dateObj.getDate() + numDays)
		return dateObj
	}
	const todaysDate = new Date()
	const returnBy = addDays(new Date(), 7)

	books.findAll().then(books => {
		patrons.findAll().then(patrons => {
			res.render('new_loan', { books, patrons, todaysDate, returnBy })
		})
	})
})

router.post('/create_loan', (req, res, next) => {
	loans
		.create({
			book_id: req.body.book,
			patron_id: req.body.patron,
			loaned_on: req.body.loanedOn,
			return_by: req.body.returnBy,
		})
		.then(response => {
			res.redirect('/all_loans')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				res.render('new_book', { errors: error.errors })
			} else {
				throw error
			}
		})
})

module.exports = router
