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
			res.send(500, error)
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
			res.redirect('/all_books')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				res.render('new_book', { errors: error.errors })
			} else {
				throw error
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
			res.redirect('/all_books')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				res.render('new_book', { errors: error.errors })
			} else {
				throw error
			}
		})
})

router.get('/return_book', (req, res, next) => {
	res.render('return_book')
})

module.exports = router
