import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, MenuItem, Select, Box,
  Card, CardContent, Grid, FormControl, InputLabel, IconButton, Checkbox, FormControlLabel, Typography, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import formService from '../../services/formService';
import FormPreview from './FormPreview';  // Import the preview component

const EditForm = ({ formId, onClose }) => {
  const [formData, setFormData] = useState({ title: '', description: '', fields: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // For save button loader
  const [validationErrors, setValidationErrors] = useState('');
  const [isPreview, setIsPreview] = useState(false);  // State to toggle preview mode

  // Fetch the form details if formId is provided
  useEffect(() => {
    if (formId) {
      const token = localStorage.getItem('authToken');
      if (token) {
        formService.getForm(formId, token)
          .then(data => {
            const fields = data.fields || [];
            setFormData({ ...data, fields });
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching form:', error);
            setLoading(false);
          });
      } else {
        console.error('No token available');
        setLoading(false);
      }
    }
  }, [formId]);

  // Handle input change for form title and description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle individual field changes
  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][key] = value;
    setFormData({ ...formData, fields: updatedFields });
  };

  // Add an option to a field (for radio, checkbox, multiple choice)
  const handleAddOption = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields[index].options.push({ label: '', value: '' });  // Initialize as an object with label and value
    setFormData({ ...formData, fields: updatedFields });
  };

  // Remove an option from a field
  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formData.fields];
    updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, fields: updatedFields });
  };

  // Add a new field (question)
  const handleAddField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { type: 'text', label: '', options: [], mandatory: false }]
    });
  };

  // Remove a field (question)
  const handleRemoveField = (index) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: updatedFields });
  };

  // Form validation before saving
  const validateForm = () => {
    if (!formData.title || !formData.description) {
      setValidationErrors('Form title and description are required.');
      return false;
    }

    for (let i = 0; i < formData.fields.length; i++) {
      const field = formData.fields[i];
      if (!field.label) {
        setValidationErrors(`Question ${i + 1} is missing a label.`);
        return false;
      }

      if (['radio', 'checkbox', 'multiple choice'].includes(field.type) && field.options.length === 0) {
        setValidationErrors(`Question ${i + 1} requires at least one option.`);
        return false;
      }
    }

    setValidationErrors('');
    return true;
  };

  // Save the form after validation
  const handleSave = () => {
    if (!validateForm()) return;

    setSaving(true); // Indicate form is being saved
    const token = localStorage.getItem('authToken');
    if (token) {
      formService.updateForm(formId, formData, token)
        .then(() => {
          setSaving(false); // Stop save loader
          onClose();  // Close the form after saving
        })
        .catch(error => {
          setSaving(false); // Stop save loader
          console.error('Error updating form:', error);
        });
    }
  };

  if (loading) return <CircularProgress />; // Show a loader when fetching form details

  return (
    <Container sx={{ marginTop: 4, maxWidth: 'md' }}>
      <Box sx={{ width: '60%', margin: 'auto' }}> {/* Center the form */}

        {!isPreview ? (
          <>
            <Typography variant="h6">Edit Form</Typography>

            {validationErrors && <Typography color="error" variant="body2">{validationErrors}</Typography>}

            {/* Form Title and Description */}
            <TextField
              name="title"
              label="Form Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            {/* Render Fields (Questions) */}
            {formData.fields.map((field, index) => (
              <Card key={index} sx={{ marginBottom: 3 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Question Label */}
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label={`Question ${index + 1}`}
                        fullWidth
                        value={field.label}
                        onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                      />
                    </Grid>

                    {/* Field Type Selector */}
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={field.type}
                          onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                          label="Type"
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="multiple choice">Multiple Choice</MenuItem>
                          <MenuItem value="radio">Radio Button</MenuItem>
                          <MenuItem value="checkbox">Checkbox</MenuItem>
                          <MenuItem value="file">File Upload</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Mandatory Field Checkbox */}
                    <Grid item xs={12} sm={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.mandatory}
                            onChange={(e) => handleFieldChange(index, 'mandatory', e.target.checked)}
                          />
                        }
                        label="Mandatory"
                      />
                    </Grid>

                    {/* Options for Radio, Checkbox, and Multiple Choice Fields */}
                    {['radio', 'checkbox', 'multiple choice'].includes(field.type) && (
                      <Grid item xs={12}>
                        {field.options.map((option, optIndex) => (
                          <Grid container spacing={2} key={optIndex} sx={{ marginBottom: 1 }}>
                            <Grid item xs={10}>
                              <TextField
                                label={`Option ${optIndex + 1}`}
                                fullWidth
                                value={option.label || ''}  // Ensure we access the label
                                onChange={(e) => {
                                  const updatedOptions = [...field.options];
                                  updatedOptions[optIndex].label = e.target.value;  // Update option label
                                  handleFieldChange(index, 'options', updatedOptions);
                                }}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleRemoveOption(index, optIndex)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                        <Button onClick={() => handleAddOption(index)} variant="outlined" startIcon={<AddIcon />}>
                          Add Option
                        </Button>
                      </Grid>
                    )}

                    {/* Remove Field (Question) Button */}
                    <Grid item xs={12} sm={2}>
                      <IconButton onClick={() => handleRemoveField(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {/* Add New Question Button */}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddField}>
              Add New Question
            </Button>

            {/* Action Buttons (Save, Cancel, Preview) */}
            <Grid container spacing={2} sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsPreview(true)}  // Switch to preview mode
                >
                  Preview
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            {/* Form Preview Component */}
            <FormPreview formData={formData} />
            <Grid container spacing={2} sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsPreview(false)} // Switch back to edit mode
                >
                  Back to Edit
                </Button>
              </Grid>
            </Grid>
          </>
        )}

      </Box>
    </Container>
  );
};

export default EditForm;
