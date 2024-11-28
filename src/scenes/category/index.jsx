import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAddCategoryMutation, useGetCategoryQuery,useUpdateCategoryMutation } from '../../state/api'; // Adjust the import based on your project structure
import Header from 'components/Header'; // Adjust the import based on your project structure

const Categories = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [addCategory] = useAddCategoryMutation();
  const { data = [], isLoading } = useGetCategoryQuery();
  const { refetch } = useGetCategoryQuery();
  const [updateCategory] = useUpdateCategoryMutation();
  // Assign sequential ids to data
  const rows = data.map((item, index) => ({ ...item, id: index + 1 }));

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 2,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCategory({ name: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async () => {
    try {
      // Send new category data to the backend
      await addCategory(newCategory).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to add category: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Send the delete request to the backend
      await updateCategory(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete category: ', error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CATEGORIES" subtitle="List of product categories" />
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Category
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
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategory.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newCategory.description}
            onChange={handleChange}
          />




        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
