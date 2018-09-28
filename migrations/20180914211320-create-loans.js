'use strict'
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('loans', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			id: {
				type: Sequelize.INTEGER,
			},
			book_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'books',
					key: 'id',
				},
			},
			patron_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'patrons',
					key: 'id',
				},
			},
			loaned_on: {
				type: Sequelize.DATE,
			},
			return_by: {
				type: Sequelize.DATE,
			},
			returned_on: {
				type: Sequelize.DATE,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('loans')
	},
}
