var express = require('express');
var router = express.Router();

router.get('/dashboard', (req, res, next) => {
  res.render('laundry/dashboard');
});

router.post('/dashboard', (req, res, next) => {
  console.log(req.session);
});

module.exports = router;