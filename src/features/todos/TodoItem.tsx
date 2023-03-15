import { ITodo } from "./todosSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faCheck, faMinusCircle } from "@fortawesome/fontawesome-free-solid"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { formatRelative } from "date-fns"
import { ErrorBoundary } from "react-error-boundary"
import ErrorPlug from "../../util/ErrorPlug"
import { useDeleteTodoMutation, useUpdateTodoMutation } from "../api/apiSlice"
import classNames from "classnames"
import { useEffect, useState } from "react"
import DateTimePicker from "react-datetime-picker"


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
    const [dueDate, setDueDate] = useState(todo.date_due)
    // flags for text fields edits
    const [titleEdit, setTitleEdit] = useState(false)
    const [descriptionEdit, setDescriptionEdit] = useState(false)

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
                await updateTodo({ id: todo.id, userid: 1, title, description, completed, reminder, date_due: dueDate })
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
        setDueDate(todo.date_due)
    }
    
    // tracking changed status for todo
    useEffect (() => {
        todo.completed === completed
            ? todo.title === title
                ? todo.description === description
                    ? todo.reminder === reminder
                        ? todo.date_due === dueDate
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
                    : <h2 className={classNames("clickable", { invalid: !title })} onClick={() => setTitleEdit(true)}>{title ? title : 'Title Required'}</h2>
                }
                {descriptionEdit
                    ? <textarea
                        autoFocus
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => setDescriptionEdit(false)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    ></textarea>
                    : <p className="clickable" onClick={() => setDescriptionEdit(true)}>{description ? description : 'Todo Description'}</p>
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
                        ? <FontAwesomeIcon icon={faCheck as IconProp} />
                        : <FontAwesomeIcon icon={faMinusCircle as IconProp} />
                    }
                </div>
                {todoHasChanges &&
                    <>
                        <button className={!canSave ? 'translucent' : undefined} onClick={() => handleUpdateTodo()} disabled={!canSave}>Update</button>
                        <button onClick={() => handleDiscardChanges()}>Discard</button>
                    </>
                }
            </div>
            <div className={classNames("todoItem__footer--setReminder", {invalid: !dueDateIsValid})}>
                <div>
                    <input type="checkbox" id={`todoItem__footer--reminder${todo.id}`} checked={reminder} onChange={() => setReminder(prev => !prev)} />
                    <label htmlFor={`todoItem__footer--reminder${todo.id}`}>Set reminder</label>
                </div>
                <DateTimePicker disabled={!reminder} value={new Date(dueDate)} onChange={setDueDate} disableClock minDate={new Date} format="dd-MM-y hh:mm" />
            </div>
            <div className="todoItem__footer--dateCreated">
                <p>created</p>
                <p>{formatRelative(Date.parse(todo.date_created), new Date())}</p>
            </div>
            <div
                className="todoItem__delete faIcon-container"
                onClick={handleDeleteTodo}
            >
                <FontAwesomeIcon icon={faTrash as IconProp} />
            </div>
        </li>
    )
}

export default TodoItem