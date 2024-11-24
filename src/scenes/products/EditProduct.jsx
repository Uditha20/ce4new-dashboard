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
    material: "",
    oneDayPremium: "",
    oneDayPremiumSecondItem: "",
    twoDayPremium: "",
    twoDayPremiumSecondItem: "",
    rating: "",
    stock: "",
    weight: "",
    shortDescription: "",
    fullDescription: "",
    itemType: "",
    made: "",
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
        material: productDetails.material || "",
        oneDayPremium: productDetails.price.oneDayPremium || "",
        oneDayPremiumSecondItem:
          productDetails.price.oneDayPremiumSecondItem || "",
        twoDayPremium: productDetails.price.twoDayPremium || "",
        twoDayPremiumSecondItem:
          productDetails.price.twoDayPremiumSecondItem || "",

        rating: productDetails.rating || "",
        stock: productDetails.stock || "",
        weight: productDetails.weight || "",
        shortDescription: productDetails.shortDescription || "",
        fullDescription: productDetails.fullDescription || "",
        itemType: productDetails.itemType || "",
        made: productDetails.handmade || "",
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
      setPreviewImage(URL.createObjectURL(file));
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
    formData.append("material", formState.material);
    formData.append("price.basePrice", formState.basePrice);
    formData.append("price.oneDayPremium", formState.oneDayPremium);
    formData.append("itemType", formState.itemType); 
    formData.append("handmade", formState.made);

    if (formState.stock) {
      formData.append("stock", Number(formState.stock));
    } 
    if (formState.weight) {
      formData.append("weight", Number(formState.weight));
    }
  
    formData.append("shortDescription", formState.shortDescription);
    formData.append("fullDescription", formState.fullDescription);

    formData.append(
      "price.oneDayPremiumSecondItem",
      formState.oneDayPremiumSecondItem
    );
    formData.append("price.twoDayPremium", formState.twoDayPremium);
    formData.append(
      "price.twoDayPremiumSecondItem",
      formState.twoDayPremiumSecondItem
    );

    if (formState.mainImage) {
      formData.append("mainImage", formState.mainImage); // Attach the image file
    }
    if (formState.additionalImages && formState.additionalImages.length > 0) {
      formState.additionalImages.forEach((image) => {
        formData.append("additionalImages", image); // Attach the additional image files
      });
    }
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

  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }], // Color options for text and background
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"], // remove formatting button
    ],
  };
  const quillFormats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "strike",
    "color", // Allow text color formatting
    "background", // Allow background color formatting
    "script",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const handleQuillChange = (field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value, // Update the specific field dynamically
    }));
  };


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
      <Box
       
      >
        <form>
          {/* 1st grid */}
          <Grid container spacing={2} sx={{}}>
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
              <TextField
                fullWidth
                margin="normal"
                label="basePrice"
                name="basePrice"
                value={formState.basePrice}
                onChange={handleInputChange}
              />
               <TextField
                fullWidth
                margin="normal"
                label="Handmade or Machine Made"
                value={formState.made}
                onChange={handleInputChange}
                name="made"
                select
              >
                <MenuItem value="Handmade">Handmade</MenuItem>
                <MenuItem value="Machine Made">Machine Made</MenuItem>
              </TextField>
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

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="oneDay pre-1st"
                    name="oneDayPremium"
                    value={formState.oneDayPremium}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="oneDay pre-2nd"
                    name="oneDayPremiumSecondItem"
                    type="number"
                    value={formState.oneDayPremiumSecondItem}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
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
              <TextField
                fullWidth
                margin="normal"
                label="material"
                name="material"
                value={formState.material}
                onChange={handleInputChange}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="twoDayPre 1st"
                    name="twoDayPremium"
                    value={formState.twoDayPremium}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="twoDayPre 2nd"
                    name="twoDayPremiumSecondItem"
                    type="number"
                    value={formState.twoDayPremiumSecondItem}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {/* <TextField
                fullWidth
                margin="normal"
                label="Rating"
                name="rating"
                type="number"
                value={formState.rating}
                onChange={handleInputChange}
              /> */}

              <TextField
                fullWidth
                margin="normal"
                label="Stock"
                name="stock"
                value={formState.stock}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="weight"
                name="weight"
                value={formState.weight}
                onChange={handleInputChange}
              />
               <TextField
                fullWidth
                margin="normal"
                label="Item type"
                name="itemType"
                value={formState.itemType}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <p>short Description</p>
              <ReactQuill
                value={formState.shortDescription}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter short description"
                onChange={(value) => handleQuillChange("shortDescription", value)}
              />
            </Grid>
            <Grid item xs={12}>
              <p>Full Description</p>
              <ReactQuill
                value={formState.fullDescription}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter FullDescription"
                onChange={(value) => handleQuillChange("fullDescription", value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Grid item>
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
                    style={{ marginTop: "2px", maxHeight: "80px" }}
                  />
                )}
              </Grid>
            </Grid>

            <Grid item>
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
                    <Grid item key={index}>
                      <img
                        src={URL.createObjectURL(image)} // Preview image
                        alt={`Additional Preview ${index + 1}`}
                        style={{ maxWidth: "100%", maxHeight: "50px" }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mb: 5 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveProductChanges}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default EditProduct;
