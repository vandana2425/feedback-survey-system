import React, { useState, useEffect } from 'react';
import {
  Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Snackbar, Dialog, DialogContent, DialogTitle,
} from '@mui/material';
import formService from '../../services/formService';
import responseService from '../../services/responseService';
import EditForm from './EditForm';
import ResponseTab from '../Response/ResponseTab';
import { useAuth } from '../../context/AuthContext';

const Forms = () => {
  const { auth } = useAuth();
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showResponses, setShowResponses] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState('');

  // Fetch all forms when component mounts
  useEffect(() => {
    const fetchForms = async () => {
      if (auth && auth.token) {
        setLoading(true);
        try {
          const data = await formService.getAllForms(auth.token);
          setForms(data);
        } catch (error) {
          console.error('Error fetching forms:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchForms();
  }, [auth]);

  // Open the form editing modal
  const handleEdit = (formId) => {
    setSelectedFormId(formId);
    setOpenEdit(true);
  };

  // Close the form editing modal
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedFormId(null);
  };

  // Delete a form
  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setDeleteLoading(formId);
      try {
        await formService.deleteForm(formId, auth.token);
        setForms(forms.filter((form) => form._id !== formId));
      } catch (error) {
        console.error('Error deleting form:', error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Copy shareable link to clipboard
  const handleShare = (formId) => {
    const shareableUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareableUrl);
    setSnackbarMessage(`Form shareable link copied to clipboard: ${shareableUrl}`);
  };

  // Fetch form responses
  const handleViewResponses = async (formId) => {
    setResponseLoading(true);
    setResponseError('');
    try {
      const data = await responseService.getResponses(formId, auth.token);
      setResponseData(data || []);  // Handle data in non-paginated format
      setSelectedFormId(formId);
      setShowResponses(true);
    } catch (error) {
      setResponseError('Error fetching responses.');
      console.error('Error fetching form responses:', error);
    } finally {
      setResponseLoading(false);
    }
  };

  // Close snackbar message
  const handleCloseSnackbar = () => {
    setSnackbarMessage('');
  };

  // Close response dialog
  const handleCloseResponses = () => {
    setShowResponses(false);
    setResponseData([]);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Forms
      </Typography>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
          <Typography>Loading forms...</Typography>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.length > 0 ? (
                forms.map((form) => (
                  <TableRow key={form._id}>
                    <TableCell>{form.title}</TableCell>
                    <TableCell>{form.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(form._id)}
                        style={{ marginRight: '10px' }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(form._id)}
                        disabled={deleteLoading === form._id}
                        style={{ marginRight: '10px' }}
                      >
                        {deleteLoading === form._id ? (
                          <CircularProgress size={24} />
                        ) : (
                          'Delete'
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleShare(form._id)}
                        style={{ marginRight: '10px' }}
                      >
                        Share
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => handleViewResponses(form._id)}
                      >
                        Responses
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body2" align="center">
                      No forms available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Form Dialog */}
      {openEdit && (
        <EditForm formId={selectedFormId} onClose={handleCloseEdit} />
      )}

      {/* Snackbar for copy feedback */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

      {/* Response Dialog */}
      <Dialog open={showResponses} onClose={handleCloseResponses} maxWidth="md" fullWidth>
        <DialogTitle>Form Responses</DialogTitle>
        <DialogContent>
          {responseLoading ? (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography>Loading responses...</Typography>
            </div>
          ) : responseError ? (
            <Typography color="error">{responseError}</Typography>
          ) : (
            <ResponseTab formId={selectedFormId} formData={responseData} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forms;
