var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('home')
})

/* GET all_books page */

router.get('/all_books', (req, res, next) => {
	res.render('all_books')
})

module.exports = router
