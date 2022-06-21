import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPaletteMode } from '../slices/userPrefSlice';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import HouseIcon from '@mui/icons-material/House';
import Modal from '@mui/material/Modal';

import Badge from '@mui/material/Badge';
import PlaceIcon from '@mui/icons-material/Place';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

import AddressDataGrid from './AddressDataGrid';

const addressesStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const numberStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddressToolbar = ({ title }) => {
  const dispatch = useDispatch();
  const objectIds = useSelector((state) => state.address.selectedObjectIds);
  const addresses = useSelector((state) => state.address.selectedAddresses);

  const [openObjectIdsModal, setOpenObjectIdsModal] = useState(false);
  const [openAddressesModal, setOpenAddressesModal] = useState(false);

  const theme = useTheme();
  const palette = useSelector((state) => state.userPref.Palette);
  theme.palette.mode = palette.mode;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Modal
            open={openAddressesModal}
            onClose={() => setOpenAddressesModal(false)}
          >
            <Box sx={addressesStyle}>
              <AddressDataGrid />
            </Box>
          </Modal>

          <Modal
            open={openObjectIdsModal}
            onClose={() => setOpenObjectIdsModal(false)}
          >
            <Box sx={numberStyle}>{/* <ObjectIdList /> */}</Box>
          </Modal>

          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <IconButton
            disabled={objectIds.length === 0}
            onClick={() => setOpenObjectIdsModal(true)}
            size='large'
            edge='end'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={objectIds.length} color='primary'>
              <PlaceIcon />
            </Badge>
          </IconButton>

          <IconButton
            disabled={addresses.length === 0}
            onClick={() => setOpenAddressesModal(true)}
            size='large'
            edge='end'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={addresses.length} color='primary'>
              <HouseIcon />
            </Badge>
          </IconButton>

          {palette.mode === 'dark' ? (
            <IconButton
              onClick={() => dispatch(setPaletteMode('light'))}
              color='inherit'
            >
              <Brightness7Icon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => dispatch(setPaletteMode('dark'))}
              color='inherit'
            >
              <Brightness4Icon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AddressToolbar;
