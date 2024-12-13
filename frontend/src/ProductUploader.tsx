import React, { useState } from 'react';
import { Box, Button, IconButton, Dialog, TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { uploadProduct } from '../services/api';

const ProductUploader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!name || !category || !file) {
      alert('Please provide all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('image', file);

    try {
      await uploadProduct(formData);
      alert('Product uploaded successfully.');
      setOpen(false);
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  return (
    <Box>
      <IconButton onClick={() => setOpen(true)}>
        <FileUploadIcon sx={{ fontSize: 24, color: 'gray' }} />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={3} display="flex" flexDirection="column" gap={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ProductUploader;
