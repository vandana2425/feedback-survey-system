import React from 'react';
import { Typography, Paper, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Button, Checkbox } from '@mui/material';

const FormPreview = ({ formData }) => {
  if (!formData || !formData.fields || formData.fields.length === 0) {
    return <Typography variant="body1">No form data to preview</Typography>;
  }

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>{formData.title || 'Untitled Form'}</Typography>
      <Typography variant="body1" gutterBottom>{formData.description || 'No description available'}</Typography>

      {formData.fields.map((question, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <Typography variant="h6" style={{ color: question.mandatory ? 'red' : 'inherit' }}>
            {`Question ${index + 1}: ${question.label}`}
            {question.mandatory && <span style={{ color: 'red' }}> *</span>}
          </Typography>

          {question.type === 'text' && (
            <TextField
              label="Your Answer"
              fullWidth
              variant="outlined"
              margin="normal"
              disabled
            />
          )}

          {question.type === 'radio' && (
            <FormControl component="fieldset">
              <RadioGroup name={`question_${index}`}>
                {question.options && question.options.map((option, i) => (
                  <FormControlLabel
                    key={i}
                    value={option.value} // Use option.value for the radio input value
                    control={<Radio />}
                    label={option.label} // Render the label of the option
                    disabled
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {question.type === 'multiple choice' && (
            <FormControl component="fieldset">
              {question.options && question.options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  control={<Checkbox disabled />}
                  label={option.label} // Render the label of the option
                />
              ))}
            </FormControl>
          )}

          {question.type === 'file' && (
            <TextField
              type="file"
              fullWidth
              variant="outlined"
              margin="normal"
              disabled
            />
          )}
        </div>
      ))}

      <Button variant="contained" color="primary" disabled style={{ marginTop: 20 }}>
        Submit Form (Disabled in Preview)
      </Button>
    </Paper>
  );
};

export default FormPreview;
