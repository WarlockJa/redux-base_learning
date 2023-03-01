import './App.css'
import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Counter from "./features/counter/Counter"
import PostsList from './features/posts/PostsList'
import TodosList from './features/todos/TodosList'
import SinglePostPage from './features/posts/SinglePostPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Counter />}/>
        
        <Route path='posts'>
          <Route index element={<PostsList />}/>
          <Route path=':postId' element={<SinglePostPage />}/>
        </Route>

        <Route path='todos'>
          <Route index element={<TodosList />}/>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App
