import Icons from "../../assets/Icons";
import "./iframesiconssidebar.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentToken,
  setWidgets,
} from "../../features/api/auth/authSlice";
import { useUpdateUserMutation } from "../../features/api/user/userApiSlice";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { setWidgetMenu } from "../Preferences/preferencesSlice";
import { IIFramesListWithData } from "./widgetsSlice";
import { useTranslation } from "react-i18next";

// takes id of the element and scrolls it into view
// necessary for the dynamic widget list
const handleWidgetIconClick = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const IFramesIconsSidebar = ({
  widgetList,
}: {
  // widgetList: IWidgetListWithData[];
  widgetList: IIFramesListWithData[];
}) => {
  const { t } = useTranslation();
  // router hook
  const navigate = useNavigate();
  // store
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  // update DB
  const [updateUser] = useUpdateUserMutation();

  const handleDrop = async (droppedItem: DropResult) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = widgetList.map((widget) => widget.id);
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    dispatch(setWidgets({ widgets: updatedList }));
    // updating DB
    const result = await updateUser({
      widgets: JSON.stringify(updatedList),
    }).unwrap();
    if (result.status !== 200) console.log(result);
  };

  return (
    <div className="widgetsSideBar">
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {widgetList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="item-container widgetsSideBar__widgetWrapper"
                      title={t(item.title)!}
                      onClick={() => handleWidgetIconClick(item.id)}
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <img src={item.icon} alt="widget icon" />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        title={t("title_modifywidgetslist")!}
        className={
          token
            ? "widgetsSideBar__widgetWrapper widgetsSideBar__widgetWrapper--preferencesLink"
            : "widgetsSideBar__widgetWrapper widgetsSideBar__widgetWrapper--preferencesLink widgetsSideBar__widgetWrapper--disabled"
        }
        onClick={() => {
          dispatch(setWidgetMenu(true));
          navigate("preferences");
        }}
      >
        <Icons.Plus />
      </button>
    </div>
  );
};

export default IFramesIconsSidebar;
