import React from 'react';
import { Typography } from '@mui/material';

const QuestionHeader = ({ text }) => {
  return (
    <div>
      <Typography variant="h6">{text}</Typography>
    </div>
  );
};

export default QuestionHeader;
