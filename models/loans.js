'use strict'
module.exports = (sequelize, DataTypes) => {
	const loans = sequelize.define(
		'loans',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true },
			book_id: DataTypes.INTEGER,
			patron_id: DataTypes.INTEGER,
			loaned_on: DataTypes.DATE,
			return_by: DataTypes.DATE,
			returned_on: DataTypes.DATE,
		},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		},
	)
	loans.associate = function(models) {
		loans.hasOne(models.books)
		loans.hasOne(models.patrons)
	}
	return loans
}
