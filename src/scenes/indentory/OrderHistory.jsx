import React, { useEffect, useState } from "react";
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
  TextField,
} from "@mui/material";
import { useAddTrackDetailsMutation } from "state/api";

function OrderHistory() {
  const theme = useTheme();
  const { data, isLoading, error } = useGetOrderHistoryQuery();
  const [
    addTrackDetails,
    {
      isLoading: isLoadingTrack,
      isSuccess,
      isError: isTrackError,
      error: trackError,
    },
  ] = useAddTrackDetailsMutation();
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);
  const [selectedBillInfo, setSelectedBillInfo] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [trackId, setTrackId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(""); // Default value
  const [selectedOrder, setSelectedOrder] = useState({
    id: null,
    status: "Confirmed",
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedOrder({
        id: data[0]._id,
        status: data[0].status || "Confirmed",
      });
    }
  }, [data]);

  // Handle select change for a specific order
  const handleSelectChange = (orderId, event) => {
    const newStatus = event.target.value;
    setSelectedOrder({ id: orderId, status: newStatus });
  };
  const handleSelectChangeMethod = (event) => {
    setSelectedMethod(event.target.value); // Update the selected method
  };
  console.log(selectedOrder);
  console.log(trackId);
  console.log(selectedMethod);
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

  const handleAddTracking = async () => {
    const newTrackDetails = {
      trackId,
      shippingMethod: selectedMethod,
      orderId: selectedOrder.id,
      orderStatus: selectedOrder.status,
    };

    try {
      await addTrackDetails(newTrackDetails).unwrap();
      // Handle success (e.g., show a success message)
      console.log("Tracking details added successfully");
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Failed to add tracking details:", error);
    }
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
              <TableCell>Track ID</TableCell>
              <TableCell>Delivery Company</TableCell>
              <TableCell>Action</TableCell>
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
                    value={
                      selectedOrder.id === order._id
                        ? selectedOrder.status
                        : "Confirmed"
                    } // Show current status if selected
                    onChange={(event) => handleSelectChange(order._id, event)}
                    name="status"
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Process">Process</option>
                    <option value="Deliver">Deliver</option>
                  </select>
                </TableCell>
                <TableCell>
                  <TextField
                    label="Enter ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onBlur={(e) => setTrackId(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <select
                    value={selectedMethod} // Bind the state to the select value
                    onChange={handleSelectChangeMethod} // Handle change event
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    <option value="RoyalMail">Royal Mail</option>
                    <option value="Parcel2go">Parcel2go</option>
                    <option value="evri">Evri</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTracking} // Call the mutation
                    disabled={isLoadingTrack} // Disable the button if the mutation is loading
                  >
                    {isLoadingTrack ? "Submitting..." : "Submit"}{" "}
                    {/* Change button text based on loading state */}
                  </Button>
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
