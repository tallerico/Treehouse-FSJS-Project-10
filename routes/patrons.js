const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

router.get('/patron_detail/:id', (req, res, next) => {
	const mainDate = new Date()
	patrons
		.findAll({
			where: {
				id: req.params.id,
			},
		})
		.then(patrons => {
			loans
				.findAll({
					where: {
						patron_id: req.params.id,
					},
					include: [{ model: books }],
				})
				.then(loans => {
					res.render('patron_detail', { patrons, loans })
				})
		})
		.catch(error => {
			res.send(500, error)
		})
})

router.get('/new_patron', (req, res, next) => {
	res.render('new_patron')
})

router.post('/create_patron', (req, res, next) => {
	patrons
		.create({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			address: req.body.address,
			email: req.body.email,
			library_id: req.body.library_id,
			zip_code: req.body.zip,
		})
		.then(response => {
			res.redirect('/all_patrons')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				res.render('new_patron', { errors: error.errors })
			}
		})
})

module.exports = router
