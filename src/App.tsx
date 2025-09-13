import Login from './pages/homelogin'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Signup from './pages/signup'

function App() {


  return (
    <>
      <Routes>
       <Route path="/login" element={<Login/>}/>
       <Route path="/" element={<Signup />} />
       <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  )
}

export default App
