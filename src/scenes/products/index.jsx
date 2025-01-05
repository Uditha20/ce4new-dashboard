import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  TablePagination,
  TextField,
  Grid,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "components/Header";
import AddProductForm from "./AddProductForm";
import { useGetProductsQuery, useUpdateOneProductMutation,useDeleteOneProductMutation } from "state/api";
import EditProduct from "./EditProduct";

const ProductRow = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [updateOneProduct] = useUpdateOneProductMutation();
  const [deleteOneProduct] = useDeleteOneProductMutation();
  const showEditModal = (id) => {
    setCurrentProductId(id);
    setIsEditModalVisible(true);
  };

  const hideEditModal = () => {
    setIsEditModalVisible(false);
    setCurrentProductId(null);
  };

  const activeChange =async (id) => {
    try {
     await updateOneProduct(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const activeDelete = async (id) => {  
    try {
      await deleteOneProduct(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <TableRow>
        <TableCell>{product.category}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.sku}</TableCell>
        <TableCell>{product.price.basePrice}</TableCell>
        <TableCell>
          <Rating value={product.rating} readOnly />
        </TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell>
          <Button variant="contained" size="small" onClick={handleOpenModal}>
            View Details
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => showEditModal(product._id)}
          >
            Edit
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            size="small"
            onClick={() => activeChange(product._id)}
            sx={{
              backgroundColor: product.isActive ? "green" : "yellow",
              color: product.isActive ? "white" : "black",
              "&:hover": {
                backgroundColor: product.isActive ? "darkgreen" : "gold",
              },
            }}
          >
            Active
          </Button>
        </TableCell>
        <TableCell>
          <Button variant="contained" size="small" onClick={()=>activeDelete(product._id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <Modal open={isEditModalVisible} onClose={hideEditModal}>
        <Box
          sx={{
            width: 1200,
            margin: "auto",
            mt: 5,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          <EditProduct id={currentProductId} />
        </Box>
      </Modal>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            {product.name}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Basic Information</Typography>
              <Typography>SKU: {product.sku}</Typography>
              <Typography>Category: {product.category}</Typography>
              <Typography>color: {product.colour}</Typography>

              <Typography>Material: {product.material}</Typography>
              <Typography>Style: {product.style}</Typography>
              <Typography>Shape: {product.shape}</Typography>
              <Typography>Type: {product.itemType}</Typography>
              <Typography>Indoor/Outdoor: {product.indoorOutdoor}</Typography>
              <Typography>Handmade: {product.handmade}</Typography>
              <Typography>New: {product.isNew ? "Yes" : "No"}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">Pricing</Typography>
              <Typography>Base Price: {product.price.basePrice}</Typography>
              <Typography>
                1 Day Premium: {product.price.oneDayPremium}
              </Typography>
              <Typography>
                2 Day Premium: {product.price.twoDayPremium}
              </Typography>
              <Typography>
                XL Base Price: {product.xlPrice.xlBasePrice}
              </Typography>
              <Typography>
                MD Base Price: {product.mdPrice.mdBasePrice}
              </Typography>
              <Typography>Discount: {product.discount}%</Typography>
              <Typography>
                Offer Ends: {new Date(product.offerEnd).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Multiple selections</Typography>
              <Typography>sutable for use: {product.department}</Typography>
              <Typography>Features: {product.features}</Typography>

              <Typography>Occasion: {product.occasion}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Dimensions & Weight</Typography>
              <Typography>
                Width: {product.dimensions && product.dimensions.dwidth}
              </Typography>
              <Typography>
                Height: {product.dimensions && product.dimensions.dheight}
              </Typography>
              <Typography>
                Length: {product.dimensions && product.dimensions.dlength}
              </Typography>
              <Typography>Weight: {product.weight}</Typography>
              <Typography>
                Capacity: {product.capacity} {product.capacityMeasure}
              </Typography>
              <Typography>Unit Quantity: {product.unitQuantity}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">Related Parts</Typography>
              <Typography>
                Part Name: {product.itemRelatedParts.partName}
              </Typography>
              <Typography>Width: {product.itemRelatedParts.width}</Typography>
              <Typography>Height: {product.itemRelatedParts.height}</Typography>
              <Typography>Length: {product.itemRelatedParts.length}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Description</Typography>
              <Typography
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
              <Typography
                dangerouslySetInnerHTML={{ __html: product.fullDescription }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Features</Typography>
              {product.features.map((feature, index) => (
                <Chip key={index} label={feature} sx={{ m: 0.5 }} />
              ))}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Images</Typography>
              {product.mainImage && (
                <img
                  src={`${baseUrl}/${product.mainImage}`}
                  alt="Main"
                  style={{ width: "100%", maxWidth: 300, marginBottom: "1rem" }}
                />
              )}
              <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                {product.additionalImages.map((image, index) => (
                  <img
                    key={index}
                    src={`${baseUrl}/${image}`}
                    alt={`Additional ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Additional Information</Typography>
              <Typography>
                Rating: <Rating value={product.rating} readOnly />
              </Typography>
              <Typography>Sale Count: {product.saleCount}</Typography>
              <Typography>Stock: {product.stock}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

const Products = () => {
  const { data = [], isLoading, error } = useGetProductsQuery();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (error && error.status === 401) {
      navigate("/");
    }
  }, [error, navigate]);

  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
      <Button variant="contained" onClick={handleOpenAddProduct}>
        Add Product
      </Button>
      <AddProductForm
        open={isAddProductOpen}
        handleClose={handleCloseAddProduct}
      />

      {filteredData.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          {/* <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <ProductRow key={product._id} product={product} />
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <Typography>No products found</Typography>
      )}
    </Box>
  );
};

export default Products;
