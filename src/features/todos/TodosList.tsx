import Spinner from "../../util/Spinner"
import { useGetTodosQuery } from "../api/apiSlice"
import AddTodo from "./AddTodo"

const TodosList = () => {
    const {
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery()

    let content
    if(isLoading) {
        content = <>
            <Spinner />
            <Spinner />
            <Spinner />
            <Spinner />
            <Spinner />
        </>
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>
    } else if (isSuccess) {
        content = todos.map(todo => 
            <li key={todo.id}>
                <p>{todo.title}</p>
                <div className="todoFooter">
                    <p>{todo.userId}</p>
                    <p>{todo.completed ? 'Completed' : 'Not completed'}</p>
                </div>
            </li>
        )
    }

    return (
        <section className="todos">
            <h2>Todos</h2>
            <AddTodo />
            <ul>
                {content}
            </ul>
        </section>
    )
}

export default TodosList