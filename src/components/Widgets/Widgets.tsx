import { ErrorBoundary } from "react-error-boundary";
import { useAppSelector } from "../../app/hooks";
import {
  selectCurrentToken,
  selectUserData,
} from "../../features/api/auth/authSlice";
import ErrorPlug from "../../util/ErrorPlug";
import WidgetIconsSidebar from "./WidgetIconsSidebar";
import { IWidgetListWithData, widgetList } from "./widgetsSlice";

// user-defined type guard in case DB stored widget list is outdated
const widgetDoesExist = (
  widget: IWidgetListWithData | undefined
): widget is IWidgetListWithData => {
  return !!widget;
};

const Widgets = () => {
  // user data from the store
  const token = useAppSelector(selectCurrentToken);
  const { widgets } = useAppSelector(selectUserData);

  // forming content for widget icons sidebar
  const filteredList =
    token && widgets
      ? widgets
          .map((widget) => widgetList.find((item) => item.id === widget))
          .filter(widgetDoesExist)
      : widgetList.filter((widget) => !widget.requiresRegistration);

  // forming content from the filtered list
  const content = filteredList.map((widget, index) => (
    <ErrorBoundary key={index} FallbackComponent={ErrorPlug}>
      {widget.widget}
    </ErrorBoundary>
  ));

  return (
    <>
      <WidgetIconsSidebar widgetList={filteredList} />
      <ErrorBoundary FallbackComponent={ErrorPlug}>
        <section>
          <iframe
            style={{ borderRadius: "20px" }}
            src="https://agecalculator-ebon.vercel.app/"
            width="100%"
            height="510px"
          />
        </section>
      </ErrorBoundary>
      {content.length !== 0 ? content : <p>You have no active widgets</p>}
    </>
  );
};

export default Widgets;
