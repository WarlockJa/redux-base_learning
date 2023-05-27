import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserData, setWidgets } from "../../features/api/auth/authSlice";
import { useUpdateUserMutation } from "../../features/api/user/userApiSlice";
import { widgetList } from "../Widgets/widgetsSlice";
import "./widgetpreferencesform.css";

const WidgetPreferencesForm = () => {
  // store data
  const dispatch = useAppDispatch();
  const { widgets } = useAppSelector(selectUserData);
  // update DB
  const [updateUser] = useUpdateUserMutation();

  // changing store and DB on menu change
  const handleChange = async (id: string) => {
    const newWidgetsList =
      widgets.findIndex((widget) => widget === id) === -1
        ? [...widgets, id]
        : [...widgets].filter((item) => item !== id);
    dispatch(setWidgets({ widgets: newWidgetsList }));
    // updating DB
    const result = await updateUser({
      widgets: JSON.stringify(newWidgetsList),
    }).unwrap();
    if (result.status !== 200) console.log(result);
  };

  // generating content from the list of widgets
  const content = widgetList.map((item) => (
    <div key={item.id} className="widgetForm__item">
      <div className="widgetForm__item--icon">{item.icon}</div>
      <label htmlFor={item.id} className="widgetForm__item--title">
        {item.title}
      </label>
      <input
        id={item.id}
        className="widgetForm__item--checkbox"
        type="checkbox"
        defaultChecked={!!widgets.find((widget) => widget === item.id)}
        onChange={() => handleChange(item.id)}
      />
    </div>
  ));

  return <div className="formLike">{content}</div>;
};

export default WidgetPreferencesForm;
