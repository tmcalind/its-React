import React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { green, blueGrey } from '@mui/material/colors';

import AddressMap from './components/AddressMap'

import { esriMapStreets } from './MapConfigs'
import AddressToolbar from './components/AddressToolbar';

const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[900],
    },
    secondary: {
      main: green[500],
    },
  },
});

function App() {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AddressToolbar title="Address Map" /> 
          </Grid>
          <Grid item xs={10}>
            <AddressMap {...esriMapStreets}/> 
          </Grid>
          <Grid item xs={2}>
    
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default App;
