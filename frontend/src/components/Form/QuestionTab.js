import React from 'react';
import { Tabs, Tab, Typography, Paper } from '@mui/material';
import QuestionHeader from './QuestionHeader'; // assuming you need this for headers
import { useState } from 'react';

const QuestionTab = ({ questions }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Paper>
      <Tabs value={tabIndex} onChange={handleChange} aria-label="question tabs">
        {questions.map((question, index) => (
          <Tab key={index} label={`Question ${index + 1}`} />
        ))}
      </Tabs>
      {questions.map((question, index) => (
        <TabPanel value={tabIndex} index={index} key={index}>
          <QuestionHeader text={question.questionText} />
          {/* Add your question content here */}
        </TabPanel>
      ))}
    </Paper>
  );
};

// A helper component to handle tab panels
const TabPanel = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
};

export default QuestionTab;
