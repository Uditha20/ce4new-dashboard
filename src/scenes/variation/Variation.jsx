import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { useAddVariationMutation, useGetProductsQuery } from "state/api";

function Variation({
  open,
  handleClose,
  handleSubmit,
  isError,
  error,
  isSuccess,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [productId, setProductId] = useState("");
  const [variationId, setVariationId] = useState("");
  const [variationType, setVariationType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Price fields
  const [price, setPrice] = useState({
    basePrice: "",
    oneDayPremium: "",
    oneDayPremiumSecondItem: "",
    twoDayPremium: "",
    twoDayPremiumSecondItem: "",
  });

  const [xlPrice, setXlPrice] = useState({
    xlBasePrice: "",
    xlOneDayPremium: "",
    xlOneDayPremiumSecondItem: "",
    xlTwoDayPremium: "",
    xlTwoDayPremiumSecondItem: "",
  });

  const [mdPrice, setMdPrice] = useState({
    mdBasePrice: "",
    mdOneDayPremium: "",
    mdOneDayPremiumSecondItem: "",
    mdTwoDayPremium: "",
    mdTwoDayPremiumSecondItem: "",
  });

  // Image fields
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Handlers for images
  const handleMainImageChange = (e) => setMainImage(e.target.files[0]);
  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages(e.target.files);
  };

  const { data: products, isLoading: isProductsLoading } =
    useGetProductsQuery();
  const [addVariation, { isLoading: isVariantsLoading }] =
    useAddVariationMutation();

  const handlePriceChange = (e, size) => {
    const { name, value } = e.target;
    if (size === "price") {
      setPrice((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (size === "xlPrice") {
      setXlPrice((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (size === "mdPrice") {
      setMdPrice((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("productId", productId);
      formData.append("itemQty", itemQty);
      formData.append("price", JSON.stringify(price));
      formData.append("xlPrice", JSON.stringify(xlPrice));
      formData.append("mdPrice", JSON.stringify(mdPrice));
      formData.append("variationId", variationId);
      formData.append("variationType", variationType);

      // Add images to formData
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }
      for (let i = 0; i < additionalImages.length; i++) {
        formData.append("additionalImages", additionalImages[i]);
      }
      try {
        await addVariation(formData).unwrap();
        handleClose();
      } catch (error) {
        console.error("Error adding product", error);
      }
    } catch (error) {
      console.error("Failed to add variation:", error);
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
          maxHeight: "90%",
        }}
      >
        {isError && <Alert severity="error">{error.message}</Alert>}
        {isSuccess && (
          <Alert severity="success">Variation added successfully</Alert>
        )}

        <Typography variant="h6" component="h2">
          Add New Variation
        </Typography>
        <form onSubmit={handleFormSubmit} method="POST">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Variation Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Variation Id"
                value={variationId}
                onChange={(e) => setVariationId(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {/* <TextField
                select
                fullWidth
                margin="normal"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Product</option>
                {products?.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </TextField> */}

              <TextField
                fullWidth
                margin="normal"
                label="Search Product"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Dropdown List */}
              <TextField
                select
                fullWidth
                label="Select Product"
                margin="normal"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <MenuItem value="">Select Product</MenuItem>
                {filteredProducts?.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label="Item pack include Qty"
                type="number"
                value={itemQty}
                onChange={(e) => setItemQty(e.target.value)}
              />
              <FormLabel component="legend">Variation Type</FormLabel>
              <RadioGroup
                row
                value={variationType}
                onChange={(e) => setVariationType(e.target.value)}
              >
                <FormControlLabel
                  value="name"
                  control={<Radio />}
                  label="Product Name"
                />
                <FormControlLabel
                  value="quantity"
                  control={<Radio />}
                  label="Product Quantity"
                />
              </RadioGroup>
            </Grid>

            {/* Price Section */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Price Details</Typography>

              {/* Base Price */}
              <Typography variant="subtitle2">Regular Price</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Base Price"
                name="basePrice"
                type="number"
                value={price.basePrice}
                onChange={(e) => handlePriceChange(e, "price")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="oneDay pre-1st"
                name="oneDayPremium"
                value={price.oneDayPremium}
                type="number"
                onChange={(e) => handlePriceChange(e, "price")}
              />
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="oneDay pre-2nd"
                  name="oneDayPremiumSecondItem"
                  value={price.oneDayPremiumSecondItem}
                  type="number"
                  onChange={(e) => handlePriceChange(e, "price")}
                />
              </Grid>
              <TextField
                fullWidth
                margin="normal"
                label="twoDayPre 1st"
                value={price.twoDayPremium}
                name="twoDayPremium"
                type="number"
                onChange={(e) => handlePriceChange(e, "price")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="TwoDayPre-2nd"
                name="twoDayPremiumSecondItem"
                type="number"
                value={price.twoDayPremiumSecondItem}
                onChange={(e) => handlePriceChange(e, "price")}
              />

              {/* XL Price */}
              {/* <Typography variant="subtitle2">XL Price</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="XL Base Price"
                name="xlBasePrice"
                type="number"
                value={xlPrice.xlBasePrice}
                onChange={(e) => handlePriceChange(e, "xlPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL-1DayPre-1st"
                name="xlOneDayPremium"
                type="number"
                value={xlPrice.xlOneDayPremium}
                onChange={(e) => handlePriceChange(e, "xlPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL-1DayPre-2nd"
                name="xlOneDayPremiumSecondItem"
                value={xlPrice.xlOneDayPremiumSecondItem}
                type="number"
                onChange={(e) => handlePriceChange(e, "xlPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL-2DayPre-1st"
                name="xlTwoDayPremium"
                type="number"
                value={xlPrice.xlTwoDayPremium}
                onChange={(e) => handlePriceChange(e, "xlPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL-2DayPre-2nd"
                name="xlTwoDayPremiumSecondItem"
                type="number"
                value={xlPrice.xlTwoDayPremiumSecondItem}
                onChange={(e) => handlePriceChange(e, "xlPrice")}
              /> */}

              {/* MD Price */}
              {/* <Typography variant="subtitle2">MD Price</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="MD Base Price"
                name="mdBasePrice"
                type="number"
                value={mdPrice.mdBasePrice}
                onChange={(e) => handlePriceChange(e, "mdPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD-1DayPre-1st"
                name="mdOneDayPremium"
                type="number"
                value={mdPrice.mdOneDayPremium}
                onChange={(e) => handlePriceChange(e, "mdPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD-1DayPre-2nd"
                name="mdOneDayPremiumSecondItem"
                type="number"
                value={mdPrice.mdOneDayPremiumSecondItem}
                onChange={(e) => handlePriceChange(e, "mdPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD-2DayPre-1st"
                name="mdTwoDayPremium"
                type="number"
                value={mdPrice.mdTwoDayPremium}
                onChange={(e) => handlePriceChange(e, "mdPrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD-2DayPre-2nd"
                name="mdTwoDayPremiumSecondItem"
                type="number"
                value={mdPrice.mdTwoDayPremiumSecondItem}
                onChange={(e) => handlePriceChange(e, "mdPrice")}
              /> */}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Main Image</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
              />

              <Typography variant="subtitle1">Additional Images</Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default Variation;
