import {createSlice} from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: { isAuthorized: false },
  reducers: {
    signIn: () => ({isAuthorized: true}),
    signOut: () => ({isAuthorized: false}),
  },
});

export const {signIn, signOut} = accountSlice.actions;

export const selectAccount = (state) => state.account;

export default accountSlice.reducer;
