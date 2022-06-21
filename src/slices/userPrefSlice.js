import {
    createSlice
  } from '@reduxjs/toolkit';
  
  export const userPrefSlice = createSlice({
    name: 'userPref',
    initialState: {
      Palette: { mode:'dark'},
    },
    reducers: {
      setPaletteMode: (state, action) => {
        state.Palette.mode = action.payload;
      }
    },
  });
  
  export const {
    setPaletteMode
  } = userPrefSlice.actions;
  
  export default userPrefSlice.reducer;