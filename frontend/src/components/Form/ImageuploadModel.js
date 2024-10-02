import React, { useState } from 'react';
import { Modal, Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import formService from '../../services/formService';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    width: '400px',
  },
  uploadIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ImageUploadModel = ({ open, onClose }) => {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageName(e.target.files[0].name);
  };

  const handleUpload = () => {
    if (image) {
      formService.uploadImage(image).then(() => {
        onClose();
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <Typography variant="h6">Upload Image</Typography>
        <input
          accept="image/*"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            variant="contained"
            color="default"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Choose Image
          </Button>
        </label>
        <TextField
          label="Selected File"
          value={imageName}
          fullWidth
          margin="normal"
          disabled
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          style={{ marginTop: 20 }}
        >
          Upload
        </Button>
      </div>
    </Modal>
  );
};

export default ImageUploadModel;
