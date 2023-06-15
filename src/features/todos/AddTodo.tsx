import "./datetimepicker.css";
import "./calendar.css";
import { SetStateAction, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DateTimePicker from "react-datetime-picker";
import { switchAddTodoMenuState } from "./todosSlice";
import classNames from "classnames";
import { useAddTodoMutation } from "./todoApiSlice";
import dateToSqlDatetime from "../../util/dateToSQLdatetime";
import { selectUserData } from "../api/auth/authSlice";
import ResendEmail from "../../util/ResendEmail";

const AddTodo = () => {
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
            dispatch(switchAddTodoMenuState()); // closing addTodo menu by changing redux state
        }
    };

    const handleDateTimePickerOnChange = (value: Date | null) => {
        setDueDate(value ? value : new Date());
    };

    if (isError)
        return (
            <section className="addTodo">
                <p>{`Failed to save the post: ${error}`}</p>
            </section>
        );

    return (
        <section className="addTodo">
            <form className="addTodo__form">
                <h3>Add Task</h3>
                <label htmlFor="addTodo__todoTitle">Task Title</label>
                <input
                    id="addTodo__todoTitle"
                    className={title ? "" : "invalid"}
                    title="Task title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="addTodo__todoDescription">
                    Task Description
                </label>
                <textarea
                    className="addTodo__todoDescription"
                    id="addTodo__todoDescription"
                    title="Task description"
                    rows={5}
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {useremailConfirmed ? (
                    <div
                        title={
                            !dueDateIsValid
                                ? `Chosen date must be after ${new Date()}`
                                : "Set reminder"
                        }
                        className={classNames("addTodo__dueDate", {
                            invalid: !dueDateIsValid,
                        })}
                    >
                        <div className="addTodo__dueDate--reminderBlock">
                            <label htmlFor="addTodo__dueDate--reminderCheckBox">
                                Set reminder
                            </label>
                            <input
                                checked={reminder === 1 ? true : false}
                                onChange={() =>
                                    setReminder((prev) => (prev === 1 ? 0 : 1))
                                }
                                type="checkbox"
                                id="addTodo__dueDate--reminderCheckBox"
                            />
                        </div>
                        <label>Select date</label>
                        <DateTimePicker
                            disabled={!reminder}
                            value={new Date(dueDate)}
                            onChange={handleDateTimePickerOnChange}
                            disableClock
                            minDate={new Date()}
                            format="dd-MM-y hh:mm"
                        />
                    </div>
                ) : (
                    <div>
                        Confirm email to enable reminders
                        <ResendEmail />
                    </div>
                )}
                <button
                    className={!canSave ? "translucent" : undefined}
                    disabled={!canSave}
                    title={
                        !canSave ? "Required fields are missing" : "All good!"
                    }
                    type="button"
                    onClick={handleSubmit}
                >
                    Add Task
                </button>
            </form>
        </section>
    );
};

export default AddTodo;
