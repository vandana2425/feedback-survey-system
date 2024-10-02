const express = require('express');
const Form = require('../models/Form');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const Response = require('../models/Response');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const fileTypes = /jpeg|jpg|png|pdf|docx|pptx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and document files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
  fileFilter,
});

// Helper function to safely parse fields
const safelyParseFields = (fields) => {
  try {
    return JSON.parse(fields);
  } catch (err) {
    throw new Error('Invalid JSON format for fields');
  }
};

// Create a new form (with file upload handling)
router.post('/create', protect, upload.any(), async (req, res) => {
  const { title, description, fields } = req.body;
  const userId = req.user._id;

  try {
    const parsedFields = safelyParseFields(fields);

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fieldIndex = file.fieldname.split('-')[1];
        parsedFields[fieldIndex].filePath = file.path; // Assuming fieldname contains index
      });
    }

    const form = new Form({
      userId,
      title,
      description,
      fields: parsedFields,
    });

    await form.save();
    res.status(201).json({ message: 'Form created successfully', form });
  } catch (error) {
    console.error('Error creating form:', error.message);
    res.status(500).json({ message: 'Error creating form', error: error.message });
  }
});

// Get all forms for a specific user
router.get('/user', protect, async (req, res) => {
  const userId = req.user._id;

  try {
    const forms = await Form.find({ userId });
    if (!forms.length) {
      return res.status(404).json({ message: 'No forms found' });
    }
    res.json(forms);
  } catch (error) {
    console.error('Error retrieving forms:', error);
    res.status(500).json({ message: 'Error retrieving forms', error });
  }
});

// Get a specific form by ID (PUBLIC ACCESS)
router.get('/:formId', async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error retrieving form:', error);
    res.status(500).json({ message: 'Error retrieving form', error });
  }
});

// Update an existing form by ID
router.put('/:formId', protect, upload.any(), async (req, res) => {
  const { formId } = req.params;
  const userId = req.user._id;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this form' });
    }

    const { title, description, fields } = req.body;
    
    const updatedFields = safelyParseFields(fields);

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fieldIndex = file.fieldname.split('-')[1];
        if (updatedFields[fieldIndex]) {
          updatedFields[fieldIndex].filePath = file.path;
        }
      });
    }

    form.title = title || form.title;
    form.description = description || form.description;
    form.fields = updatedFields || form.fields;

    await form.save();
    res.json({ message: 'Form updated successfully', form });
  } catch (error) {
    console.error('Error updating form:', error.message);
    res.status(500).json({ message: 'Error updating form', error: error.message });
  }
});

// Delete a form by ID (with cascade delete of responses)
router.delete('/:formId', protect, async (req, res) => {
  const { formId } = req.params;
  const userId = req.user._id;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this form' });
    }

    await Response.deleteMany({ formId });

    await Form.findByIdAndDelete(formId);
    res.json({ message: 'Form and associated responses deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Error deleting form', error: error.message });
  }
});

module.exports = router;
