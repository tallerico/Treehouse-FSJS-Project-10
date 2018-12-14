const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { books } = require('../models')
const { patrons } = require('../models')
const { loans } = require('../models')

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

router.get('/all_patrons/:count', (req, res, next) => {
	const offNum = offsetCount(req.params.count)

	patrons
		.findAll({ offset: offNum, limit: 5 })
		.then(patronLimit => {
			patrons.findAll().then(allPatrons => {
				const patronCount = allPatrons.length
				const paginationCount = Math.ceil(patronCount / 5)
				res.render('all_patrons', { patronLimit, paginationCount, patronCount })
			})
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
			res.redirect('/all_patrons/1')
		})
		.catch(error => {
			if (error.name === 'SequelizeValidationError') {
				res.render('new_patron', { errors: error.errors })
			} else {
				console.log(error)
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
			res.redirect('/all_patrons/1')
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

router.post('/search/patrons', (req, res, next) => {
	patrons
		.findAll({
			where: {
				[Op.or]: {
					first_name: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					last_name: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					address: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					email: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					library_id: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
					zip_code: {
						[Op.like]: `%${req.body.searchValue}%`,
					},
				},
			},
		})
		.then(patronLimit => {
			res.render('all_patrons', { patronLimit })
		})
		.catch(error => {
			res.render('error', { error })
		})
})

module.exports = router
