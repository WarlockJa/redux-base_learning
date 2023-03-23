import './App.css'
import './features/posts/posts.css'
import './features/todos/todos.css'
import { Navigate, useRoutes } from "react-router-dom"
import Layout from "./components/Layout"
import Counter from "./features/counter/Counter"
import PostsList from './features/posts/PostsList'
import TodosList from './features/todos/TodosList'
import SinglePostPage from './features/posts/SinglePostPage'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Register'

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
          path: '/register',
          element: <Register />
        },
        {
          path: '/todos',
          element: <ProtectedRoute renavigate='/'><TodosList /></ProtectedRoute>
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
