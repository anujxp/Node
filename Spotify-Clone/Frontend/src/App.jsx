import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Register from './components/Resgister'
import Login from './components/Login'

function App() {


  return (
    <>
      <Header/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
