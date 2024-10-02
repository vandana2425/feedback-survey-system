import React from 'react';
import { useParams } from 'react-router-dom';
import ResponseTab from './ResponseTab'; // Adjust the path based on your project structure

const ResponsesPage = () => {
  const { formId } = useParams(); // Extract formId from the URL

  console.log("formId in ResponsesPage:", formId); // Log to check if formId is being extracted correctly

  return (
    <div>
      <h2>Responses for Form ID: {formId}</h2>
      {/* Pass the formId to the ResponseTab component */}
      <ResponseTab formId={formId} />
    </div>
  );
};

export default ResponsesPage;
