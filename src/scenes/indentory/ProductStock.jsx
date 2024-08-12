import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";
import { useGetProductsQuery } from "state/api";

function ProductStock() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box m="2.5rem 2.5rem">
   
    <TableContainer component={Paper} style={{ backgroundColor: "#21295c" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "#ffffff" }}>Name</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Price</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Discount</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Stock</TableCell>
            <TableCell style={{ color: "#ffffff" }}>SaleCount</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Available Stock</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Delivery Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product) => (
              <TableRow key={product._id}>
                <TableCell style={{ color: "#ffffff" }}>
                  {product.name}
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  {product.price}
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  {product.discount ?? "No Discount"}
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  {product.stock}
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  {product.saleCount}
                </TableCell>
                <TableCell style={{ color: "#ff9800",fontWeight:"bold"  }}>
                  {product.stock - product.saleCount}
                </TableCell>
                <TableCell style={{ color: "#ffffff"}}>
                  {product.deliveryCost}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ color: "#ffffff" }}
      />
    </TableContainer>
    </Box>
  );
}

export default ProductStock;
