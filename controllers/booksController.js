const Sequelize = require('sequelize')
const Books = require('../models').books

exports.getBooks = () => {
	Books.findAll({
		attributes: ['title', 'author', 'genre', 'first_published'],
	}).then(books => {
		return books
	})
}
