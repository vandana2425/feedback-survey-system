import React, { useState } from 'react';
import { TableRow, TableCell, Button, Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditForm from './EditForm';  // Import EditForm

const FormRow = ({ form, onDelete, onShare }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const handleOpen = (formId) => {
    setSelectedFormId(formId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFormId(null);
  };

  const handleViewResponses = () => {
    navigate(`/responses/${form._id}`);
  };

  return (
    <>
      <TableRow>
        <TableCell>{form.title || 'Untitled Form'}</TableCell>
        <TableCell>{form.description || 'No description available'}</TableCell>
        <TableCell>
          <Button variant="contained" color="primary" onClick={() => handleOpen(form._id)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={() => onDelete(form._id)}>
            Delete
          </Button>
          <Button variant="contained" color="success" onClick={() => onShare(form._id)}>
            Share
          </Button>
          <Button variant="contained" color="info" onClick={handleViewResponses}>
            Responses
          </Button>
        </TableCell>
      </TableRow>

      {/* Dialog for Editing Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        {selectedFormId && <EditForm formId={selectedFormId} onClose={handleClose} />}
      </Dialog>
    </>
  );
};

export default FormRow;
