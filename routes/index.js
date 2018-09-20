const express = require('express')
const router = express.Router()

const { books } = require('../models')
const { patrons } = require('../models')

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

router.get('/book_detail/:id', (req, res, next) => {
	books
		.findAll({
			attributes: ['id', 'title', 'author', 'genre', 'first_published'],
			where: {
				id: req.params.id,
			},
		})
		.then(book => {
			console.log(book)
			res.render('book_detail', { book })
		})
})

router.get('/patrons', (req, res, next) => {
	patrons
		.findAll({
			attributes: ['id', 'first_name', 'last_name', 'address', 'email', 'library_id', 'zip_code'],
		})
		.then(patrons => {})
})
module.exports = router
