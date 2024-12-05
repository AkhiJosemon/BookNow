import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState, // Set initialState here
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      
    },
    clearUser(state) {
      state.user = null;
     
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
