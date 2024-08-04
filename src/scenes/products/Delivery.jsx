import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAddDeliveryCostMutation, useGetDeliveryCostQuery } from '../../state/api'; // Adjust the import based on your project structure
import Header from 'components/Header'; // Adjust the import based on your project structure

const Delivery = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newDelivery, setNewDelivery] = useState({ cost: '' });
  const [addDeliveryCost] = useAddDeliveryCostMutation();
  const { data = [], isLoading } = useGetDeliveryCostQuery();

  // Assign sequential ids to data
  const rows = data.map((item, index) => ({ ...item, id: index + 1 }));

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
    setNewDelivery({ cost: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDelivery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDelivery = async () => {
    try {
     // Generate a new sequential ID
      await addDeliveryCost({  cost: parseFloat(newDelivery.cost) }).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to add delivery cost: ', error);
    }
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
          rows={rows}
          columns={columns}
          loading={isLoading}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Delivery</DialogTitle>
        <DialogContent>
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