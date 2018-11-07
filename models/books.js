'use strict'

const loans = require('./loans')

module.exports = (sequelize, DataTypes) => {
	const books = sequelize.define(
		'books',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true },
			title: DataTypes.STRING,
			author: DataTypes.STRING,
			genre: DataTypes.STRING,
			first_published: DataTypes.INTEGER,
		},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		},
	)
	books.associate = function(models) {
		books.hasMany(models.loans, { foreignKey: 'book_id' })
	}
	return books
}
