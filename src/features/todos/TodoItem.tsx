import { ITodo } from "./todosSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faCheck, faMinusCircle } from "@fortawesome/fontawesome-free-solid"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { format, formatRelative } from "date-fns"
import { ErrorBoundary } from "react-error-boundary"
import ErrorPlug from "../../util/ErrorPlug"
import classNames from "classnames"
import { useEffect, useState } from "react"
import DateTimePicker from "react-datetime-picker"
import { useDeleteTodoMutation, useUpdateTodoMutation } from "./todoApiSlice"
import datetimeSQLtoDate from "../../util/datetimeSQLtoDate"
import dateToSqlDatetime from "../../util/dateToSQLdatetime"
import { useAppSelector } from "../../app/hooks"
import { selectCurrentEmail } from "../auth/authSlice"


const TodoItem = ({ todo }: { todo: ITodo }) => {
    // setting up error boundaries
    return (
        <ErrorBoundary
            FallbackComponent={ErrorPlug}
        >
            <TodoItemContent todo={todo} />
        </ErrorBoundary>
    )
}

const TodoItemContent = ({ todo }: { todo: ITodo }) => {
    // apiSlice data
    const [deleteTodo, { isLoading }] = useDeleteTodoMutation()
    const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation()

    // tracking todo changes
    const [todoHasChanges, setTodoHasChanges] = useState(false)
    const [completed, setCompleted] = useState(todo.completed)
    const [title, setTitle] = useState(todo.title)
    const [description, setDescription] = useState(todo.description)
    const [reminder, setReminder] = useState(todo.reminder)
    const [dueDate, setDueDate] = useState(new Date(todo.date_due))

    // flags for text fields edits
    const [titleEdit, setTitleEdit] = useState(false)
    const [descriptionEdit, setDescriptionEdit] = useState(false)

    const useremail = useAppSelector(selectCurrentEmail)

    // deleting todo
    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(todo.id).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    // add todo improper data saveguards
    const dueDateIsValid = !reminder || new Date < dueDate

    const canSave = [title, dueDateIsValid].every(Boolean) && !isLoading && !isUpdating

    // updating todo
    const handleUpdateTodo = async () => {
        if(canSave) {
            try {
                if(useremail) await updateTodo({ id: todo.id, useremail: useremail, title, description, completed, reminder, date_due: dateToSqlDatetime(dueDate) })
                setTodoHasChanges(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    // discarding changes
    const handleDiscardChanges = () => {
        setCompleted(todo.completed)
        setTitle(todo.title)
        setDescription(todo.description)
        setReminder(todo.reminder)
        setDueDate(new Date(todo.date_due))
    }
    
    // tracking changed status for todo
    useEffect (() => {
        todo.completed === completed
            ? todo.title === title
                ? todo.description === description
                    ? todo.reminder === reminder
                        ? new Date(todo.date_due).getTime() === dueDate.getTime()
                            ? setTodoHasChanges(false)
                            : setTodoHasChanges(true)
                        : setTodoHasChanges(true)
                    : setTodoHasChanges(true)
                : setTodoHasChanges(true)
            : setTodoHasChanges(true)
    },[completed, dueDate, reminder, title, description])

    // exiting editing mode on Enter clicked
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
          setTitleEdit(false)
          setDescriptionEdit(false)
        }
    };

    return (
        <li className={classNames('todoItem', { translucent: isLoading || isUpdating })}>
            <div className="todoItem__body">
                {titleEdit
                    ? <input
                        type="text"
                        autoFocus
                        className={classNames('todoItem__body--title', { invalid: !title })}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setTitleEdit(false)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    ></input>
                    : <h2 className={classNames("clickable", { invalid: !title })} title="Change title" onClick={() => setTitleEdit(true)}>{title ? title : 'Title Required'}</h2>
                }
                {descriptionEdit
                    ? <textarea
                        className='todoItem__body--description'
                        autoFocus
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => setDescriptionEdit(false)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    ></textarea>
                    : <p className="clickable" title="Change description" onClick={() => setDescriptionEdit(true)}>{description ? description : 'Todo Description'}</p>
                }
            </div>
            <div
                className="todoItem__completedState"
            >
                <div
                    onClick={() => setCompleted(prev => !prev)}
                    className="faIcon-container"
                >
                    {completed
                        ? <FontAwesomeIcon title="Mark undone :(" icon={faCheck as IconProp} />
                        : <FontAwesomeIcon title="Mark done!" icon={faMinusCircle as IconProp} />
                    }
                </div>
                {todoHasChanges &&
                    <>
                        <button title="Update task" className={!canSave ? 'translucent' : undefined} onClick={() => handleUpdateTodo()} disabled={!canSave}>Update</button>
                        <button title="Discard cahnges" onClick={() => handleDiscardChanges()}>Discard</button>
                    </>
                }
            </div>
            <div title={!dueDateIsValid ? `Chosen date must be after ${new Date}` : "Set reminder"} className={classNames("todoItem__footer--setReminder", {invalid: !dueDateIsValid})}>
                <div>
                    <input type="checkbox" id={`todoItem__footer--reminder${todo.id}`} checked={reminder} onChange={() => setReminder(prev => !prev)} />
                    <label htmlFor={`todoItem__footer--reminder${todo.id}`}>Set reminder</label>
                </div>
                <DateTimePicker disabled={!reminder} value={dueDate} onChange={setDueDate} disableClock minDate={new Date} format="dd-MM-y hh:mm" />
            </div>
            <div title={`Created at ${format(new Date(todo.date_created), 'dd-MM-y hh:mm a')}`} className="todoItem__footer--dateCreated">
                <p>created</p>
                <p>{formatRelative(Date.parse(todo.date_created), new Date())}</p>
            </div>
            <div
                className="todoItem__delete faIcon-container"
                onClick={handleDeleteTodo}
                title="Delete task"
            >
                <FontAwesomeIcon icon={faTrash as IconProp} />
            </div>
        </li>
    )
}

export default TodoItem