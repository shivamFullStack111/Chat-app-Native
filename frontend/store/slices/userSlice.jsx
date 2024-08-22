import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isauthenticated: false,
    isloading: false,
    user: null,
    allusers: [],
    activeusers: [],
  },
  reducers: {
    setuser: (state, action) => {
      state.user = action.payload;
    },
    setiasauthenticated: (state, action) => {
      state.isauthenticated = action.payload;
    },
    setallusers: (state, action) => {
      state.allusers = action.payload;
    },
    setactiveusers: (state, action) => {
      state.activeusers = action.payload;
    },
  },
});

export const { setuser, setiasauthenticated, setallusers, setactiveusers } =
  userSlice.actions;
export default userSlice.reducer;
