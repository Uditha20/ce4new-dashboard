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
  Modal,
  MenuItem,
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
  const [updateProductIsActive] = useUpdateIsActiveMutation();

  const filteredVariations = Array.isArray(data)
    ? data.filter((item) => item.productId?._id === productId)
    : [];

  // State to handle the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);

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

  if (isLoading || isProductsLoading)
    return <Typography>Loading...</Typography>;

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
          fullWidth
          margin="normal"
          label="Search Product"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Search Input for Product */}
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

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Variation Name</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Item Include Qty</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>One Day Premium</TableCell>
                <TableCell>Two Day Premium</TableCell>
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
                  <TableCell>{item.price?.basePrice || "N/A"}</TableCell>
                  <TableCell>{item.price?.oneDayPremium || "N/A"}</TableCell>
                  <TableCell>{item.price?.twoDayPremium || "N/A"}</TableCell>
                  <TableCell>
                    <Button variant="outlined">View Images</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined">Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleDelete(item)}
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
      </Box>
    </Box>
  );
}

export default VariationIndex;
