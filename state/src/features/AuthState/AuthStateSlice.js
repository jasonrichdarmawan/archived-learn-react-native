import {createSlice} from '@reduxjs/toolkit';

const authStateSlice = createSlice({
  name: 'authState',
  initialState: {},
  reducers: {
    // TODO: action.payload
    signIn: (state) => ({isAuthorized: true}),
    signOut: (state) => ({isAuthorized: false}),
  },
});

export const {signIn, signOut} = authStateSlice.actions;

export const fetchAuthState = () => (dispatch) => {
  // fake fetchAuthState
  setTimeout(() => {
    dispatch(signOut());
  }, 1000);
};

export const selectAuthState = (state) => state.authState;

export default authStateSlice.reducer;
