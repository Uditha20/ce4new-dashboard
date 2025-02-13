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
    colour: "",
    capacityMeasure: "",
    indoorOutdoor: "",
    originalReproduction: "",
    features: [],
    occasion: [],
    category: "",
    department: [],
    shape: "",
    style: "",
    productId: "",
    partName: "",
    partWidth: "",
    partHeight: "",
    partLength: "",
    partWeight: "",
    partNameTwo: "",
    partWidthTwo: "",
    partHeightTwo: "",
    partLengthTwo: "",
    partWeightTwo: "",
    unitQuantity: "",
  });
  const [alertOpen, setAlertOpen] = useState(false); // For Snackbar
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const { data: category = [], isLoading: isCategoryLoading } =
    useGetCategoryQuery();
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
        colour: productDetails.colour || "",
        capacityMeasure: productDetails.capacityMeasure || "",
        indoorOutdoor: productDetails.indoorOutdoor || "",
        originalReproduction: productDetails.originalReproduction || "",
        features: [],
        occasion: [],
        category: productDetails.category || "",
        department: [],
        shape: productDetails.shape || "",
        style: productDetails.style || "",
        productId: productDetails.productId || "",
        partName: productDetails.itemRelatedParts?.partName || "",
        partWidth: productDetails.itemRelatedParts?.width || "",
        partHeight: productDetails.itemRelatedParts?.height || "",
        partLength: productDetails.itemRelatedParts?.length || "",
        partWeight: productDetails.itemRelatedParts?.weight || "",
        partNameTwo: productDetails.itemRelatedPartsTwo?.partName || "",
        partWidthTwo: productDetails.itemRelatedPartsTwo?.width || "",
        partHeightTwo: productDetails.itemRelatedPartsTwo?.height || "",
        partLengthTwo: productDetails.itemRelatedPartsTwo?.length || "",
        partWeightTwo: productDetails.itemRelatedPartsTwo?.weight || "",
        unitQuantity: productDetails.unitQuantity || "",
      });
    }
  }, [productDetails]);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // const handleInputChangeFeatures = (e) => {
  //   setFormState((prevState) => ({
  //     ...prevState,
  //     features: e.target.value, // Directly replace the features array with the new selection
  //   }));
  // };

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
    formData.append("colour", formState.colour);
    formData.append("capacityMeasure", formState.capacityMeasure);
    formData.append("indoorOutdoor", formState.indoorOutdoor);
    formData.append("originalReproduction", formState.originalReproduction);
    formData.append("rating", formState.rating);
    formData.append("features", formState.features.join(","));
    formData.append("occasion", formState.occasion.join(","));
    formData.append("category", formState.category);
    formData.append("department", formState.department.join(","));
    formData.append("shape", formState.shape);
    formData.append("style", formState.style);
    formData.append("productId", formState.productId);
    formData.append("itemRelatedParts.partName", formState.partName);
    formData.append("itemRelatedParts.width", formState.partWidth);
    formData.append("itemRelatedParts.height", formState.partHeight);
    formData.append("itemRelatedParts.length", formState.partLength);
    formData.append("itemRelatedParts.weight", formState.partWeight);
    formData.append("itemRelatedPartsTwo.partName", formState.partNameTwo);
    formData.append("itemRelatedPartsTwo.width", formState.partWidthTwo);
    formData.append("itemRelatedPartsTwo.height", formState.partHeightTwo);
    formData.append("itemRelatedPartsTwo.length", formState.partLengthTwo);
    formData.append("itemRelatedPartsTwo.weight", formState.partWeightTwo);
    formData.append("unitQuantity", formState.unitQuantity);

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
      <Box>
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Features</InputLabel>
                <Select
                  label="Features"
                  value={formState.features}
                  onChange={handleInputChange}
                  name="features"
                  multiple
                  renderValue={(selected) => selected.join(", ")}
                >
                  <MenuItem value="Eco-friendly">Eco-friendly</MenuItem>
                  <MenuItem value="Handmade">Handmade</MenuItem>
                  <MenuItem value="Durable">Durable</MenuItem>
                  <MenuItem value="Smooth">Smooth</MenuItem>
                  <MenuItem value="Lightweight">Lightweight</MenuItem>
                  <MenuItem value="Natural">Natural</MenuItem>
                  <MenuItem value="Organic">Organic</MenuItem>
                  <MenuItem value="Fresh">Fresh</MenuItem>
                  <MenuItem value="Pure">Pure</MenuItem>
                  <MenuItem value="PH Balance">PH Balance</MenuItem>
                  <MenuItem value="Test">Test</MenuItem>
                  <MenuItem value="Plastic Free">Plastic Free</MenuItem>
                  <MenuItem value="Sustainable">Sustainable</MenuItem>
                  <MenuItem value="Replacement for Plastic">
                    Replacement for Plastic
                  </MenuItem>
                  <MenuItem value="Decoration">Decoration</MenuItem>
                  <MenuItem value="High Quality">High Quality</MenuItem>
                  <MenuItem value="Hand Painted">Hand Painted</MenuItem>
                  <MenuItem value="Double Handle">Double Handle</MenuItem>
                  <MenuItem value="Reusable">Reusable</MenuItem>
                </Select>
              </FormControl>
              <InputLabel>suitable for use</InputLabel>
              <Select
                fullWidth
                margin="normal"
                label="suitable for use"
                value={formState.department}
                name="department"
                onChange={handleInputChange}
                multiple // Allows multiple selections
                renderValue={(selected) => selected.join(", ")} // Display selected values as comma-separated
              >
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Men">Men</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
                <MenuItem value="Girl">Girl</MenuItem>
                <MenuItem value="Boy">Boy</MenuItem>
                <MenuItem value="Adult">Adult</MenuItem>
                <MenuItem value="Teen">Teen</MenuItem>
              </Select>
              <TextField
                fullWidth
                margin="normal"
                label="item part name"
                name="partName"
                value={formState.partName}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="item part name 2"
                name="partNameTwo"
                value={formState.partNameTwo}
                onChange={handleInputChange}
              />
            </Grid>

            {/* second grid */}
            <Grid item xs={12} sm={6} md={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Capacity"
                    name="capacity"
                    value={formState.capacity}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Measure"
                    value={formState.capacityMeasure}
                    onChange={handleInputChange}
                    select
                  >
                    <MenuItem value="liters">Liters</MenuItem>
                    <MenuItem value="kg">Kilograms</MenuItem>
                    <MenuItem value="ml">Milliliters</MenuItem>
                    <MenuItem value="g">grams</MenuItem>

                    {/* Add more units as needed */}
                  </TextField>
                </Grid>
              </Grid>
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
              <TextField
                fullWidth
                margin="normal"
                label="colour"
                name="colour"
                value={formState.colour}
                onChange={handleInputChange}
              />
              <InputLabel>Occasion</InputLabel>
              <Select
                fullWidth
                margin="normal"
                label="Occasion"
                name="occasion"
                value={formState.occasion}
                onChange={handleInputChange}
                multiple
                renderValue={(selected) => selected.join(", ")}
              >
                <MenuItem value="All occasions">All occasions</MenuItem>
                <MenuItem value="Housewarming">Housewarming</MenuItem>
                <MenuItem value="New Year">New Year</MenuItem>
                <MenuItem value="Christmas">Christmas</MenuItem>
                <MenuItem value="Valentine">Valentine</MenuItem>
                <MenuItem value="Birthday">Birthday</MenuItem>
                <MenuItem value="Anniversary">Anniversary</MenuItem>
                <MenuItem value="Funeral">Funeral</MenuItem>
                <MenuItem value="Wedding">Wedding</MenuItem>
                <MenuItem value="Party">Party</MenuItem>
                <MenuItem value="Mother's Day">Mother's Day</MenuItem>
                <MenuItem value="Father's Day">Father's Day</MenuItem>
                <MenuItem value="Retirement">Retirement</MenuItem>
                <MenuItem value="Opening Day">Opening Day</MenuItem>
              </Select>
              <TextField
                fullWidth
                margin="normal"
                label="shape"
                name="shape"
                value={formState.shape}
                onChange={handleInputChange}
              />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Height"
                    name="partHeight"
                    value={formState.partHeight}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Width"
                    name="partWidth"
                    partWidth
                    value={formState.partWidth}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="length"
                    name="partLength"
                    value={formState.partLength}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              
              <Grid container spacing={2}>
              <Grid item xs={4}>
              <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Height"
                    name="partHeightTwo"
                    value={formState.partHeightTwo}
                    onChange={handleInputChange}
                  />
</Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Width"
                    name="partWidthTwo"
                    value={formState.partWidthTwo}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField

                    fullWidth
                    margin="normal"
                    type="number"
                    label="length"
                    name="partLengthTwo"
                    value={formState.partLengthTwo}
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
              <TextField
                fullWidth
                margin="normal"
                label="Indoor/Outdoor"
                name="indoorOutdoor"
                value={formState.indoorOutdoor}
                onChange={handleInputChange}
                select
              >
                <MenuItem value="Indoor">Indoor</MenuItem>
                <MenuItem value="Outdoor">Outdoor</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label="Original/Reproduction"
                name="originalReproduction"
                value={formState.originalReproduction}
                onChange={handleInputChange}
                select
              >
                <MenuItem value="Original">Original</MenuItem>
                <MenuItem value="Reproduction">Reproduction</MenuItem>
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label="style"
                name="style"
                value={formState.style}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="weight"
                name="partWeight"
                value={formState.partWeight}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="weight 2"
                name="partWeightTwo"
                value={formState.partWeightTwo}
                onChange={handleInputChange}
              />
            </Grid>
            {/* fourth grid */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Rating"
                name="rating"
                type="number"
                value={formState.rating}
                onChange={handleInputChange}
              />

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
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  onChange={handleInputChange}
                  name="category"
                  value={formState.category}
                  fullWidth
                >
                  {category.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Product ID"
                name="productId"
                value={formState.productId}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Unit Quantity"
                name="unitQuantity"
                value={formState.unitQuantity}
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
                onChange={(value) =>
                  handleQuillChange("shortDescription", value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <p>Full Description</p>
              <ReactQuill
                value={formState.fullDescription}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter FullDescription"
                onChange={(value) =>
                  handleQuillChange("fullDescription", value)
                }
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
