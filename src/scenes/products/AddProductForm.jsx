import React, { useState } from "react";
import {
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
} from "@mui/material";
import { useAddProductMutation, useGetDeliveryCostQuery } from "state/api";

const AddProductForm = ({ open, handleClose }) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [offerEnd, setOfferEnd] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [rating, setRating] = useState("");
  const [saleCount, setSaleCount] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [stock, setStock] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState("");

  // New Fields
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [colour, setColour] = useState("");
  const [itemType, setItemType] = useState("");
  const [features, setFeatures] = useState("");
  const [department, setDepartment] = useState("");
  const [shape, setShape] = useState("");
  const [countryOfManufacture, setCountryOfManufacture] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [originalReproduction, setOriginalReproduction] = useState("");
  const [handmade, setHandmade] = useState("");
  const [unitQuantity, setUnitQuantity] = useState("");
  const [productId, setProductId] = useState("");
  const [style, setStyle] = useState("");
  const [occasion, setOccasion] = useState("");

  const { data: deliveryCosts = [], isLoading: isDeliveryCostLoading } =
    useGetDeliveryCostQuery();
  const [addProduct, { isLoading, isSuccess, isError, error }] =
    useAddProductMutation();

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("sku", sku);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("offerEnd", offerEnd);
    formData.append("new", isNew);
    formData.append("rating", rating);
    formData.append("saleCount", saleCount);
    formData.append("category", category);
    formData.append("tag", tag);
    formData.append("stock", stock);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    formData.append("deliveryCost", deliveryCost);

    // Append new fields to formData
    formData.append("brand", brand);
    formData.append("condition", condition);
    formData.append("material", material);
    formData.append("size", size);
    formData.append("weight", weight);
    formData.append("capacity", capacity);
    formData.append("colour", colour);
    formData.append("itemType", itemType);
    formData.append("features", features);
    formData.append("department", department);
    formData.append("shape", shape);
    formData.append("countryOfManufacture", countryOfManufacture);
    formData.append("indoorOutdoor", indoorOutdoor);
    formData.append("originalReproduction", originalReproduction);
    formData.append("handmade", handmade);
    formData.append("unitQuantity", unitQuantity);
    formData.append("productId", productId);
    formData.append("style", style);
    formData.append("occasion", occasion);

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    for (let i = 0; i < additionalImages.length; i++) {
      formData.append("additionalImages", additionalImages[i]);
    }

    await addProduct(formData);
    handleClose();
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
        }}
      >
        <Typography variant="h6" component="h2">
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Left Side */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth margin="normal" label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
              <TextField fullWidth margin="normal" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField fullWidth margin="normal" label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
              <TextField fullWidth margin="normal" label="Condition" value={condition} onChange={(e) => setCondition(e.target.value)} />
              <TextField fullWidth margin="normal" label="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
              <TextField fullWidth margin="normal" label="Size" value={size} onChange={(e) => setSize(e.target.value)} />
              <TextField fullWidth margin="normal" label="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <Grid item xs={6} sm={3} md={3}>
              <Button variant="contained" component="label">
                Upload Main Image
                <input type="file" hidden accept="image/*" onChange={handleMainImageChange} />
              </Button>

              <Button variant="contained" component="label" sx={{ mt: 2,mb:3}}>
                Upload Additional Images
                <input type="file" hidden multiple accept="image/*" onChange={handleAdditionalImagesChange} />
              </Button>
            </Grid>

            </Grid>

            {/* Middle Left */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth margin="normal" label="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <TextField fullWidth margin="normal" label="Colour" value={colour} onChange={(e) => setColour(e.target.value)} />
              <TextField fullWidth margin="normal" label="Item Type" value={itemType} onChange={(e) => setItemType(e.target.value)} />
              <TextField fullWidth margin="normal" label="Features" value={features} onChange={(e) => setFeatures(e.target.value)} />
              <TextField fullWidth margin="normal" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
              <TextField fullWidth margin="normal" label="Shape" value={shape} onChange={(e) => setShape(e.target.value)} />
              <TextField fullWidth margin="normal" label="Country of Manufacture" value={countryOfManufacture} onChange={(e) => setCountryOfManufacture(e.target.value)} />
            </Grid>

            {/* Middle Right */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth margin="normal" label="Indoor/Outdoor" value={indoorOutdoor} onChange={(e) => setIndoorOutdoor(e.target.value)} />
              <TextField fullWidth margin="normal" label="Original/Reproduction" value={originalReproduction} onChange={(e) => setOriginalReproduction(e.target.value)} />
              <TextField fullWidth margin="normal" label="Handmade" value={handmade} onChange={(e) => setHandmade(e.target.value)} />
              <TextField fullWidth margin="normal" label="Unit Quantity" value={unitQuantity} onChange={(e) => setUnitQuantity(e.target.value)} />
              <TextField fullWidth margin="normal" label="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
              <TextField fullWidth margin="normal" label="Style" value={style} onChange={(e) => setStyle(e.target.value)} />
              <TextField fullWidth margin="normal" label="Occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} />
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth margin="normal" label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
              <TextField fullWidth margin="normal" label="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              <TextField fullWidth margin="normal" label="Offer End" type="date" InputLabelProps={{ shrink: true }} value={offerEnd} onChange={(e) => setOfferEnd(e.target.value)} />
              <TextField fullWidth margin="normal" label="Rating" value={rating} onChange={(e) => setRating(e.target.value)} />
              <TextField fullWidth margin="normal" label="Sale Count" value={saleCount} onChange={(e) => setSaleCount(e.target.value)} />
              <TextField fullWidth margin="normal" label="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <MenuItem value="Shoes">Shoes</MenuItem>
                  <MenuItem value="T-shirts">T-shirts</MenuItem>
                  <MenuItem value="Pants">Pants</MenuItem>
                  <MenuItem value="Hoodie">Hoodie</MenuItem>
                  <MenuItem value="Outer">Outer</MenuItem>
                  <MenuItem value="Jackets">Jackets</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="primary">
            Add Product
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductForm;
