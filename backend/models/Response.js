const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Define the response schema
const ResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true, // The response must be linked to a specific form
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Can be null if no user is logged in (for anonymous submissions)
  },
  response: [{
    questionLabel: { 
      type: String, 
      required: true, // Store the question's label (text)
    },
    questionType: { 
      type: String, 
      required: true,
      enum: ['text', 'checkbox', 'radio', 'file', 'image', 'textarea', 'multiple choice'], // Types of responses allowed
    },
    options: { 
      type: [String], 
      required: function() {
        return ['checkbox', 'radio', 'multiple choice'].includes(this.questionType); // Options required for specific types
      },
      default: undefined, // Options are only needed for the specified types
    },
    answer: {
      type: mongoose.Schema.Types.Mixed, // Can be text, file paths, etc.
      required: true, // Ensure that an answer is provided
    },
  }]
}, { timestamps: true });

// Add pagination plugin
ResponseSchema.plugin(mongoosePaginate);

// Middleware to cascade delete responses when the form is removed
ResponseSchema.pre('remove', async function (next) {
  try {
    // When a form is deleted, delete all responses tied to the formId
    await mongoose.model('Response').deleteMany({ formId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Create the response model
const Response = mongoose.model('Response', ResponseSchema, 'Response');
module.exports = Response;
