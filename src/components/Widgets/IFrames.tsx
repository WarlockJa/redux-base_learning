import { ErrorBoundary } from "react-error-boundary";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
import { setWidgetMenu } from "../Preferences/preferencesSlice";
import { useNavigate } from "react-router-dom";

// user-defined type guard in case DB stored widget list is outdated
const widgetDoesExist = (
  widget: IIFramesList | undefined
): widget is IIFramesList => {
  return !!widget;
};

const IFrames = () => {
  // passing language to iFrames
  const { i18n, t } = useTranslation();
  // user data from the store
  const token = useAppSelector(selectCurrentToken);
  const { widgets } = useAppSelector(selectUserData);
  const widgetList = useAppSelector(selectAllWidgets);
  const { darkmode } = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // reading current url pathname and if it is "/" then displaying the elemnt's contents
  // necessary in order to prevent iFrames reloading on route change
  const url = window.location.pathname;

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
            item.src_type === "vite"
              ? `?lng=${i18n.language}&theme=${darkmode ? "dark" : "light"}`
              : `/${i18n.language}?theme=${darkmode ? "dark" : "light"}`
          )}
          allow={item.allow}
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
    <div
      className={url !== "/" ? "iFramesHidden" : ""}
      aria-disabled={url !== "/"}
    >
      <IFramesIconsSidebar widgetList={iFramesList} />
      {content.length !== 0 ? (
        content
      ) : token ? (
        <div className="noWidgets">
          <p>{t("no_widgets")}</p>
          <button
            title={t("title_modifywidgetslist")!}
            onClick={() => {
              dispatch(setWidgetMenu(true));
              navigate("preferences");
            }}
          >
            {t("open_widgets_menu")}
          </button>
        </div>
      ) : (
        <div className="noWidgets">
          <h2>{t("no_widgets_welcome")}</h2>
          <p>{t("no_widgets_not_signed")}</p>
        </div>
      )}
    </div>
  );
};

export default IFrames;
