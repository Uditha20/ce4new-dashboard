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
  Paper,
  Modal, // Import Modal
} from "@mui/material";
import Header from "components/Header";
import VariationFrom from "./Variation";
import { useGetVariationQuery } from "../../state/api";

const Variation = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { data, isLoading } = useGetVariationQuery();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);

  // State to control image modal
  const [openImageModal, setOpenImageModal] = useState(false);
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

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Item Include Qty</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>One Day Premium</TableCell>
                <TableCell>Two Day Premium</TableCell>
                <TableCell>Base Price (XL)</TableCell>
                <TableCell>One Day Premium (XL)</TableCell>
                <TableCell>Two Day Premium (XL)</TableCell>
                <TableCell>Base Price (MD)</TableCell>
                <TableCell>One Day Premium (MD)</TableCell>
                <TableCell>Two Day Premium (MD)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity || "N/A"}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{item.itemQty || "N/A"}</TableCell>
                  {/* Base Price for Standard */}
                  <TableCell>{item.price?.basePrice || "N/A"}</TableCell>
                  <TableCell>{item.price?.oneDayPremium || "N/A"}</TableCell>
                  <TableCell>{item.price?.twoDayPremium || "N/A"}</TableCell>
                  {/* XL Price Details */}
                  <TableCell>{item.xlPrice?.xlBasePrice || "N/A"}</TableCell>
                  <TableCell>{item.xlPrice?.xlOneDayPremium || "N/A"}</TableCell>
                  <TableCell>{item.xlPrice?.xlTwoDayPremium || "N/A"}</TableCell>
                  {/* MD Price Details */}
                  <TableCell>{item.mdPrice?.mdBasePrice || "N/A"}</TableCell>
                  <TableCell>{item.mdPrice?.mdOneDayPremium || "N/A"}</TableCell>
                  <TableCell>{item.mdPrice?.mdTwoDayPremium || "N/A"}</TableCell>
                  
                  {/* View Image Button */}
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenImageModal(item.mainImage, item.additionalImages)}
                    >
                      View Images
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for displaying images */}
        <Modal
          open={openImageModal}
          onClose={handleCloseImageModal}
          aria-labelledby="image-modal-title"
          aria-describedby="image-modal-description"
        >
          <Box sx={{
            p: 4,
            backgroundColor: 'white',
            margin: 'auto',
            maxWidth: 500,
            overflow: 'auto',  // in case images are large
            borderRadius: 2
          }}>
            <Typography id="image-modal-title" variant="h6" component="h2">
              Product Images
            </Typography>
            {selectedImages.map((image, index) => (
              <img
              src={`${baseUrl}/${image.replace(/\\/g, "/")}`} 
              alt={`Product image ${index + 1}`}
              style={{ width: '30%' }}
            />
            ))}
            <Button onClick={handleCloseImageModal}>Close</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Variation;
