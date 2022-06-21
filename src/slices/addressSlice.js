import {
    createSlice
  } from '@reduxjs/toolkit';
  
  export const addressSlice = createSlice({
    name: 'address',
    initialState: {
      selectedObjectIds: [],
      selectedAddresses: []
    },
    reducers: {
      setSelectedObjectIds: (state, action) => {
        state.selectedObjectIds = action.payload;
      },
      setSelectedAddresses: (state, action) => {
        state.selectedAddresses = action.payload;
      }
    },
  });
  
  export const {
    setSelectedObjectIds,
    setSelectedAddresses
  } = addressSlice.actions;
  
  export default addressSlice.reducer;