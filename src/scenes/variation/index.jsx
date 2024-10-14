import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Header from "components/Header";
import VariationFrom from "./Variation";
import { useGetVariationQuery } from "../../state/api";

const Variation = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { data, isLoading } = useGetVariationQuery();

  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Header title="Variation" subtitle="See your list of products." />
      <Button variant="contained" onClick={handleOpenAddProduct}>
        Add Variation
      </Button>
      <VariationFrom open={isAddProductOpen} handleClose={handleCloseAddProduct} />
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Variation</Typography>
        <Typography variant="body2">
          This is the variation page. You can view all the variations here.
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Product ID</TableCell>
               
                <TableCell>Base Price</TableCell>
                <TableCell>One Day Premium Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.productId}</TableCell>
                  
                  <TableCell>
                    {item.price ? item.price.basePrice : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.price ? item.price.oneDayPremium : "N/A"}
                  </TableCell>
                  <TableCell>{item.quantity || "N/A"}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Variation;
