import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers/helpers';
import { getCategories } from '../helpers/loaderfunctions';

function AddCategoryPopUp ({
  open,
  setOpen,
  setCategories
}) {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = React.useState('');
  const [alert, setAlert] = React.useState('');

  async function handleAdd () {
    if (categoryName === '') {
      setAlert('Please enter a category name');
      return;
    }

    const data = await apiCall('menu/category', 'POST', { name: categoryName });
    if (data.category) {
      const categories = await getCategories();
      setCategories(categories);
      navigate(`/managereditmenu/${data.category.category_id}`);
      handleClose();
      // make feedback alert like assistance?
      console.log('Category successfully added');
    } else {
      setAlert(data.message);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{'Add New Category'}</DialogTitle>
        <DialogContent>
          <TextField
            label='New category name'
            variant='outlined'
            margin='normal'
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
          <Button onClick={handleAdd} variant='contained' color='success'>Add</Button>
        </DialogActions>
        {alert && <Alert severity='error' aria-label='errorAlert'>{alert}</Alert>}
      </Dialog>
    </>
  )
}

export default AddCategoryPopUp;
