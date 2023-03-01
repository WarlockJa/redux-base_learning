import { useAppSelector } from "../../app/hooks"
import AddTodo from "./AddTodo"

const TodosList = () => {
    const todos = useAppSelector((state) => state.todos)

    const todosList = todos.map(todo => 
        <li key={todo.id}>
            <p>{todo.title}</p>
            <div className="todoFooter">
                <p>{todo.userId}</p>
                <p>{todo.completed ? 'Completed' : 'Not completed'}</p>
            </div>
        </li>
    )

    return (
        <section className="todos">
            <h2>Todos</h2>
            <AddTodo />
            <ul>
                {todosList}
            </ul>
        </section>
    )
}

export default TodosList