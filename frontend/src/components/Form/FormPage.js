import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import formService from '../../services/formService';
import responseService from '../../services/responseService';
import {
  Typography, CircularProgress, TextField, Button, Snackbar, Alert,
  Radio, FormControlLabel, RadioGroup, Checkbox, FormGroup, Container, MenuItem, Select, Box, Paper
} from '@mui/material';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB file size limit

const FormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await formService.getForm(formId);
        setForm(data);
      } catch (error) {
        console.error('Error fetching form:', error);
        setErrorMessage('Failed to fetch form. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleResponseChange = (questionId, responseType, value) => {
    setResponses({
      ...responses,
      [questionId]: { responseType, answer: value }
    });
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    const currentResponses = responses[questionId]?.answer || [];
    const updatedResponses = checked
      ? [...currentResponses, option.label] // Updated to correctly handle object with label
      : currentResponses.filter((item) => item !== option.label);

    setResponses({
      ...responses,
      [questionId]: { responseType: 'checkbox', answer: updatedResponses }
    });
  };

  const handleFileChange = (questionId, event) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setErrorMessage('File is too large.');
      return;
    }
    setResponses({
      ...responses,
      [questionId]: { responseType: 'file', answer: file }
    });
  };

  const isFormComplete = () => {
    return form.fields.every(field => responses[field._id]?.answer);
  };

  const handleSubmit = async () => {
    const formattedResponses = form.fields.map((field) => {
      const response = responses[field._id];

      return {
        questionLabel: field.label,
        questionType: field.type,
        answer: response?.answer || '',
        options: field.options ? field.options.map(opt => opt.label) : undefined // Ensure options are included when needed
      };
    });

    if (formattedResponses.some(response => !response.answer)) {
      setErrorMessage('Please answer all questions.');
      return;
    }

    setSubmitLoading(true);
    try {
      await responseService.submitResponse(formId, formattedResponses);
      setSuccessMessage('Response submitted successfully!');
    } catch (error) {
      console.error('Error submitting response:', error);
      setErrorMessage('Error submitting response. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!form) return <Typography>No form found.</Typography>;

  return (
    <Container
      maxWidth="md"
      sx={{
        padding: '20px',
        backgroundColor: 'linear-gradient(135deg, #f0f4f7, #d9e4f5)',
        borderRadius: '15px',
        boxShadow: 4,
        mt: 6,
      }}
    >
      <Paper elevation={3} sx={{ padding: '30px', borderRadius: '15px', background: 'rgba(255,255,255,0.8)' }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            background: 'linear-gradient(to right, #1976d2, #43a047)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {form.title}
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          gutterBottom
          sx={{ mb: 5, color: '#4a4a4a' }}
        >
          {form.description}
        </Typography>

        <Box sx={{ mb: 4 }}>
          {form.fields.map((field) => (
            <Box
              key={field._id}
              sx={{
                mb: 4,
                p: 3,
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#fafafa',
                '&:hover': { boxShadow: 3 },
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#333' }}>
                {field.label}
              </Typography>

              {/* Text Field */}
              {field.type === 'text' && (
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => handleResponseChange(field._id, 'text', e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#1976d2',
                      },
                      '&:hover fieldset': {
                        borderColor: '#43a047',
                      },
                    },
                  }}
                />
              )}

              {/* Radio Buttons */}
              {field.type === 'radio' && (
                <RadioGroup
                  name={`question-${field._id}`}
                  value={responses[field._id]?.answer || ''}
                  onChange={(e) => handleResponseChange(field._id, 'radio', e.target.value)}
                >
                  {field.options.map((option, index) => (
                    <FormControlLabel
                      key={`option-${index}`}
                      value={option.label}  
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              )}

              {/* Multiple Choice (Select dropdown) */}
              {field.type === 'multiple choice' && (
                <Select
                  fullWidth
                  value={responses[field._id]?.answer || ''}
                  displayEmpty
                  onChange={(e) => handleResponseChange(field._id, 'multiple choice', e.target.value)}
                  sx={{
                    mt: 2,
                    mb: 2,
                    '& .MuiSelect-outlined': {
                      borderColor: '#1976d2',
                      '&:hover': {
                        borderColor: '#43a047',
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select an option
                  </MenuItem>
                  {field.options.map((option, index) => (
                    <MenuItem key={`option-${index}`} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {/* Checkboxes */}
              {field.type === 'checkbox' && (
                <FormGroup>
                  {field.options.map((option, index) => (
                    <FormControlLabel
                      key={`option-${index}`}
                      control={
                        <Checkbox
                          checked={(responses[field._id]?.answer || []).includes(option.label)}
                          onChange={(e) =>
                            handleCheckboxChange(field._id, option, e.target.checked)
                          }
                        />
                      }
                      label={option.label}  
                    />
                  ))}
                </FormGroup>
              )}

              {/* File Upload */}
              {field.type === 'file' && (
                <input
                  type="file"
                  onChange={(e) => handleFileChange(field._id, e)}
                  style={{ marginTop: '10px' }}
                />
              )}
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitLoading || !isFormComplete()}
          sx={{
            width: '100%',
            padding: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#43a047',
            },
          }}
        >
          {submitLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>

        {/* Success Snackbar */}
        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage('')}
        >
          <Alert onClose={() => setErrorMessage('')} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default FormPage;
