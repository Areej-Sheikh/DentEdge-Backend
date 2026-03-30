  const { body, validationResult } = require('express-validator');

  const contactRules = [
    body('name')
      .trim().notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name max 100 chars'),

    body('email')
      .trim().notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address')
      .isLength({ max: 255 }).withMessage('Email max 255 chars'),

    body('phone')
      .optional({ checkFalsy: true })
      .matches(/^[\d\s\-+()]{7,20}$/).withMessage('Invalid phone number'),

    body('subject')
      .trim().notEmpty().withMessage('Subject is required')
      .isLength({ max: 200 }).withMessage('Subject max 200 chars'),

    body('message')
      .trim().notEmpty().withMessage('Message is required')
      .isLength({ max: 2000 }).withMessage('Message max 2000 chars'),
  ];

  const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  };

  module.exports = { contactRules, validate };