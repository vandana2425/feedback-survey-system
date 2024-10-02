import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

const RadioChecks = ({ question, onChange, value }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{question.questionText}</FormLabel>
      <RadioGroup
        aria-label={question.questionText}
        name={question._id}
        value={value}
        onChange={onChange}
      >
        {question.options.map((option) => (
          <FormControlLabel
            key={option._id}
            value={option._id}
            control={<Radio />}
            label={option.optionText}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioChecks;
