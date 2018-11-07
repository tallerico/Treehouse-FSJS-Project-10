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
		{
			instanceMethods: {
				getLoanedTo: function() {
					return patrons.find({
						where: { patron_id: this.patron_id },
					})
				},
			},
		},
	)
	loans.associate = function(models) {
		loans.belongsTo(models.books, { foreignKey: 'book_id' })
		loans.belongsTo(models.patrons, { foreignKey: 'patron_id' })
	}
	return loans
}
