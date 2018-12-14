const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

//this function sets offset count for queries to be used with pagination
const offsetCount = count => {
	let offsetNum = 0
	if (count === 1) {
		return offsetNum
	} else {
		offsetNum = (count - 1) * 5
		return offsetNum
	}
}

/* GET all_books page */

router.get('/all_books/:count', (req, res, next) => {
	const offNum = offsetCount(req.params.count)

	books
		.findAll({ offset: offNum, limit: 5 })
		.then(bookLimit => {
			books.findAll().then(allBooks => {
				const bookCount = allBooks.length
				const paginationCount = Math.ceil(bookCount / 5)
				res.render('all_books', { bookLimit, paginationCount, bookCount })
			})
		})
		.catch(error => {
			res.send(500, error)
		})
})

router.post('/search/books', (req, res, next) => {
	books
		.findAll({
			where: {
				[Op.or]: {
					title: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					genre: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					author: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
				},
			},
		})
		.then(bookLimit => {
			res.render('all_books', { bookLimit })
		})
		.catch(error => {
			res.render('error', { error })
		})
})

// GET book_detail/:id

router.get('/book_detail/:id', (req, res, next) => {
	books
		.findAll({
			where: {
				id: req.params.id,
			},
		})
		.then(book => {
			loans
				.findAll({
					where: {
						book_id: req.params.id,
					},
					include: [
						{
							model: patrons,
						},
					],
				})
				.then(loans => {
					res.render('book_detail', { book, loans })
				})
				.catch(error => {
					res.send(500, error)
				})
		})
})

router.get('/overdue_books', (req, res, next) => {
	const mainDate = new Date()
	const date = JSON.stringify(mainDate)
	const currDate = date.split('T')[0]
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
		.catch(error => {
			res.render('error', { error })
		})
})

router.get('/checked_books', (req, res, next) => {
	const mainDate = new Date()
	const date = JSON.stringify(mainDate)
	const currDate = date.split('T')[0]
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
			res.render('checked_books', { books })
		})
		.catch(error => {
			res.send(500, error)
		})
})

router.get('/new_book', (req, res, next) => {
	res.render('new_book')
})

router.post('/create_book', (req, res, next) => {
	books
		.create({
			title: req.body.title,
			author: req.body.author,
			genre: req.body.genre,
			first_published: req.body.published,
		})
		.then(response => {
			res.redirect('/all_books/1')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				res.render('new_book', { errors: error.errors })
			} else {
				console.log(error)
			}
		})
})

router.post('/update_book/:id', (req, res, next) => {
	books
		.update(
			{
				title: req.body.title,
				author: req.body.author,
				genre: req.body.genre,
				first_published: req.body.published,
			},
			{ where: { id: req.params.id } },
		)
		.then(response => {
			res.redirect('/all_books/1')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				books.findAll({ where: { id: req.params.id } }).then(book => {
					loans
						.findAll({
							where: {
								book_id: req.params.id,
							},
							include: [
								{
									model: patrons,
								},
							],
						})
						.then(loans => {
							res.render('book_detail', { book, loans, errors: error.errors })
						})
				})
			} else {
				throw error
			}
		})
})

router.get('/return_book/:id', (req, res, next) => {
	const todaysDate = moment().format('YYYY-MM-DD')

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
				id: req.params.id,
			},
		})
		.then(loan => {
			res.render('return_book', { loan, todaysDate })
		})
})

router.post(`/return/:id`, (req, res, next) => {
	loans
		.update(
			{
				returned_on: req.body.returnDate,
			},
			{ where: { id: req.params.id } },
		)
		.then(response => {
			res.redirect('/all_loans')
		})
		.catch(error => {
			const todaysDate = moment().format('YYYY-MM-DD')
			if (error.name === 'SequelizeValidationError') {
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
							id: req.params.id,
						},
					})
					.then(loan => {
						res.render('return_book', { loan, todaysDate, errors: error.errors })
					})
			} else {
				throw error
			}
		})
})

module.exports = router
