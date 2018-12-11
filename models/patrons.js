'use strict'
module.exports = (sequelize, DataTypes) => {
	const patrons = sequelize.define(
		'patrons',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true },
			first_name: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: 'Please Enter a First Name' },
				},
			},
			last_name: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: 'Please Enter a Last Name' },
				},
			},
			address: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: 'Please Enter an Address' },
				},
			},
			email: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: 'Please Enter a Valid Email' },
					isEmail: true,
				},
			},
			library_id: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: 'Please Enter a Unique Library ID' },
				},
			},
			zip_code: {
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: { msg: 'Please Entere a Zip Code' },
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
