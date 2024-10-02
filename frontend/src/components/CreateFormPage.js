import React, { useState } from 'react';
import {
  Container, TextField, Button, MenuItem, Select, Box,
  Card, CardContent, Grid, FormControl, InputLabel, IconButton, Checkbox, FormControlLabel, Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A simple preview component to display the form as the user builds it
const FormPreview = ({ formTitle, formDescription, questions }) => {
  return (
    <Box>
      <h2>{formTitle}</h2>
      <p>{formDescription}</p>
      {questions.map((question, index) => (
        <Card key={index} sx={{ marginBottom: 3 }}>
          <CardContent>
            <h4>{question.label} {question.mandatory ? '*' : ''}</h4>
            {question.type === 'text' && (
              <TextField fullWidth label={question.label} disabled />
            )}
            {(question.type === 'multiple choice' || question.type === 'checkbox' || question.type === 'radio') && (
              <Box>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <input type={question.type} value={option.value} name={`question_${index}`} disabled /> {option.label}
                  </div>
                ))}
              </Box>
            )}
            {question.type === 'file' && (
              <Typography variant="caption" color="textSecondary">
                A file will be required for this question during form submission.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

const CreateFormPage = () => {
  const [formTitle, setFormTitle] = useState('Untitled form');
  const [formDescription, setFormDescription] = useState('Form description');
  const [questions, setQuestions] = useState([{ label: '', type: 'text', options: [], mandatory: false }]);
  const [isPreview, setIsPreview] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleQuestionTypeChange = (qIndex, type) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].type = type;

    if (['multiple choice', 'checkbox', 'radio'].includes(type)) {
      newQuestions[qIndex].options = [{ label: '', value: '' }];
    } else {
      newQuestions[qIndex].options = [];
    }
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { label: '', type: 'text', options: [], mandatory: false }]);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ label: '', value: '' });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== optIndex);
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (qIndex) => {
    const newQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(newQuestions);
  };

  // Form validation
  const validateForm = () => {
    if (!formTitle || !formDescription) {
      setFormError('Please provide a valid form title and description.');
      return false;
    }
    const invalidQuestions = questions.filter(question => !question.label);
    if (invalidQuestions.length > 0) {
      setFormError('All questions must have a label.');
      return false;
    }
    return true;
  };

  const handleSubmitForm = async () => {
    // Check form validity
    if (!validateForm()) return;
  
    // Ensure that all questions have a label
    const validQuestions = questions.map((question, index) => ({
      ...question,
      label: question.label || `Question ${index + 1}`, // Assign default labels if any are missing
    }));
  
    // Format questions as per the schema with options as objects
    const formattedQuestions = validQuestions.map((question) => {
      if (['multiple choice', 'checkbox', 'radio'].includes(question.type)) {
        question.options = question.options.map((option, index) => ({
          label: option.label || `Option ${index + 1}`,
          value: option.value || option.label,
        }));
      }
      return question;
    });
  
    // Convert questions to a JSON string before sending
    const formData = {
      title: formTitle,
      description: formDescription,
      fields: JSON.stringify(formattedQuestions),  // Convert fields to a string
    };
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setFormError('Token is missing. Please log in again.');
        return;
      }
      const response = await axios.post('http://localhost:5001/api/forms/create', formData, {
        headers: {
          'Content-Type': 'application/json',  // Send as JSON
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      console.log('Form created successfully', response.data);
      navigate('/form-created', { state: { formId: response.data.form._id } });
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      console.log('Error details:', error.response);
      setFormError(`Error submitting form: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };
  

  return (
    <Container sx={{ marginTop: 4, maxWidth: 'md' }}>
      <Box sx={{ width: '60%', margin: 'auto' }}>
        <Box sx={{ marginBottom: 4 }}>
          <Button
            variant="outlined"
            color={isPreview ? "primary" : "secondary"}
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Back to Create Form' : 'Preview Form'}
          </Button>
        </Box>

        {formError && <Typography color="error">{formError}</Typography>}

        {!isPreview ? (
          <>
            <Box sx={{ marginBottom: 4 }}>
              <TextField
                label="Form Title"
                fullWidth
                variant="outlined"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Form Description"
                fullWidth
                variant="outlined"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </Box>

            {questions.map((question, qIndex) => (
              <Card key={qIndex} sx={{ marginBottom: 3, boxShadow: 2, padding: 2, borderRadius: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    
                    {/* Mandatory checkbox */}
                    <Grid item xs={12} sm={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={question.mandatory}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].mandatory = e.target.checked;
                              setQuestions(newQuestions);
                            }}
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontSize: '0.9rem' }}>Mandatory</Typography>}
                      />
                    </Grid>

                    {/* Question label */}
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label={`Question ${qIndex + 1}`}
                        fullWidth
                        value={question.label}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[qIndex].label = e.target.value;
                          setQuestions(newQuestions);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={question.type}
                          onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                          label="Type"
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="multiple choice">Multiple Choice</MenuItem>
                          <MenuItem value="checkbox">Checkbox</MenuItem>
                          <MenuItem value="radio">Radio Button</MenuItem>
                          <MenuItem value="file">File Upload</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Options for multiple choice, checkbox, or radio */}
                    {['multiple choice', 'checkbox', 'radio'].includes(question.type) && (
                      question.options.map((option, optIndex) => (
                        <Grid key={optIndex} item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TextField
                            label={`Option ${optIndex + 1}`}
                            fullWidth
                            value={option.label}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].options[optIndex].label = e.target.value;
                              newQuestions[qIndex].options[optIndex].value = e.target.value; // Assign value same as label
                              setQuestions(newQuestions);
                            }}
                            sx={{ flex: 1, marginRight: 2 }}
                          />
                          <IconButton
                            onClick={() => handleRemoveOption(qIndex, optIndex)}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      ))
                    )}

                    {['multiple choice', 'checkbox', 'radio'].includes(question.type) && (
                      <Grid item xs={12} sm={10}>
                        <Button
                          onClick={() => handleAddOption(qIndex)}
                          variant="outlined"
                          sx={{ marginTop: 2 }}
                        >
                          Add Option
                        </Button>
                      </Grid>
                    )}

                    {question.type === 'file' && (
                      <Grid item xs={12} sm={10}>
                        <Typography variant="caption" color="textSecondary">
                          A file will be required for this question during form submission.
                        </Typography>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={2}>
                      <IconButton onClick={() => handleRemoveQuestion(qIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Grid container spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Grid item>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddQuestion} sx={{ backgroundColor: 'teal' }}>
                  Add Question
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSubmitForm} sx={{ backgroundColor: 'teal' }}>
                  Create Form
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          // Preview mode
          <FormPreview formTitle={formTitle} formDescription={formDescription} questions={questions} />
        )}
      </Box>
    </Container>
  );
};

export default CreateFormPage;
