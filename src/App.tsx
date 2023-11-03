import "./App.css";
import "./features/posts/posts.css";
import "./features/todos/todos.css";
import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./components/Routing/Layout";
import PostsList from "./features/posts/PostsList";
import TodosList from "./features/todos/TodosList";
import SinglePostPage from "./features/posts/SinglePostPage";
import Register from "./components/Register/Register";
import Preferences from "./components/Preferences/Preferences";
import UnprotectedRouteOnly from "./components/Routing/UnprotectedRouteOnly";
import ProtectedRoute from "./components/Routing/ProtectedRoute";
import Home from "./components/Home/Home";

function App() {
  const RoutesElement = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/posts",
          children: [
            {
              index: true,
              element: <PostsList />,
            },
            {
              path: ":categoryId",
              children: [
                {
                  index: true,
                  element: <PostsList />,
                },
                {
                  path: ":postId",
                  element: <SinglePostPage />,
                },
              ],
            },
          ],
        },
        {
          path: "/register",
          element: (
            <UnprotectedRouteOnly renavigate="/">
              <Register />
            </UnprotectedRouteOnly>
          ),
        },
        {
          path: "/todos",
          element: (
            <ProtectedRoute renavigate="/">
              <TodosList />
            </ProtectedRoute>
          ),
        },
        {
          path: "/preferences",
          element: (
            <ProtectedRoute renavigate="/">
              <Preferences />
            </ProtectedRoute>
          ),
        },
        {
          path: "/*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);

  return RoutesElement;
}

export default App;
