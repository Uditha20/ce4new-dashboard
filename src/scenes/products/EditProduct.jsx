import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  useAddProductMutation,
  useGetCategoryQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "state/api";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditProduct = ({ id }) => {
  const { data: products, isLoading, isError } = useGetProductsQuery(); // Fetch all products
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [productDetails, setProductDetails] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    sku: "",
    capacity: "",
    height: "",
    width: "",
    length: "",
    discount: "",
    basePrice: "",
    mainImage: null,
    additionalImages: [],
  });
  const [alertOpen, setAlertOpen] = useState(false); // For Snackbar
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (products && !isLoading) {
      const matchedProduct = products.find((product) => product._id === id);
      setProductDetails(matchedProduct || null);
    }
  }, [products, id, isLoading]);
  useEffect(() => {
    if (productDetails) {
      setFormState({
        name: productDetails.name || "",
        sku: productDetails.sku || "",
        capacity: productDetails.capacity || "",
        height: productDetails.dimensions?.dheight || "",
        width: productDetails.dimensions?.dwidth || "",
        length: productDetails.dimensions?.dlength || "",
        discount: productDetails.discount || "",
        basePrice: productDetails.price.basePrice || "",
      });
    }
  }, [productDetails]);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState((prevState) => ({ ...prevState, mainImage: file }));
      // setPreviewImage(URL.createObjectURL(file)); // Optional: Display image preview
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setFormState((prevState) => ({
      ...prevState,
      additionalImages: files, // Set the additional images in the state
    }));
  };

  const saveProductChanges = async () => {
    const formData = new FormData();

    // Add fields to FormData
    formData.append("name", formState.name);
    formData.append("sku", formState.sku);
    // formData.append("capacity", formState.capacity);
    formData.append("dimensions.dheight", formState.height);
    formData.append("dimensions.dwidth", formState.width);
    formData.append("dimensions.dlength", formState.length);
    formData.append("discount", formState.discount);
    if (formState.mainImage) {
      formData.append("mainImage", formState.mainImage); // Attach the image file
    }
    formState.additionalImages.forEach((image) => { 
      formData.append("additionalImages", image); // Attach the additional image files
    }
    );
    
    try {
      await updateProduct({ id: productDetails._id, formData }).unwrap();
      setAlertOpen(true);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    navigate("/products"); // Navigate to /products after closing the alert
  };
  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <Typography color="error">Failed to load product details.</Typography>
    );
  if (!productDetails)
    return <Typography>No product found with ID {id}.</Typography>;

  console.log(productDetails);

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000} // Automatically closes after 6 seconds
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
          action={
            <Button color="inherit" size="small" onClick={handleAlertClose}>
              OK
            </Button>
          }
        >
          Product updated successfully!
        </Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Edit Product</Typography>
        </Grid>
      </Grid>
      <form>
        {/* 1st grid */}
        <Grid container spacing={2} sx={
          {
            
          }
        }>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              margin="normal"
              label="SKU"
              name="sku"
              value={formState.sku}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
            />
            <Grid item xs={3} sm={6} md={3}>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 1 }}
              >
                Upload Main Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange} // Handle file input change
                />
              </Button>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ marginTop: "10px", maxHeight: "100px" }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 1 }}
              >
                Upload Additional Images
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                />
              </Button>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {Array.isArray(formState.additionalImages) &&
                  formState.additionalImages.map((image, index) => (
                    <Grid item xs={4} key={index}>
                      <img
                        src={URL.createObjectURL(image)} // Preview image
                        alt={`Additional Preview ${index + 1}`}
                        style={{ maxWidth: "100%", maxHeight: "100px" }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            {/* <TextField
              fullWidth
              margin="normal"
              label="Base Price"
              name="basePrice"
              type="number"
              value={formState.basePrice}
            /> */}
            {/* <TextField
              fullWidth
              margin="normal"
              label="XL Base Price"
              name="xlBasePrice"
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="MD Base Price"
              name="mdBasePrice"
              type="number"
            /> */}
          </Grid>

          {/* second grid */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              margin="normal"
              label="Capacity"
              name="capacity"
              value={formState.capacity}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Discount"
              name="discount"
              value={formState.discount}
              onChange={handleInputChange}
            />

            {/* <TextField fullWidth margin="normal" label="Material" />
            <TextField
              fullWidth
              margin="normal"
              label="Base Price"
              name="basePrice"
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="XL Base Price"
              name="xlBasePrice"
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="MD Base Price"
              name="mdBasePrice"
              type="number"
            /> */}
          </Grid>

          {/* third grid */}
          <Grid item xs={12} sm={6} md={3}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label="Height"
                  name="height"
                  value={formState.height}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label="Width"
                  name="width"
                  value={formState.width}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label="length"
                  name="length"
                  value={formState.length}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveProductChanges}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditProduct;
