
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { BaseUser } from "../models/authModel";
// import { FullUser } from "../models/authModel";

// Only keep user and forgotPasswordStep in state
interface AuthState {
  forgotPasswordStep: number;
  user: BaseUser | null;
}

const initialState: AuthState = {
  forgotPasswordStep: 1,
  user: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleForgotPasswordStep: (state, { payload }: PayloadAction<number>) => {
      state.forgotPasswordStep = payload;
    },
    setCredentials: (state, action: PayloadAction<{ user: BaseUser }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
      state.forgotPasswordStep = 1;
    },
  },
});

export const { handleForgotPasswordStep, setCredentials, logout } =
  authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
