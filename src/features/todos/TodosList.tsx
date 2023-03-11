import { ReactComponent as AddTodoIcon } from '../../assets/plus-circle.svg'
import Spinner from "../../util/Spinner"
import { useGetTodosQuery } from "../api/apiSlice"
import AddTodo from "./AddTodo"
import TodoItem from "./TodoItem"
import { useState } from "react"
import ScrollToTopButton from '../../util/ScrollToTopButton'

const TodosList = () => {
    const [addTodoMenuVisible, setAddTodoMenuVisible] = useState(false)

    const {
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery()

    // when todo fields finalized and needed to be sorted by date
    // const sortedTodos = useMemo(() => {
    //     if(todos) {
    //         const sortedTodos = todos.slice()
    //         // Sort posts in descending chronological order
    //         sortedTodos.sort((a, b) => b.date.localeCompare(a.date))
    //         return sortedTodos
    //     } return todos
    // }, [todos])

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
            <TodoItem key={todo.id} todo={todo} />
        )
    }

    return (
        <section className="todos">
            {/* <h2>Todos <span onClick={() => setAddTodoMenuVisible((prev) => !prev)}><img className="todos__button--addTodo" src={AddTodoIcon2} alt="show add todo menu"/></span></h2> */}
            <h2>Todos <span><AddTodoIcon onClick={() => setAddTodoMenuVisible((prev) => !prev)} className='todos__button--addTodo' /></span></h2>
            {/* <img onClick={() => setAddTodoMenuVisible((prev) => !prev)} className="todos__button--addTodo" src={AddTodoIcon} alt="show add todo menu"/> */}
            <AddTodo visibility={addTodoMenuVisible} />
            <ul className='test' visible={addTodoMenuVisible ? 1 : 0}>
                {content}
            </ul>
            <ScrollToTopButton />
        </section>
    )
}

export default TodosList