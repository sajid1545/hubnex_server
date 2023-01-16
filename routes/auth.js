const router = require("express").Router();
const authControllers = require('../controllers/auth');
const bcrypt = require("bcrypt");
const { body } = require('express-validator');
const Users = require("../models/users");
const AdminLogin = require('../models/LoginAdmin')
const USER = require('../models/users')
// *********************************************************************************************//

// user Users

router.put("/signup", [
  body('email')
    .isEmail()
    .withMessage("Please enter a Valid email address.")
    .custom((value, { req }) => {
      return Users.findOne({ email: value, role: req.body.role })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists.");
          }
        });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password length must be greater than 5.")
], authControllers.signup);

router.put("/signupCompany", [
  body('email')
    .isEmail()
    .withMessage("Please enter a Valid email address.")
    .custom((value, { req }) => {
      return Users.findOne({ email: value, role: req.body.role })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists.");
          }
        });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password length must be greater than 5.")
], authControllers.signupCompany);

router.put("/signupAdminPanel", [
  body('email')
    .isEmail()
    .withMessage("Please enter a Valid email address.")
    .custom((value, { req }) => {
      return AdminLogin.findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists.");
          }
        });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password length must be greater than 5.")
], authControllers.signupAdminPanel);

router.get("/user/:id/verify/:token/", authControllers.getemailVerified);
router.post("/login", authControllers.login);
router.post("/adminlogin", authControllers.adminlogin);
router.post('/postResetPassword', authControllers.postResetPassword);
router.post('/otpVerification', authControllers.otpVerification);
router.post('/postNewPassword', authControllers.postNewPassword);
router.post('/adminPostResetPassword', authControllers.adminPostResetPassword);
router.post('/adminOtpVerification', authControllers.adminOtpVerification);
router.post('/adminPostNewPassword', authControllers.adminPostNewPassword);




router.put('/vote/:id', async (req, res) => {
  const { id } = req.params
  try {
    const data = await USER.findByIdAndUpdate(id, { vote: true })
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/vote/:id', async (req, res) => {
  const { id } = req.params
  try {
    const data = await USER.findById(id)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})





module.exports = router;
