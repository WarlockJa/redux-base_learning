import { ErrorBoundary } from "react-error-boundary";
import { useAppSelector } from "../../app/hooks";
import {
  selectCurrentToken,
  selectUserData,
} from "../../features/api/auth/authSlice";
import ErrorPlug from "../../util/ErrorPlug";
import "./iframes.css";
import IFramesIconsSidebar from "./IFramesIconsSideBar";
import {
  IIFramesList,
  IIFramesListWithData,
  selectAllWidgets,
} from "./widgetsSlice";
import { useTranslation } from "react-i18next";

// user-defined type guard in case DB stored widget list is outdated
const widgetDoesExist = (
  widget: IIFramesList | undefined
): widget is IIFramesList => {
  return !!widget;
};

const IFrames = () => {
  // passing language to iFrames
  const { i18n, t } = useTranslation("widgets");
  // user data from the store
  const token = useAppSelector(selectCurrentToken);
  const { widgets } = useAppSelector(selectUserData);
  const widgetList = useAppSelector(selectAllWidgets);
  const { darkmode } = useAppSelector(selectUserData);

  // forming content for widget icons sidebar
  const filteredList =
    token && widgets
      ? widgets
          .map((widget) => widgetList.find((item) => item.id === widget))
          .filter(widgetDoesExist)
      : widgetList.filter((widget) => !widget.requiresRegistration);

  // forming iFrame content
  const iFramesList: IIFramesListWithData[] = filteredList.map((item) => ({
    ...item,
    widget: (
      <section id={item.id}>
        <h1>{t(item.title)}</h1>
        <iframe
          className="iFrameWidget"
          src={item.src.concat(
            `?lng=${i18n.language}&theme=${darkmode ? "dark" : "light"}`
          )}
          width="100%"
          style={{ height: item.height }}
        />
      </section>
    ),
  }));

  // forming content from the filtered list
  const content = iFramesList.map((widget, index) => (
    <ErrorBoundary key={index} FallbackComponent={ErrorPlug}>
      {widget.widget}
    </ErrorBoundary>
  ));

  return (
    <>
      <IFramesIconsSidebar widgetList={iFramesList} />
      {content.length !== 0 ? content : <p>{t("no_widgets")}</p>}
    </>
  );
};

export default IFrames;
