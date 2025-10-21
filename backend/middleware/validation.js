const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
  body('city').notEmpty().withMessage('City is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required')
    .isLength({ min: 10 }).withMessage('Contact number must be at least 10 digits')
    .matches(/^[0-9+\-\s]+$/).withMessage('Invalid contact number format'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const loginValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate,
};