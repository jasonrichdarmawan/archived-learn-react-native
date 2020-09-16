import {configureStore} from '@reduxjs/toolkit';
import authStateReducer from './src/features/AuthState/AuthStateSlice';

export default configureStore({
  reducer: {
    authState: authStateReducer,
  },
});
