import { ITodo } from "./todosSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faCheck, faMinusCircle } from "@fortawesome/fontawesome-free-solid"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { formatRelative } from "date-fns"
import { ErrorBoundary } from "react-error-boundary"
import ErrorPlug from "../../util/ErrorPlug"
import { useDeleteTodoMutation } from "../api/apiSlice"
import classNames from "classnames"


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

    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(todo.id).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <li className={classNames('todoItem', { translucent: isLoading })}>
            <div className="todoItem__body">
                <h2>{todo.title}</h2>
                <p>{todo.description}</p>
            </div>
            <div className="todoItem__completedState faIcon-container">
                {todo.completed
                    ? <FontAwesomeIcon icon={faCheck as IconProp} />
                    : <FontAwesomeIcon icon={faMinusCircle as IconProp} />
                }
            </div>
            <div className="todoItem__footer">
                <div className="todoItem__footer--dateCreated">
                    <p>created</p>
                    <p>{formatRelative(Date.parse(todo.date_created), new Date())}</p>
                </div>
                <div className="todoItem__footer--dateDue">
                    <p>due</p>
                    {todo.date_due
                        ? <p>{formatRelative(Date.parse(todo.date_due), new Date())}</p>
                        : <p>Set due date</p>
                    }
                </div>
                <div className="todoItem__footer--setReminder">
                    <input type="checkbox" id="todoItem__footer--reminder" disabled={todo.date_due ? false : true} />
                    <label htmlFor="todoItem__footer--reminder">Set reminder</label>
                </div>
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