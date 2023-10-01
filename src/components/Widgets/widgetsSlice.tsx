import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface IIFramesList {
  id: string;
  src: string;
  src_type: "vite" | "next";
  height: string;
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
    title: "title_agecalculator",
    icon: "/icons/calculator.svg",
    src: "https://agecalculator-ebon.vercel.app/",
    src_type: "vite",
    height: "var(--sz-agecalculator)",
    requiresRegistration: true,
  },
  {
    id: "weatherreport",
    title: "title_weatherreport",
    icon: "/icons/weather.svg",
    src: "https://wj-weatherapi.vercel.app/",
    src_type: "vite",
    height: "var(--sz-weatherreport)",
    requiresRegistration: true,
  },
  {
    id: "freecurrencyapi",
    title: "title_currencyexchange",
    icon: "/icons/currency-exchange.svg",
    src: "https://wj-currencyexchange-db.vercel.app/",
    src_type: "next",
    height: "var(--sz-freecurrencyapi)",
    requiresRegistration: true,
  },
];

// store contains data of all widget ids in order to display selection menu in WidgetPreferences
const initialState: IIFramesList[] = widgetList.map((widget) => ({
  id: widget.id,
  title: widget.title,
  height: widget.height,
  icon: widget.icon,
  src: widget.src,
  src_type: widget.src_type,
  requiresRegistration: widget.requiresRegistration,
}));

export const widgetSlice = createSlice({
  name: "widget",
  initialState: initialState,
  reducers: {},
});

export default widgetSlice.reducer;

export const selectAllWidgets = (state: RootState) => state.widgets;
