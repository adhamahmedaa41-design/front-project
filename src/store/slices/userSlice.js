import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
