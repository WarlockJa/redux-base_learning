import './App.css'
import './features/posts/posts.css'
import './features/todos/todos.css'
import { Navigate, useRoutes } from "react-router-dom"
import Layout from "./components/Layout"
import Counter from "./features/counter/Counter"
import PostsList from './features/posts/PostsList'
import TodosList from './features/todos/TodosList'
import SinglePostPage from './features/posts/SinglePostPage'

function App() {
  const RoutesElement = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Counter />
        },
        {
          path: '/posts',
          children: [
            {
              index: true,
              element: <PostsList />,
            },
            {
              path: ':categoryId',
              children: [
                {
                  index: true,
                  element: <PostsList />,
                },
                {
                  path: ':postId',
                  element: <SinglePostPage />
                }
              ]
            }
          ]
        },
        {
          path: '/todos',
          element: <TodosList />
        },
        {
          path: '/*',
          element: <Navigate to='/' replace />
        }
      ]
    }
  ])

  return (
    RoutesElement
  )
}

export default App
