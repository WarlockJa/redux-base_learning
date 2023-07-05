import "./datetimepicker.css";
import "./calendar.css";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DateTimePicker from "react-datetime-picker";
import { switchAddTodoMenuState } from "./todosSlice";
import classNames from "classnames";
import { useAddTodoMutation } from "./todoApiSlice";
import dateToSqlDatetime from "../../util/dateToSQLdatetime";
import { selectUserData } from "../api/auth/authSlice";
import ResendEmail from "../../util/ResendEmail";
import { useTranslation } from "react-i18next";

const AddTodo = () => {
  const { t, i18n } = useTranslation("todo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [reminder, setReminder] = useState(0);

  // redux store state for the addTodo menu
  // const addTodoMenuState = useAppSelector(selectAddTodoState)
  const dispatch = useAppDispatch();
  const { email: useremail, email_confirmed: useremailConfirmed } =
    useAppSelector(selectUserData);
  // RTK Query method for posting new todo
  const [addTodo, { isLoading, isError, error }] = useAddTodoMutation();

  // add todo improper data saveguards
  const dueDateIsValid = !reminder || new Date() < dueDate;

  // check if alright to save
  const canSave = [title, dueDateIsValid].every(Boolean) && !isLoading;

  // adding todo
  const handleSubmit = async () => {
    if (canSave) {
      try {
        if (useremail)
          await addTodo({
            useremail: useremail,
            title,
            description,
            reminder,
            date_due: dateToSqlDatetime(dueDate),
          }).unwrap();
        setTitle("");
        setDescription("");
        setDueDate(new Date());
        setReminder(0);
      } catch (error) {
        console.log(error);
      }
      dispatch(switchAddTodoMenuState(false)); // closing addTodo menu by changing redux state
    }
  };

  const handleDateTimePickerOnChange = (value: Date | null) => {
    setDueDate(value ? value : new Date());
  };

  if (isError)
    return (
      <section className="addTodo">
        <p>{`${t("addTask_error")}: ${error}`}</p>
      </section>
    );

  return (
    <section className="addTodo">
      <form className="addTodo__form">
        <h3>{t("addTask_add")}</h3>
        <label htmlFor="addTodo__todoTitle">{t("addTask_title")}</label>
        <input
          id="addTodo__todoTitle"
          className={title ? "" : t("addTask_invalid")!}
          title={t("addTask_title")!}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="addTodo__todoDescription">
          {t("addTask_description")}
        </label>
        <textarea
          className="addTodo__todoDescription"
          id="addTodo__todoDescription"
          title={t("addTask_description")!}
          rows={5}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {useremailConfirmed ? (
          <div
            title={
              !dueDateIsValid
                ? `${t("addTask_dateMustBeAfter")} ${new Date()}`
                : t("addTask_reminder")!
            }
            className={classNames("addTodo__dueDate", {
              invalid: !dueDateIsValid,
            })}
          >
            <div className="addTodo__dueDate--reminderBlock">
              <label htmlFor="addTodo__dueDate--reminderCheckBox">
                {t("addTask_reminder")}
              </label>
              <input
                checked={reminder === 1 ? true : false}
                onChange={() => setReminder((prev) => (prev === 1 ? 0 : 1))}
                type="checkbox"
                id="addTodo__dueDate--reminderCheckBox"
              />
            </div>
            <label>{t("addTask_selectDate")}</label>
            <DateTimePicker
              disabled={!reminder}
              value={new Date(dueDate)}
              onChange={handleDateTimePickerOnChange}
              disableClock
              minDate={new Date()}
              format="dd-MM-y hh:mm"
              locale={i18n.language}
            />
          </div>
        ) : (
          <div>
            {t("addTask_confirmMessage")}
            <ResendEmail />
          </div>
        )}
        <button
          className={!canSave ? "translucent" : undefined}
          disabled={!canSave}
          title={
            !canSave
              ? t("addTask_fieldsMissingTitle")!
              : t("addTask_allGoodTitle")!
          }
          type="button"
          onClick={handleSubmit}
        >
          {t("addTask_add")}
        </button>
      </form>
    </section>
  );
};

export default AddTodo;
