const mongoose = require('mongoose');
// purpose - contact form submissions from website
const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: 100 },
    email:   { type: String, required: true, trim: true, maxlength: 255 },
    phone:   { type: String, trim: true, default: '' },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status:  { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);