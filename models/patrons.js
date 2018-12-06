'use strict'
module.exports = (sequelize, DataTypes) => {
	const patrons = sequelize.define(
		'patrons',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true },
			first_name: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			last_name: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			address: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			email: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
					isEmail: true,
				},
			},
			library_id: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			zip_code: {
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
					isNumeric: true,
				},
			},
		},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		},
	)
	patrons.associate = function(models) {
		patrons.hasMany(models.loans, { foreignKey: 'patron_id' })
	}
	return patrons
}
