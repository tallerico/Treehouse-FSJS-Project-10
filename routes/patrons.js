const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

router.get('/all_patrons', (req, res, next) => {
	patrons
		.findAll({
			attributes: ['id', 'first_name', 'last_name', 'address', 'email', 'library_id', 'zip_code'],
		})
		.then(patrons => {
			res.render('all_patrons', { patrons })
		})
		.catch(error => {
			res.send(500, error)
		})
})

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
			} else {
				throw error
			}
		})
})

router.post(`/update_patron/:id`, (req, res, next) => {
	patrons
		.update(
			{
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				address: req.body.address,
				email: req.body.email,
				library_id: req.body.library_id,
				zip_code: req.body.zip_code,
			},
			{ where: { id: req.params.id } },
		)
		.then(response => {
			res.redirect('/all_patrons')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
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
								res.render('patron_detail', { patrons, loans, errors: error.errors })
							})
					})
					.catch(error => {
						res.send(500, error)
					})
			} else {
				throw error
			}
		})
})

module.exports = router
