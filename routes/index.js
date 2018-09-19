const express = require('express')
const router = express.Router()

const { books } = require('../models')

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
			where: {
				id: req.params.id,
			},
		})
		.then(book => {
			res.render('book_detail', { book })
		})
})
module.exports = router
