import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {

  return (
    <BrowserRouter>
    <Routes>
    <Route  path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path='/register' element={<Auth mode='Register' />} />
    <Route path='/login' element={<Auth mode='Login'/>} />
    </Routes>
   </BrowserRouter>
  )
}

export default App
