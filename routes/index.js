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

/* GET all_books page */

router.get('/all_books', (req, res, next) => {
	books
		.findAll({
			attributes: ['id', 'title', 'author', 'genre', 'first_published'],
		})
		.then(books => {
			res.render('all_books', { books })
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
		})
})

router.get('/all_patrons', (req, res, next) => {
	patrons
		.findAll({
			attributes: ['id', 'first_name', 'last_name', 'address', 'email', 'library_id', 'zip_code'],
		})
		.then(patrons => {
			res.render('all_patrons', { patrons })
		})
})

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
})

module.exports = router
