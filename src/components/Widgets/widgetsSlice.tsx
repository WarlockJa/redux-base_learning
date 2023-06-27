import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface IIFramesList {
  id: string;
  src: string;
  height: string;
  // icon: JSX.Element;
  icon: string;
  title: string;
  requiresRegistration: boolean;
}

export interface IIFramesListWithData extends IIFramesList {
  widget: JSX.Element;
}
// list of all widgets used by the app
// needs to be here so it is available when store is initialized
const widgetList: IIFramesList[] = [
  {
    id: "agecalculator",
    title: "Age calculator",
    icon: "/icons/calculator.svg",
    src: "https://agecalculator-ebon.vercel.app/",
    height: "510px",
    requiresRegistration: false,
  },
  {
    id: "weatherreport",
    title: "Weather report",
    icon: "/icons/weather.svg",
    src: "https://wj-weatherapi.vercel.app/",
    height: "340px",
    requiresRegistration: false,
  },
];

// store contains data of all widget ids in order to display selection menu in WidgetPreferences
const initialState: IIFramesList[] = widgetList.map((widget) => ({
  id: widget.id,
  title: widget.title,
  height: widget.height,
  icon: widget.icon,
  src: widget.src,
  requiresRegistration: widget.requiresRegistration,
}));

export const widgetSlice = createSlice({
  name: "widget",
  initialState: initialState,
  reducers: {},
});

export default widgetSlice.reducer;

export const selectAllWidgets = (state: RootState) => state.widgets;
