import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import Icons from "../../assets/Icons";
import Counter from "../../features/counter/Counter";
import Weatherstack from "../../features/weatherstack/Weatherstack";
import FreeCurrencyApi from "../../features/freeCurrencyApi/FreeCurrencyApi";

interface IWidgetList {
  id: string;
  title: string;
}

export interface IWidgetListWithData extends IWidgetList {
  icon: JSX.Element;
  widget: JSX.Element;
  requiresRegistration: boolean;
}

// list of all widgets used by the app
// needs to be here so it is available when store is initialized
export const widgetList: IWidgetListWithData[] = [
  {
    id: "reduxshowcase",
    title: "Redux store showcase",
    icon: <Icons.ReduxLogo />,
    widget: <Counter />,
    requiresRegistration: false,
  },
  {
    id: "weatherstack",
    title: "Weather report",
    icon: <Icons.Weather />,
    widget: <Weatherstack />,
    requiresRegistration: true,
  },
  {
    id: "freecurrencyapi",
    title: "Currency exchange",
    icon: <Icons.Exchange />,
    widget: <FreeCurrencyApi />,
    requiresRegistration: true,
  },
];

// store contains data of all widget ids in order to display selection menu in WidgetPreferences
const initialState: IWidgetList[] = widgetList.map((widget) => ({
  id: widget.id,
  title: widget.title,
}));

export const widgetSlice = createSlice({
  name: "widget",
  initialState: initialState,
  reducers: {},
});

export default widgetSlice.reducer;

export const selectAllWidgets = (state: RootState) => state.widgets;
