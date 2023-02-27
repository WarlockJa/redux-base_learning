import { Navigate, Route, Routes } from 'react-router-dom'
import Counter from './features/counter/Counter'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Counter />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />}/>
    </Routes>
  )
}

export default App
