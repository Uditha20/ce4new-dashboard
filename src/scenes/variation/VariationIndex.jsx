import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Modal, // Import Modal
} from "@mui/material";
import Header from "components/Header";
import VariationFrom from "./Variation";
import {
  useGetVariationQuery,
  useGetProductsQuery,
  useEditVariationMutation,
  useUpdateOneVariationMutation,
  useUpdateIsActiveMutation,
} from "../../state/api";
function VariationIndex() {
  const [productId, setProductId] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { data, isLoading } = useGetVariationQuery();
  const { data: products, isLoading: isProductsLoading } =
    useGetProductsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useEditVariationMutation();
  const [updateOneProduct] = useUpdateOneVariationMutation();

  const filteredVariations = Array.isArray(data)
    ? data.filter((item) => item.productId?._id === productId)
    : [];
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [updateProductIsActive] = useUpdateIsActiveMutation();

  // State to control image modal
  const [openImageModal, setOpenImageModal] = useState(false);
  const [variationId, setVariationId] = useState();
  const [selectedImages, setSelectedImages] = useState([]);

  const handleOpenImageModal = (mainImage, additionalImages) => {
    setSelectedImages([mainImage, ...additionalImages]);
    setOpenImageModal(true);
  };
  // console.log(selectedImages)
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImages([]);
  };
  const handleOpenEditProduct = (variation) => {
    setSelectedVariation(variation);
    setVariationId(variation._id);

    setIsEditProductOpen(true);
  };

  const handleCloseEditProduct = () => {
    setIsEditProductOpen(false);
    setSelectedVariation(null);
  };

  const handleDelete = async (variation) => {
    try {
      await updateOneProduct(variation._id).unwrap();

      alert("Variation deleted successfully!");
    } catch (error) {
      console.error("Failed to delete variation:", error);
      alert("Failed to delete variation. Please try again.");
    }
  };

  const handleIsActive = async (variation) => {
    try {
      await updateProductIsActive(variation._id).unwrap();
      alert("Variation is active now!");
    } catch (error) {
      console.error("Failed to active variation:", error);
      alert("Failed to active variation. Please try again.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview URL
        setSelectedVariation((prev) => ({
          ...prev,
          mainImage: file, // Store the actual file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append text fields
    formData.append("name", selectedVariation?.name || "");
    formData.append("quantity", selectedVariation?.quantity || "");
    formData.append("price", JSON.stringify(selectedVariation.price));
    formData.append("itemQty", selectedVariation?.itemQty || "");
    if (selectedVariation?.mainImage) {
      formData.append("mainImage", selectedVariation.mainImage);
    }

    // console.log(variationId)
    // Append image if available
    try {
      await updateProduct({ id: variationId, formData }).unwrap();
      alert("Variation added successfully!");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Header title="Variation" subtitle="See your list of products." />
      <Button variant="contained" onClick={handleOpenAddProduct}>
        Add Variation
      </Button>
      <VariationFrom
        open={isAddProductOpen}
        handleClose={handleCloseAddProduct}
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Variation</Typography>

        <TextField
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
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
        </TextField>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>variation Name</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Item Include Qty</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>One Day Premium</TableCell>
                <TableCell>Two Day Premium</TableCell>
                {/* <TableCell>Base Price (XL)</TableCell>
                  <TableCell>One Day Premium (XL)</TableCell>
                  <TableCell>Two Day Premium (XL)</TableCell>
                  <TableCell>Base Price (MD)</TableCell>
                  <TableCell>One Day Premium (MD)</TableCell>
                  <TableCell>Two Day Premium (MD)</TableCell> */}
                <TableCell>View Image</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVariations.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.productId.name}</TableCell>
                  <TableCell>{item.quantity || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.itemQty || "N/A"}</TableCell>
                  {/* Base Price for Standard */}
                  <TableCell>{item.price?.basePrice || "N/A"}</TableCell>
                  <TableCell>{item.price?.oneDayPremium || "N/A"}</TableCell>
                  <TableCell>{item.price?.twoDayPremium || "N/A"}</TableCell>
                  {/* XL Price Details */}
                  {/* <TableCell>{item.xlPrice?.xlBasePrice || "N/A"}</TableCell>
                    <TableCell>{item.xlPrice?.xlOneDayPremium || "N/A"}</TableCell>
                    <TableCell>{item.xlPrice?.xlTwoDayPremium || "N/A"}</TableCell> */}
                  {/* MD Price Details */}
                  {/* <TableCell>{item.mdPrice?.mdBasePrice || "N/A"}</TableCell>
                    <TableCell>{item.mdPrice?.mdOneDayPremium || "N/A"}</TableCell>
                    <TableCell>{item.mdPrice?.mdTwoDayPremium || "N/A"}</TableCell> */}

                  {/* View Image Button */}
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleOpenImageModal(
                          item.mainImage,
                          item.additionalImages
                        )
                      }
                    >
                      View Images
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenEditProduct(item)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this?"
                        );
                        if (confirmDelete) {
                          handleDelete(item);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleIsActive(item)}
                    >
                      {item.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={isEditProductOpen}
          onClose={handleCloseEditProduct}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box
            sx={{
              p: 4,
              backgroundColor: "gray",
              margin: "auto",
              maxWidth: 500,
              borderRadius: 2,
            }}
          >
            <Typography id="edit-modal-title" variant="h6" component="h2">
              Edit Variation
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Variation Name"
                fullWidth
                margin="normal"
                value={selectedVariation?.name || ""}
                onChange={(e) =>
                  setSelectedVariation({
                    ...selectedVariation,
                    name: e.target.value,
                  })
                }
              />
              <TextField
                label="Quantity"
                fullWidth
                margin="normal"
                type="number"
                value={selectedVariation?.quantity || ""}
                onChange={(e) =>
                  setSelectedVariation({
                    ...selectedVariation,
                    quantity: e.target.value,
                  })
                }
              />
              <TextField
                label="Base Price"
                fullWidth
                margin="normal"
                type="number"
                value={selectedVariation?.price?.basePrice || ""}
                onChange={(e) =>
                  setSelectedVariation({
                    ...selectedVariation,
                    price: {
                      ...selectedVariation.price,
                      basePrice: e.target.value,
                    },
                  })
                }
              />
              <TextField
                label="One Day Premium"
                fullWidth
                margin="normal"
                type="number"
                value={selectedVariation?.price?.oneDayPremium || ""}
                onChange={(e) =>
                  setSelectedVariation({
                    ...selectedVariation,
                    price: {
                      ...selectedVariation.price,
                      oneDayPremium: e.target.value,
                    },
                  })
                }
              />
              <TextField
                label="Two Day Premium"
                fullWidth
                margin="normal"
                type="number"
                value={selectedVariation?.price?.twoDayPremium || ""}
                onChange={(e) =>
                  setSelectedVariation({
                    ...selectedVariation,
                    price: {
                      ...selectedVariation.price,
                      twoDayPremium: e.target.value,
                    },
                  })
                }
              />
              <TextField
                label="Item Include Qty"
                fullWidth
                margin="normal"
                type="number"
                value={selectedVariation?.itemQty || ""}
                onChange={(e) =>
                  setSelectedVariation({
                    ...selectedVariation,
                    itemQty: e.target.value,
                  })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ margin: "10px 0" }}
              />
              {/* Display Main Image Preview */}
              {selectedVariation?.mainImage?.preview && (
                <img
                  src={selectedVariation.mainImage.preview}
                  alt="Main Variation Preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    marginTop: "10px",
                  }}
                />
              )}
              {/* Add more fields as necessary */}
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
              <Button onClick={handleCloseEditProduct}>Cancel</Button>
            </form>
          </Box>
        </Modal>

        {/* Modal for displaying images */}
        <Modal
          open={openImageModal}
          onClose={handleCloseImageModal}
          aria-labelledby="image-modal-title"
          aria-describedby="image-modal-description"
        >
          <Box
            sx={{
              p: 4,
              backgroundColor: "white",
              margin: "auto",
              maxWidth: 500,
              overflow: "auto", // in case images are large
              borderRadius: 2,
            }}
          >
            <Typography id="image-modal-title" variant="h6" component="h2">
              Product Images
            </Typography>
            {selectedImages.map((image, index) => (
              <img
                src={`${baseUrl}/${image.replace(/\\/g, "/")}`}
                alt={`Product image ${index + 1}`}
                style={{ width: "30%" }}
              />
            ))}
            <Button onClick={handleCloseImageModal}>Close</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default VariationIndex;
