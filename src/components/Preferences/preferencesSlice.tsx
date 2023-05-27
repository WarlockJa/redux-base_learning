import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface IPreferencesItems {
  userMenu: boolean;
  widgetMenu: boolean;
}

// store contains data of all widget ids in order to display selection menu in WidgetPreferences
const initialState: IPreferencesItems = {
  userMenu: false,
  widgetMenu: false,
};

export const preferencesSlice = createSlice({
  name: "preferencesMenu",
  initialState: initialState,
  reducers: {
    setUserMenu: (state, action: PayloadAction<boolean>) => {
      state.userMenu = action.payload;
    },
    setWidgetMenu: (state, action: PayloadAction<boolean>) => {
      state.widgetMenu = action.payload;
    },
  },
});

export const { setUserMenu, setWidgetMenu } = preferencesSlice.actions;

export default preferencesSlice.reducer;

export const selectPreferences = (state: RootState) => state.preferences;
