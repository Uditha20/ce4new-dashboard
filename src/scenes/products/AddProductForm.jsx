import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import { useAddProductMutation } from "state/api";

const AddProductForm = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [supply, setSupply] = useState('');
  const [rating, setRating] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [addProduct, { isLoading, isSuccess, isError, error }] = useAddProductMutation();

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('supply', supply);
    formData.append('rating', rating);
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    for (let i = 0; i < additionalImages.length; i++) {
      formData.append('additionalImages', additionalImages[i]);
    }

    await addProduct(formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Supply"
            type="number"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <input
            type="file"
            onChange={handleMainImageChange}
            accept="image/*"
          />
          <input
            type="file"
            multiple
            onChange={handleAdditionalImagesChange}
            accept="image/*"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Product
          </Button>
        </form>
        {isLoading && <p>Loading...</p>}
        {isSuccess && <p>Product added successfully!</p>}
        {isError && <p>Error: {error.message}</p>}
      </Box>
    </Modal>
  );
};

export default AddProductForm;
