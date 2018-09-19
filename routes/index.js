const express = require('express')
const router = express.Router()

const books_controller = require('../controllers/booksController')

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('home')
})

/* GET all_books page */

router.get('/all_books', (req, res, next) => {
	const books = books_controller.getBooks
	res.render('all_books', { books })
})

module.exports = router
