const mongoose = require('mongoose');
const Response = require('./Response'); // Import the Response model

// Define the form schema
const formSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  fields: [
    {
      type: { 
        type: String, 
        required: true, 
        enum: ['text', 'checkbox', 'radio', 'file', 'image', 'textarea', 'multiple choice'] 
      },
      label: { 
        type: String, 
        required: true 
      },
      options: {
        type: [
          {
            label: { type: String, required: true }, // Label for the option
            value: { type: String, required: true }  // Value that this option represents
          }
        ],
        required: function() {
          return ['checkbox', 'radio', 'multiple choice'].includes(this.type);
        }
      },
      filePath: { 
        type: String // If the field contains a file, store the file path here
      },
      mandatory: { 
        type: Boolean, 
        default: false 
      }
    }
  ]
}, 
{ timestamps: true });

// Middleware to delete associated responses when a form is deleted
formSchema.pre('remove', async function (next) {
  try {
    // When a form is deleted, delete all associated responses with that formId
    await Response.deleteMany({ formId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Form = mongoose.model('Form', formSchema);
module.exports = Form;
