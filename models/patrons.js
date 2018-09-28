'use strict'
module.exports = (sequelize, DataTypes) => {
	const patrons = sequelize.define(
		'patrons',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true },
			first_name: DataTypes.STRING,
			last_name: DataTypes.STRING,
			address: DataTypes.STRING,
			email: DataTypes.STRING,
			library_id: DataTypes.STRING,
			zip_code: DataTypes.INTEGER,
		},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		},
	)
	patrons.associate = function(models) {
		patrons.belongsTo(models.loans)
	}
	return patrons
}
