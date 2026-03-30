const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { contactRules, validate } = require('../middleware/validateContact');
const { submitContact } = require('../controllers/contactController');

// Rate limit: max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Try again later.' },
});

router.post('/', contactLimiter, contactRules, validate, submitContact);

module.exports = router;