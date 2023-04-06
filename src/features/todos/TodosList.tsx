import Icons from "../../assets/Icons"
import Spinner from "../../util/Spinner"
import AddTodo from "./AddTodo"
import TodoItem from "./TodoItem"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import ScrollToTopButton, { ScrollToTop } from '../../util/ScrollToTopButton'
import classnames from 'classnames'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAddTodoState, switchAddTodo } from './todosSlice'
import { useGetTodosQuery } from './todoApiSlice'

const TodosList = () => {
    // redux store for addTodo menu state
    const addTodoMenuState = useAppSelector(selectAddTodoState)
    const dispatch = useAppDispatch()

    // addTodoMenu ref
    const addTodoRef = useRef<HTMLDivElement>(null)
    const [todoMenuHeight, setTodoMenuHeight] = useState(0)

    // scrolling to the top on route change
    useLayoutEffect (() => {
        ScrollToTop()
    },[])

    useLayoutEffect(() => {
        addTodoMenuState
            ? setTodoMenuHeight(addTodoRef.current!.children[0].clientHeight)
            : setTodoMenuHeight(0)
    },[addTodoMenuState])

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
            <Spinner embed={false} height='16em' width="100%"/>
            <Spinner embed={false} height='16em' width="100%"/>
            <Spinner embed={false} height='16em' width="100%"/>
            <Spinner embed={false} height='16em' width="100%"/>
        </>
    } else if (isError) {
        content = <p>There was an error fetching data</p>
        // content = <pre>{JSON.stringify(error, null, 2)}</pre>
    } else if (isSuccess) {
        if(sortedTodos && sortedTodos.length > 0) {
            const renderedTodos = sortedTodos.map(todo => 
                <TodoItem key={todo.id} todo={todo} />
            )
            // adding 'translucent' class name to the already present data on a new POST request for css
            containerClassname = classnames('todos__contentContainer', {
                translucent: isFetching,
            })

            content = renderedTodos
        } else {
            content = <p>Everything is done! Good job!</p>
        }
    }

    // closing addTodo menu on successful POST
    const handleAddTodoIconClick = () => {
        dispatch(switchAddTodo())
    }

    return (
        <section className="todos">
            <h2>Todos <span title='Open/close add todo menu'>
                    {addTodoMenuState
                        ? <Icons.CloseAddTodo onClick={() => handleAddTodoIconClick()} className='collapsingMenuButton svg-negative' />
                        : <Icons.OpenAddTodo onClick={() => handleAddTodoIconClick()} className='collapsingMenuButton svg-positive' />
                    }
                </span>
            </h2>
            <div className="todos__addTodo--wrapper" ref={addTodoRef} visible={addTodoMenuState ? 1 : 0}>
                {addTodoMenuState && <AddTodo />}
            </div>
            <ul
                className={containerClassname}
                style={{ transform: `translateY(${todoMenuHeight}px)`}}
                visible={addTodoMenuState ? 1 : 0}
            >
                {content}
            </ul>
            <ScrollToTopButton />
        </section>
    )
}

export default TodosList