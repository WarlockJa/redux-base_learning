import { ReactComponent as OpenAddTodoIcon } from '../../assets/plus-circle.svg'
import { ReactComponent as CloseAddTodoIcon } from '../../assets/minus-circle.svg'
import Spinner from "../../util/Spinner"
import { useGetTodosQuery } from "../api/apiSlice"
import AddTodo from "./AddTodo"
import TodoItem from "./TodoItem"
import { useMemo } from "react"
import ScrollToTopButton from '../../util/ScrollToTopButton'
import classnames from 'classnames'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAddTodoState, switchAddTodo } from './todosSlice'

const TodosList = () => {
    // redux store for addTodo menu state
    const addTodoMenuState = useAppSelector(selectAddTodoState)
    const dispatch = useAppDispatch()

    // RTK Query states for data fetching
    const {
        data: todos,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
    } = useGetTodosQuery()

    // sorting fetched data
    const sortedTodos = useMemo(() => {
        const sortedTodos = todos?.slice()
        sortedTodos?.sort((a,b) => b.date_created.localeCompare(a.date_created))
        return sortedTodos
    }, [todos])

    // forming content to render
    let content
    let containerClassname
    if(isLoading) {
        content = <>
            <Spinner embed={false} height='12em' width="100%"/>
            <Spinner embed={false} height='12em' width="100%"/>
            <Spinner embed={false} height='12em' width="100%"/>
            <Spinner embed={false} height='12em' width="100%"/>
        </>
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>
    } else if (isSuccess) {
        if(sortedTodos) {
            const renderedTodos = sortedTodos.map(todo => 
                <TodoItem key={todo.id} todo={todo} />
            )
            // adding 'translucent' class name to the already present data on a new POST request for css
            containerClassname = classnames('todos__contentContainer', {
                translucent: isFetching
            })

            content = renderedTodos
        }
    }

    // closing addTodo menu on successful POST
    const handleAddTodoIconClick = () => {
        dispatch(switchAddTodo())
    }

    return (
        <section className="todos">
            <h2>Todos <span>
                    {addTodoMenuState
                        ? <CloseAddTodoIcon onClick={() => handleAddTodoIconClick()} className='todos__button--addTodo svg-negative' />
                        : <OpenAddTodoIcon onClick={() => handleAddTodoIconClick()} className='todos__button--addTodo svg-positive' />
                    }
                </span>
            </h2>
            <div className="todos__addTodo--wrapper" visible={addTodoMenuState ? 1 : 0}>
                {addTodoMenuState && <AddTodo />}
            </div>
            <ul className={containerClassname} visible={addTodoMenuState ? 1 : 0}>
                {content}
            </ul>
            <ScrollToTopButton />
        </section>
    )
}

export default TodosList