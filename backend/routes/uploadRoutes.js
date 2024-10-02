// Multer configuration for file storage
const multer = require('multer');
const express = require('express');
const router = express.Router();
const Response = require('../models/Response'); // Import your Response model

const storage = multer.diskStorage({
  destination: './uploads/', // Set upload folder
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Save file with timestamp
  }
});

const upload = multer({
  storage: storage
}).single('myFile'); // The input name used in your form

// File upload route
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Save the file path in the response schema (or wherever necessary)
    const response = new Response({
      formId: req.body.formId,
      userId: req.body.userId, // Optional
      response: [
        {
          questionLabel: req.body.questionLabel,
          questionType: 'file',
          answer: filePath // Store the uploaded file path as the answer
        }
      ]
    });

    // Save response to the database
    response.save()
      .then(() => res.status(200).json({ filePath }))
      .catch((error) => res.status(500).json({ message: 'Error saving response', error }));
  });
});

module.exports = router;
