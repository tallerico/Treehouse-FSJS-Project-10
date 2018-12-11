'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const loans = sequelize.define(
		'loans',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
			book_id: DataTypes.INTEGER,
			patron_id: DataTypes.INTEGER,
			loaned_on: {
				type: Sequelize.DATEONLY,
				validate: {
					notEmpty: {
						msg: 'Date Required',
					},
				},
			},
			return_by: {
				type: Sequelize.DATEONLY,
				validate: {
					notEmpty: {
						msg: 'Date Required',
					},
				},
			},
			returned_on: {
				type: Sequelize.DATEONLY,
				validate: {
					notEmpty: {
						msg: 'Date Required',
					},
					isDate: {
						msg: 'Must be a Date. ex. 2015-12-8',
					},
				},
			},
		},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		},
		// {
		// 	instanceMethods: {
		// 		getLoanedTo: function() {
		// 			return patrons.find({
		// 				where: { patron_id: this.patron_id },
		// 			})
		// 		},
		// 	},
		// },
	)
	loans.associate = function(models) {
		loans.belongsTo(models.books, { foreignKey: 'book_id' })
		loans.belongsTo(models.patrons, { foreignKey: 'patron_id' })
	}
	return loans
}
