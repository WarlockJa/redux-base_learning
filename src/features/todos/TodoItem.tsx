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
    return (
        <ErrorBoundary
            FallbackComponent={ErrorPlug}
        >
            <TodoItemContent todo={todo} />
        </ErrorBoundary>
    )
}

const TodoItemContent = ({ todo }: { todo: ITodo }) => {
    const [deleteTodo, { isLoading }] = useDeleteTodoMutation()
    const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation()

    const [todoHasChanges, setTodoHasChanges] = useState(false)
    const [completed, setCompleted] = useState(todo.completed)
    const [title, setTitle] = useState(todo.title)
    const [description, setDescription] = useState(todo.description)
    const [reminder, setReminder] = useState(todo.reminder)
    const [dueDate, setDueDate] = useState(todo.date_due)

    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(todo.id).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateTodo = async () => {
        try {
            await updateTodo({ id: todo.id, userid: 1, title, description, completed, reminder, date_due: dueDate })
            setTodoHasChanges(false)
        } catch (error) {
            console.log(error)
        }
    }

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

    return (
        <li className={classNames('todoItem', { translucent: isLoading || isUpdating })}>
            <div className="todoItem__body">
                <h2>{todo.title}</h2>
                <p>{todo.description}</p>
            </div>
            <div
                className="todoItem__completedState faIcon-container"
                onClick={() => setCompleted(prev => !prev)}
            >
                {completed
                    ? <FontAwesomeIcon icon={faCheck as IconProp} />
                    : <FontAwesomeIcon icon={faMinusCircle as IconProp} />
                }
                {todoHasChanges && <button onClick={() => handleUpdateTodo()}>Update</button>}
            </div>
            {/* <div className="todoItem__footer"> */}
                <div className="todoItem__footer--setReminder">
                    <div>
                        <input type="checkbox" id={`todoItem__footer--reminder${todo.id}`} checked={reminder} onChange={() => setReminder(prev => !prev)} />
                        <label htmlFor={`todoItem__footer--reminder${todo.id}`}>Set reminder</label>
                    </div>
                    <DateTimePicker disabled={!reminder} value={dueDate} onChange={setDueDate} disableClock minDate={new Date()} />
                </div>
                <div className="todoItem__footer--dateCreated">
                    <p>created</p>
                    <p>{formatRelative(Date.parse(todo.date_created), new Date())}</p>
                </div>
            {/* </div> */}
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