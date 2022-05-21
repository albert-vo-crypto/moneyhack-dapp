import { createSlice, createAction } from "@reduxjs/toolkit";

const initialState = {
  currentSignerAddress: null,
};

const slice = createSlice({
  name: "appContext",
  initialState,
  reducers: {
    currentSignerAddressUpdatedAction: (state, action) => {
      state.currentSignerAddress = action.payload;
    },
  },
});

export const { currentSignerAddressUpdatedAction } = slice.actions;
export const showErrorNotificationAction = createAction("appContext/showErrorNotificationAction");

export const appContextStateSelector = state => state.appContext;
export const appContextCurrentSignerAddressSelector = state => state.appContext.currentSignerAddress;

export default slice.reducer;
