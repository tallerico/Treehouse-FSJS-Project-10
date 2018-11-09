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
					console.log(patrons)
					res.render('patron_detail', { patrons, loans })
				})
		})
})

module.exports = router
