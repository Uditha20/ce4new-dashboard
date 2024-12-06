import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
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
  const [variationData, setVariationData] = useState({
    name: "",
    quantity: "",
    itemQty: "",
    productId: "",
    price: {
      basePrice: "",
      oneDayPremium: "",
      oneDayPremiumSecondItem: "",
      twoDayPremium: "",
      twoDayPremiumSecondItem: "",
    },
    xlPrice: {
      xlBasePrice: "",
      xlOneDayPremium: "",
      xlOneDayPremiumSecondItem: "",
      xlTwoDayPremium: "",
      xlTwoDayPremiumSecondItem: "",
    },
    mdPrice: {
      mdBasePrice: "",
      mdOneDayPremium: "",
      mdOneDayPremiumSecondItem: "",
      mdTwoDayPremium: "",
      mdTwoDayPremiumSecondItem: "",
    },
    mainImage: "",
    additionalImages: [],
  });

  const { data: products, isLoading: isProductsLoading } =
    useGetProductsQuery();
  const [addVariation, { isLoading: isVariantsLoading }] =
    useAddVariationMutation();

  const handleInputChange = (e, priceType, key) => {
    setVariationData({
      ...variationData,
      [priceType]: {
        ...variationData[priceType],
        [key]: e.target.value,
      },
    });
  };

  const handleImageChange = (e) => {
    setVariationData({
      ...variationData,
      mainImage: e.target.files[0],
    });
  };

  const handleAdditionalImagesChange = (e) => {
    setVariationData({
      ...variationData,
      additionalImages: [...e.target.files],
    });
  };

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", variationData.name);
      formData.append("quantity", variationData.quantity);
      formData.append("productId", variationData.productId);
      formData.append("itemQty", variationData.itemQty);
      formData.append("price", JSON.stringify(variationData.price));
      formData.append("xlPrice", JSON.stringify(variationData.xlPrice));
      formData.append("mdPrice", JSON.stringify(variationData.mdPrice));

      // Add images to formData
      if (variationData.mainImage) {
        formData.append("mainImage", variationData.mainImage);
      }

      variationData.additionalImages.forEach((image) => {
        formData.append("additionalImages", image);
      });

      await addVariation(formData).unwrap();
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
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Variation Name"
                value={variationData.name}
                onChange={(e) =>
                  setVariationData({ ...variationData, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                type="number"
                value={variationData.quantity}
                onChange={(e) =>
                  setVariationData({
                    ...variationData,
                    quantity: e.target.value,
                  })
                }
              />
              <TextField
                select
                fullWidth
                margin="normal"
                value={variationData.productId}
                onChange={(e) =>
                  setVariationData({
                    ...variationData,
                    productId: e.target.value,
                  })
                }
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
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label="Item pack include Qty"
                type="number"
                value={variationData.itemQty}
                onChange={(e) =>
                  setVariationData({
                    ...variationData,
                    itemQty: e.target.value,
                  })
                }
              />
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
                type="number"
                value={variationData.price.basePrice}
                onChange={(e) => handleInputChange(e, "price", "basePrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="One Day Premium"
                type="number"
                value={variationData.price.oneDayPremium}
                onChange={(e) => handleInputChange(e, "price", "oneDayPremium")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="One Day Premium Second Item"
                type="number"
                value={variationData.price.oneDayPremiumSecondItem}
                onChange={(e) =>
                  handleInputChange(e, "price", "oneDayPremiumSecondItem")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Two Day Premium"
                type="number"
                value={variationData.price.twoDayPremium}
                onChange={(e) => handleInputChange(e, "price", "twoDayPremium")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Two Day Premium Second Item"
                type="number"
                value={variationData.price.twoDayPremiumSecondItem}
                onChange={(e) =>
                  handleInputChange(e, "price", "twoDayPremiumSecondItem")
                }
              />

              {/* XL Price */}
              <Typography variant="subtitle2">XL Price</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="XL Base Price"
                type="number"
                value={variationData.xlPrice.xlBasePrice}
                onChange={(e) => handleInputChange(e, "xlPrice", "xlBasePrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL One Day Premium"
                type="number"
                value={variationData.xlPrice.xlOneDayPremium}
                onChange={(e) =>
                  handleInputChange(e, "xlPrice", "xlOneDayPremium")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL One Day Premium Second Item"
                type="number"
                value={variationData.xlPrice.xlOneDayPremiumSecondItem}
                onChange={(e) =>
                  handleInputChange(e, "xlPrice", "xlOneDayPremiumSecondItem")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL Two Day Premium"
                type="number"
                value={variationData.xlPrice.xlTwoDayPremium}
                onChange={(e) =>
                  handleInputChange(e, "xlPrice", "xlTwoDayPremium")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="XL Two Day Premium Second Item"
                type="number"
                value={variationData.xlPrice.xlTwoDayPremiumSecondItem}
                onChange={(e) =>
                  handleInputChange(e, "xlPrice", "xlTwoDayPremiumSecondItem")
                }
              />

              {/* MD Price */}
              <Typography variant="subtitle2">MD Price</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="MD Base Price"
                type="number"
                value={variationData.mdPrice.mdBasePrice}
                onChange={(e) => handleInputChange(e, "mdPrice", "mdBasePrice")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD One Day Premium"
                type="number"
                value={variationData.mdPrice.mdOneDayPremium}
                onChange={(e) =>
                  handleInputChange(e, "mdPrice", "mdOneDayPremium")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD One Day Premium Second Item"
                type="number"
                value={variationData.mdPrice.mdOneDayPremiumSecondItem}
                onChange={(e) =>
                  handleInputChange(e, "mdPrice", "mdOneDayPremiumSecondItem")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD Two Day Premium"
                type="number"
                value={variationData.mdPrice.mdTwoDayPremium}
                onChange={(e) =>
                  handleInputChange(e, "mdPrice", "mdTwoDayPremium")
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="MD Two Day Premium Second Item"
                type="number"
                value={variationData.mdPrice.mdTwoDayPremiumSecondItem}
                onChange={(e) =>
                  handleInputChange(e, "mdPrice", "mdTwoDayPremiumSecondItem")
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Main Image</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
