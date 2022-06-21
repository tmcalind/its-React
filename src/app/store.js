import { configureStore } from '@reduxjs/toolkit';
import addressReducer from '../slices/addressSlice';
import userPrefReducer from '../slices/userPrefSlice';


export const store = configureStore({
  reducer: {
    address: addressReducer,
    userPref: userPrefReducer
  },
});
