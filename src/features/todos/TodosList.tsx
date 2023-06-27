import Icons from "../../assets/Icons";
import Spinner from "../../util/Spinner";
import AddTodo from "./AddTodo";
import TodoItem from "./TodoItem";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import ScrollToTopButton, { ScrollToTop } from "../../util/ScrollToTopButton";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAddTodoState, switchAddTodoMenuState } from "./todosSlice";
import { useGetTodosQuery } from "./todoApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/fontawesome-free-solid";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { selectUserData, setHidecompleted } from "../api/auth/authSlice";
import { useUpdateUserMutation } from "../api/user/userApiSlice";

const TodosList = () => {
  // redux store for addTodo menu state and filterCompletedTodos
  const addTodoMenuState = useAppSelector(selectAddTodoState);
  const dispatch = useAppDispatch();
  // store data for user option on hide completed tasks
  const { hidecompleted } = useAppSelector(selectUserData);
  const [updateUser, { isLoading: IsLoadingUpdateUser }] =
    useUpdateUserMutation();
  // addTodoMenu ref
  const addTodoRef = useRef<HTMLDivElement>(null);
  const [todoMenuHeight, setTodoMenuHeight] = useState(0);
  // Incomplete Todos found
  const [isCompleteTodoInList, setIsCompleteTodoInList] = useState(false);

  // scrolling to the top on route change
  useLayoutEffect(() => {
    ScrollToTop();
  }, []);

  useLayoutEffect(() => {
    addTodoMenuState
      ? setTodoMenuHeight(addTodoRef.current!.children[0].clientHeight)
      : setTodoMenuHeight(0);
  }, [addTodoMenuState]);

  // RTK Query states for data fetching
  const {
    data: todos,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();

  // sorting fetched data
  const sortedTodos = useMemo(() => {
    const sortedTodos = todos?.slice();
    sortedTodos?.sort((a, b) => b.date_created.localeCompare(a.date_created));
    return sortedTodos;
  }, [todos]);

  // forming content to render
  let content;
  let containerClassname;
  if (isLoading) {
    content = (
      <>
        <Spinner embed={false} height="16em" width="100%" />
        <Spinner embed={false} height="16em" width="100%" />
        <Spinner embed={false} height="16em" width="100%" />
        <Spinner embed={false} height="16em" width="100%" />
      </>
    );
  } else if (isError) {
    content = <p>There was an error fetching data</p>;
    // content = <pre>{JSON.stringify(error, null, 2)}</pre>
  } else if (isSuccess) {
    if (sortedTodos) {
      const renderedTodos = hidecompleted
        ? sortedTodos
            .filter((item) => item.completed === 0)
            .map((todo) => <TodoItem key={todo.id} todo={todo} />)
        : sortedTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />);
      // adding 'translucent' class name to the already present data on a new POST request
      containerClassname = classnames("todos__contentContainer", {
        translucent: isFetching,
        todosContentContainerEmpty: renderedTodos.length === 0,
      });

      sortedTodos.find((item) => item.completed)
        ? !isCompleteTodoInList && setIsCompleteTodoInList(true)
        : isCompleteTodoInList && setIsCompleteTodoInList(false);

      content =
        renderedTodos.length === 0 ? (
          <p>Everything is done! Good job!</p>
        ) : (
          renderedTodos
        );
    }
  }

  // closing addTodo menu on successful POST
  const handleAddTodoIconClick = () => {
    dispatch(switchAddTodoMenuState());
  };

  // changing hideCompleted in idToken and in DB
  const handleChangeHideCompleted = async () => {
    const result = await updateUser({ hidecompleted: !hidecompleted }).unwrap();
    if (result.status === 200) {
      dispatch(setHidecompleted({ hidecompleted: !hidecompleted }));
    } else {
      console.log(result);
    }
  };

  return (
    <section className="todos">
      <div className="todos__header">
        <h2>
          Tasks{" "}
          <span title="Open/close add todo menu">
            {addTodoMenuState ? (
              <Icons.CloseAddTodo
                onClick={() => handleAddTodoIconClick()}
                className="collapsingMenuButton svg-negative"
              />
            ) : (
              <Icons.OpenAddTodo
                onClick={() => handleAddTodoIconClick()}
                className="collapsingMenuButton svg-positive"
              />
            )}
          </span>
        </h2>
        {isCompleteTodoInList && (
          <div
            className={classnames("todos__header--filterCompletedTodosBlock", {
              translucent: IsLoadingUpdateUser,
            })}
          >
            <label
              title={
                hidecompleted ? "Show completed tasks" : "Hide completed tasks"
              }
              className="todos__header--filterCompletedTodosLabel"
              htmlFor="todos__header--filterCompletedCheckbox"
            >
              Hide{" "}
              <FontAwesomeIcon
                className="completed-fontColor"
                icon={faCheck as IconProp}
              />{" "}
            </label>
            <input
              title={
                hidecompleted
                  ? "Uncheck to show completed tasks"
                  : "Check to hide completed tasks"
              }
              aria-label="hide completed tasks"
              id="todos__header--filterCompletedCheckbox"
              className="todos__header--filterCompletedCheckbox"
              type="checkbox"
              checked={hidecompleted}
              disabled={IsLoadingUpdateUser}
              onChange={() => handleChangeHideCompleted()}
            />
          </div>
        )}
      </div>
      <div
        className="todos__addTodo--wrapper"
        ref={addTodoRef}
        visible={addTodoMenuState ? 1 : 0}
      >
        {addTodoMenuState && <AddTodo />}
      </div>
      <ul
        className={containerClassname}
        style={{ transform: `translateY(${todoMenuHeight}px)` }}
        visible={addTodoMenuState ? 1 : 0}
      >
        {content}
      </ul>
      <ScrollToTopButton />
    </section>
  );
};

export default TodosList;
