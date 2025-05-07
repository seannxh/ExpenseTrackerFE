import { useState } from 'react'
import Login from './pages/homelogin'
import Signup from './pages/signup'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {


  return (
    <>
      <Routes>
       <Route path="/login" element={<Login/>}/>
       <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App
