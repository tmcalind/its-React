import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import _ from 'lodash';
import { FiTool as ToolsIcon } from 'react-icons/fi';

const columns = [
  { field: 'UnitFullAddress', headerName: 'Address w/ Unit', width: 250 },
  { field: 'MunicipalNumber', headerName: 'Number', width: 100 },
  { field: 'StreetName', headerName: 'Name', width: 150 },
  { field: 'StreetType', headerName: 'Type', width: 50 },
  { field: 'StreetDirection', headerName: 'Dir', width: 50 },
];

const AddressDataGrid = () => {
  const addresses = useSelector((state) => state.address.selectedAddresses);

  const sortedAddresses = _.orderBy(
    addresses,
    [
      'StreetName',
      'StreetType',
      'StreetDirection',
      'MunicipalNumber',
      'UnitNumber',
    ],
    ['asc', 'asc', 'asc', 'asc', 'asc']
  );

  const [dataGridToolbarVisible, setDataGridToolbarVisible] = useState(false);
  return (
    <>
      {addresses && addresses.length > 0 ? (
        <Grid container>
          <Grid item xs={12}>
            <Toolbar>
              <IconButton
                onClick={() =>
                  setDataGridToolbarVisible(!dataGridToolbarVisible)
                }
              >
                <ToolsIcon />
              </IconButton>
            </Toolbar>
          </Grid>
          <Grid item xs={12}>
            <div style={{ height: 800, width: '100%' }}>
              <DataGrid
                rows={sortedAddresses}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                density='compact'
              />
            </div>
          </Grid>
        </Grid>
      ) : (
        <p>No addresses to show</p>
      )}
    </>
  );
};

export default AddressDataGrid;
