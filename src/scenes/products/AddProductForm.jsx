import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal, Grid } from "@mui/material";
import { useAddProductMutation } from "state/api";

const AddProductForm = ({ open, handleClose }) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [offerEnd, setOfferEnd] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [rating, setRating] = useState('');
  const [saleCount, setSaleCount] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [stock, setStock] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
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
    formData.append('sku', sku);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('offerEnd', offerEnd);
    formData.append('new', isNew);
    formData.append('rating', rating);
    formData.append('saleCount', saleCount);
    formData.append('category', category);
    formData.append('tag', tag);
    formData.append('stock', stock);
    formData.append('shortDescription', shortDescription);
    formData.append('fullDescription', fullDescription);
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
          width: 600,
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
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
                label="Discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Offer End"
                type="datetime-local"
                value={offerEnd}
                onChange={(e) => setOfferEnd(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Is New"
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Rating"
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Sale Count"
                type="number"
                value={saleCount}
                onChange={(e) => setSaleCount(e.target.value)}
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
                label="Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Short Description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Description"
                multiline
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
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
            </Grid>
          </Grid>
        </form>
        {isLoading && <p>Loading...</p>}
        {isSuccess && <p>Product added successfully!</p>}
        {isError && <p>Error: {error.message}</p>}
      </Box>
    </Modal>
  );
};

export default AddProductForm;
