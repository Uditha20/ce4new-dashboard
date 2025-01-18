import React, { useState } from "react";
import { useGetOrderHistoryQuery } from "state/api";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
function OrderHistory() {
  const theme = useTheme();
  const { data, isLoading, error } = useGetOrderHistoryQuery();
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);
  const [selectedBillInfo, setSelectedBillInfo] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading order history</div>;

  const handleOpenBillInfo = (billInfo) => {
    setSelectedBillInfo(billInfo);
    setOpenBillDialog(true);
  };

  const handleCloseBillInfo = () => {
    setOpenBillDialog(false);
    setSelectedBillInfo(null);
  };

  const handleOpenItems = (items) => {
    setSelectedItems(items);
    setOpenItemsDialog(true);
  };

  const handleCloseItems = () => {
    setOpenItemsDialog(false);
    setSelectedItems(null);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <TableContainer component={Paper} style={{ backgroundColor: "#21295c" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>

              <TableCell>Overall Total</TableCell>
              <TableCell>Billing Info</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Order status</TableCell>
              <TableCell>change status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>

                <TableCell>${Number(order.overallTotal).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenBillInfo(order.billingInfo)}
                  >
                    View Bill Info
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenItems(order.items)}
                  >
                    View Items
                  </Button>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        order.status === "confirmed"
                          ? "green"
                          : order.status === "process"
                          ? "orange"
                          : order.status === "deliver"
                          ? "blue"
                          : "gray", // Default color for unknown statuses
                    }}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    // onChange={(e) =>
                    //   handleStatusChange(order._id, e.target.value)
                    // }
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    <option value="process">Confirmed</option>
                    <option value="process">Process</option>
                    <option value="deliver">Deliver</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Billing Info Dialog */}
      <Dialog open={openBillDialog} onClose={handleCloseBillInfo}>
        <DialogTitle>Billing Information</DialogTitle>
        <DialogContent>
          {selectedBillInfo && (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>{selectedBillInfo.firstName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last Name</TableCell>
                    <TableCell>{selectedBillInfo.lastName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>
                      {selectedBillInfo.companyName || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell>{selectedBillInfo.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Street Address</TableCell>
                    <TableCell>{selectedBillInfo.streetAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Apartment</TableCell>
                    <TableCell>{selectedBillInfo.apartment || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>{selectedBillInfo.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>{selectedBillInfo.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Postal Code</TableCell>
                    <TableCell>{selectedBillInfo.postalCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Phone</TableCell>
                    <TableCell>{selectedBillInfo.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{selectedBillInfo.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Order Notes</TableCell>
                    <TableCell>
                      {selectedBillInfo.orderNotes || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Items Dialog */}
      <Dialog open={openItemsDialog} onClose={handleCloseItems}>
        <DialogTitle>Items Purchased</DialogTitle>
        <DialogContent>
          {selectedItems && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Total Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.product._id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        ${item.product.price.basePrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {item.product.discount
                          ? `${item.product.discount}%`
                          : "No Discount"}
                      </TableCell>
                      <TableCell>
                        $
                        {(item.quantity * item.product.price.basePrice).toFixed(
                          2
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default OrderHistory;
