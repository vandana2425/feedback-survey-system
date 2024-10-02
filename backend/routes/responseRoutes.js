const express = require('express');
const Response = require('../models/Response'); // Response model
const mongoose = require('mongoose'); // To validate ObjectId
const { protect } = require('../middleware/authMiddleware'); // Assuming authentication middleware is used

const router = express.Router();

// Submit a form response (Create) - No authentication required for this route
router.post('/submit', async (req, res) => {
  const { formId, responses } = req.body;
  const userId = req.user ? req.user._id : null; // Check for userId only if logged in (optional)

  // Validate formId
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(400).json({ message: 'Invalid formId' });
  }

  try {
    // Ensure the responses array is valid
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: 'Responses must be a non-empty array.' });
    }

    // Validate that every response has an answer and questionType
    const invalidResponses = responses.filter(r => !r.answer || !r.questionType);
    if (invalidResponses.length > 0) {
      return res.status(400).json({ message: 'All responses must include an answer and questionType.' });
    }

    // Create and save the response
    const newResponse = new Response({
      formId,
      userId,  // Optional: Will be null if the user is not logged in
      response: responses,
    });

    await newResponse.save();
    res.status(201).json({ message: 'Response submitted successfully', response: newResponse });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
});

// Get paginated form responses (Read)
router.get('/form/:formId', async (req, res) => {
  const { formId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate formId
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(400).json({ message: 'Invalid formId' });
  }

  try {
    // Pagination options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: 'formId', 
    };

    // Fetch responses for the form
    const responses = await Response.paginate({ formId }, options);
    res.json(responses);
  } catch (error) {
    console.error('Error retrieving responses:', error);
    res.status(500).json({ message: 'Error retrieving responses', error: error.message });
  }
});

// Update a response (Update) - Requires authentication
router.put('/update/:responseId', protect, async (req, res) => {
  const { responseId } = req.params;
  const { responses } = req.body;

  // Validate responseId
  if (!mongoose.Types.ObjectId.isValid(responseId)) {
    return res.status(400).json({ message: 'Invalid responseId' });
  }

  try {
    const response = await Response.findById(responseId);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Validate the responses array
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: 'Responses must be a non-empty array.' });
    }

    // Update response
    response.response = responses;
    await response.save();

    res.json({ message: 'Response updated successfully', response });
  } catch (error) {
    console.error('Error updating response:', error.message);
    res.status(500).json({ message: 'Error updating response', error: error.message });
  }
});

// Delete a response (Delete) - Requires authentication
router.delete('/delete/:responseId', protect, async (req, res) => {
  const { responseId } = req.params;

  // Validate responseId
  if (!mongoose.Types.ObjectId.isValid(responseId)) {
    return res.status(400).json({ message: 'Invalid responseId' });
  }

  try {
    const response = await Response.findById(responseId);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Delete the response
    await Response.findByIdAndDelete(responseId);
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ message: 'Error deleting response', error: error.message });
  }
});

module.exports = router;
