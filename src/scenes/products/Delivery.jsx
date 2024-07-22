import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header'; // Adjust the import based on your project structure

const initialDeliveries = [
    { id: 1, cost: 10.0 },
    { id: 2, cost: 15.0 },
    { id: 3, cost: 20.0 },
    { id: 4, cost: 20.0 },
    { id: 5, cost: 20.0 },
    { id: 6, cost: 20.0 },
    { id: 7, cost: 20.0 },
    { id: 8, cost: 20.0 },
    { id: 9, cost: 20.0 },
    { id: 10, cost: 10.0 },
    { id: 11, cost: 10.0 },
    { id: 12, cost: 10.0 },
    { id: 13, cost: 12.0 },
    { id: 14, cost: 18.0 }
];

const Delivery = () => {
  const theme = useTheme();
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [open, setOpen] = useState(false);
  const [newDelivery, setNewDelivery] = useState({ id: '', cost: '' });

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      flex: 1,
    },
    {
      field: 'cost',
      headerName: 'Delivery Cost',
      flex: 1,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewDelivery({ id: '', cost: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDelivery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDelivery = () => {
    setDeliveries((prev) => [
      ...prev,
      { id: parseInt(newDelivery.id, 10), cost: parseFloat(newDelivery.cost) },
    ]);
    handleClose();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DELIVERIES" subtitle="List of delivery costs" />
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Delivery
      </Button>
      <Box
        height="80vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.id}
          rows={deliveries}
          columns={columns}
        //   pageSize={5}
        //   rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Delivery</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="id"
            label="No"
            type="number"
            fullWidth
            value={newDelivery.id}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="cost"
            label="Delivery Cost"
            type="number"
            fullWidth
            value={newDelivery.cost}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddDelivery} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Delivery;
