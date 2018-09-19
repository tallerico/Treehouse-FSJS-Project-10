const Sequelize = require('sequelize')
const { books } = require('../models')

exports.getBooks = () => {
	books
		.findAll({
			attributes: ['title', 'author', 'genre', 'first_published'],
		})
		.then(books => {
			return books
		})
}
