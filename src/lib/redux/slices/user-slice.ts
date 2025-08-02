
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../store";
import type { AdminAccount } from "@/lib/actions/auth-actions";

export interface UserState {
  account: AdminAccount | null;
}

const initialState: UserState = {
  account: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AdminAccount>) => {
      state.account = action.payload;
    },
    clearUser: (state) => {
      state.account = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: AppState) => state.user.account;
export const selectRole = (state: AppState) => state.user.account?.role;

export default userSlice.reducer;
