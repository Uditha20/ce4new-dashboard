import React, { useState } from "react";
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
} from "@mui/material";
import { useAddProductMutation, useGetCategoryQuery } from "state/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const AddProductForm = ({ open, handleClose }) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [offerEnd, setOfferEnd] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [rating, setRating] = useState("");
  const [saleCount, setSaleCount] = useState("");
  // const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [stock, setStock] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [capacityMeasure, setCapcityMeasure] = useState("");
  const [colour, setColour] = useState("");
  const [itemType, setItemType] = useState("");
  const [features, setFeatures] = useState([]);
  const [department, setDepartment] = useState([]);
  const [shape, setShape] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [originalReproduction, setOriginalReproduction] = useState("");
  const [handmade, setHandmade] = useState("");
  const [unitQuantity, setUnitQuantity] = useState("");
  const [productId, setProductId] = useState("");
  const [style, setStyle] = useState("");
  const [occasion, setOccasion] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

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
  const [itemRelatedParts, setItemRelatedParts] = useState({
    partName: "",
    width: "",
    height: "",
    length: "",
  });

  const [dimensions, setDimensions] = useState({
    dwidth: "",
    dheight: "",
    dlength: "",
  });

  const [addProduct, { isLoading, isSuccess, isError, error }] =
    useAddProductMutation();

  const { data: categories = [], isLoading: isCategoryLoading } =
    useGetCategoryQuery();

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

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

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages(e.target.files);
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("sku", sku);
    formData.append("name", name);
    formData.append("discount", discount);
    formData.append("offerEnd", offerEnd);
    formData.append("new", isNew);
    formData.append("rating", rating);
    formData.append("saleCount", saleCount);
    formData.append("tag", tag);
    formData.append("stock", stock);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);

    // Append new fields to formData
    formData.append("material", material);
    formData.append("weight", weight);
    formData.append("capacity", capacity);
    formData.append("capacityMeasure", capacityMeasure);
    formData.append("colour", colour);
    formData.append("itemType", itemType);
    formData.append("features", features);
    formData.append("department", department);
    formData.append("shape", shape);
    formData.append("indoorOutdoor", indoorOutdoor);
    formData.append("originalReproduction", originalReproduction);
    formData.append("handmade", handmade);
    formData.append("unitQuantity", unitQuantity);
    formData.append("productId", productId);
    formData.append("style", style);
    formData.append("occasion", occasion);
    formData.append("category", selectedCategory);
    formData.append("price", JSON.stringify(price));
    formData.append("xlPrice", JSON.stringify(xlPrice));
    formData.append("mdPrice", JSON.stringify(mdPrice));
    formData.append("itemRelatedParts", JSON.stringify(itemRelatedParts));
    formData.append("dimensions", JSON.stringify(dimensions));

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    for (let i = 0; i < additionalImages.length; i++) {
      formData.append("additionalImages", additionalImages[i]);
    }

    try {
      await addProduct(formData).unwrap(); // Add the product
      setLoading(false); // Stop the spinner after success
      handleClose(); // Close modal after successful submission
    } catch (error) {
      setLoading(false); // Stop the spinner in case of an error
      console.error("Error adding product", error);
    }
  };
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
          <Alert severity="success">Product added successfully</Alert>
        )}
        {loading && <CircularProgress />}

        <Typography variant="h6" component="h2">
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Left Side */}
            <Grid item xs={12} sm={6} md={3}>
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
                required
              />

              <TextField
                fullWidth
                margin="normal"
                label="Material"
                value={material}
                required
                onChange={(e) => setMaterial(e.target.value)}
              />
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
                label="XL Base Price"
                name="xlBasePrice"
                type="number"
                value={xlPrice.xlBasePrice}
                onChange={(e) => handlePriceChange(e, "xlPrice")}
              />
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
                label="Weight"
                required
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Additional Part Name"
                value={itemRelatedParts.partName}
                onChange={(e) =>
                  setItemRelatedParts({
                    ...itemRelatedParts,
                    partName: e.target.value,
                  })
                }
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
                    onChange={handleMainImageChange}
                  />
                </Button>
              </Grid>
            </Grid>

            {/* Middle Left */}
            <Grid item xs={12} sm={6} md={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Measure"
                    value={capacityMeasure}
                    onChange={(e) => setCapcityMeasure(e.target.value)}
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
                label="Colour"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Item Type"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="oneDay pre-1st"
                    name="oneDayPremium"
                    value={price.oneDayPremium}
                    type="number"
                    onChange={(e) => handlePriceChange(e, "price")}
                  />
                </Grid>
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
              </Grid>

              {/* xl premium */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="XL-1DayPre-1st"
                    name="xlOneDayPremium"
                    type="number"
                    value={xlPrice.xlOneDayPremium}
                    onChange={(e) => handlePriceChange(e, "xlPrice")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="XL-1DayPre-2nd"
                    name="xlOneDayPremiumSecondItem"
                    value={xlPrice.xlOneDayPremiumSecondItem}
                    type="number"
                    onChange={(e) => handlePriceChange(e, "xlPrice")}
                  />
                </Grid>
              </Grid>

              {/* medium price */}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="MD-1DayPre-1st"
                    name="mdOneDayPremium"
                    type="number"
                    value={mdPrice.mdOneDayPremium}
                    onChange={(e) => handlePriceChange(e, "mdPrice")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="MD-1DayPre-2nd"
                    name="mdOneDayPremiumSecondItem"
                    type="number"
                    value={mdPrice.mdOneDayPremiumSecondItem}
                    onChange={(e) => handlePriceChange(e, "mdPrice")}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth margin="normal">
                <InputLabel>Features</InputLabel>
                <Select
                  label="Features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
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
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
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

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Height"
                    value={itemRelatedParts.height}
                    onChange={(e) =>
                      setItemRelatedParts({
                        ...itemRelatedParts,
                        height: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Width"
                    value={itemRelatedParts.width}
                    onChange={(e) =>
                      setItemRelatedParts({
                        ...itemRelatedParts,
                        width: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Length"
                    value={itemRelatedParts.length}
                    onChange={(e) =>
                      setItemRelatedParts({
                        ...itemRelatedParts,
                        length: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 1 }}
              >
                Upload Additional Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleAdditionalImagesChange}
                />
              </Button>
            </Grid>

            {/* Middle Right */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Indoor/Outdoor"
                value={indoorOutdoor}
                onChange={(e) => setIndoorOutdoor(e.target.value)}
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
                value={originalReproduction}
                onChange={(e) => setOriginalReproduction(e.target.value)}
                select
              >
                <MenuItem value="Original">Original</MenuItem>
                <MenuItem value="Reproduction">Reproduction</MenuItem>
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label="Handmade or Machine Made"
                value={handmade}
                onChange={(e) => setHandmade(e.target.value)}
                select
              >
                <MenuItem value="Handmade">Handmade</MenuItem>
                <MenuItem value="Machine Made">Machine Made</MenuItem>
              </TextField>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="twoDayPre 1st"
                    value={price.twoDayPremium}
                    name="twoDayPremium"
                    type="number"
                    onChange={(e) => handlePriceChange(e, "price")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="twoDayPre 2nd"
                    value={price.twoDayPremiumSecondItem}
                    name="twoDayPremiumSecondItem"
                    type="number"
                    onChange={(e) => handlePriceChange(e, "price")}
                  />
                </Grid>
              </Grid>

              {/* xl premium */}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="XL-2DayPre-1st"
                    name="xlTwoDayPremium"
                    type="number"
                    value={xlPrice.xlTwoDayPremium}
                    onChange={(e) => handlePriceChange(e, "xlPrice")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="XL-2DayPre-2nd"
                    name="xlTwoDayPremiumSecondItem"
                    type="number"
                    value={xlPrice.xlTwoDayPremiumSecondItem}
                    onChange={(e) => handlePriceChange(e, "xlPrice")}
                  />
                </Grid>
              </Grid>

              {/* medium price */}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="MD-2DayPre-1st"
                    name="mdTwoDayPremium"
                    type="number"
                    value={mdPrice.mdTwoDayPremium}
                    onChange={(e) => handlePriceChange(e, "mdPrice")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="MD-2DayPre-2nd"
                    name="mdTwoDayPremiumSecondItem"
                    type="number"
                    value={mdPrice.mdTwoDayPremiumSecondItem}
                    onChange={(e) => handlePriceChange(e, "mdPrice")}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                margin="normal"
                label="Unit Quantity"
                required
                type="number"
                value={unitQuantity}
                onChange={(e) => setUnitQuantity(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} sm={6} md={3}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Height"
                    name="dheight"
                    value={dimensions.dheight}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        dheight: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Width"
                    name="dwidht"
                    value={dimensions.dwidth}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        dwidth: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="length"
                    name="dlength"
                    value={dimensions.dlength}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        dlength: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                margin="normal"
                label="Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
                type="number"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Offer End"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={offerEnd}
                onChange={(e) => setOfferEnd(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Rating"
                value={rating}
                type="number"
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
                label="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  onChange={handleCategoryChange}
                  fullWidth

                >
                  {categories.map((category) => (
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
                value={productId}
                required
                onChange={(e) => setProductId(e.target.value)}
              />
              <InputLabel>Occasion</InputLabel>
              <Select
                fullWidth
                margin="normal"
                label="Occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
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
            </Grid>
          </Grid>
          <p>short Description</p>
          <ReactQuill
            value={shortDescription}
            onChange={setShortDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Enter short description"
          />
          <p>full Description</p>
          <ReactQuill
            value={fullDescription}
            onChange={setFullDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Enter full description"
            style={{ color: "white" }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Product
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductForm;
