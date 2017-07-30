// routes/laundry.js
const express = require('express');

const User = require('../models/user');
const LaundryPickup = require('../models/laundry-pickup');


const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else{
  res.redirect('/login');
  }
});



router.get('/dashboard', (req, res, next) => {
  let query;

  if (req.session.currentUser.isLaunderer) {
    query = { launderer: req.session.currentUser._id };
  } else {
    query = { user: req.session.currentUser._id };
  }

  LaundryPickup
    .find(query)
    .populate('user', 'name')
    .populate('launderer', 'name')
    .sort('pickupDate')
    .exec((err, pickupDocs) => {
      if (err) {
        next(err);
        return;
      }

      res.render('laundry/dashboard', {
        pickups: pickupDocs
      });
    });
});











router.post('/launderers', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  };

  User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) {
     return next(err);
    }

    req.session.currentUser = theUser;

    res.redirect('/dashboard');
  });
});


router.get('/launderers', (req, res, next) => {
  User.find({ isLaunderer: true }, (err, launderersList) => {
    if (err) {
     return next(err);
    }

    res.render('laundry/launderers', {launderers: launderersList});
    // console.log(launderersList);
  });
});



//Get a pickup
router.get('/launderers/:ID', (req, res, next) => {
  const laundererId = req.params.ID;

  User.findById(laundererId, (err, theUser) => {
    if (err) {
      return next(err);
    }

    res.render('laundry/launderer-profile', {
      theLaunderer: theUser
    });
  });
});



router.post('/laundry-pickups', (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.currentUser._id
  };

  const thePickup = new LaundryPickup(pickupInfo);


  console.log(thePickup);
  thePickup.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/dashboard');
  });
});



module.exports = router;