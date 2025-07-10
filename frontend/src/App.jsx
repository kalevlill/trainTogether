import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Layout from './Layout/Layout'
import RegisterPage from './pages/RegisterPage'
import Auth from './components/Auth'


function App() {

  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Auth type='RegisterPage' />} />

      </Routes>
    </Layout>
    </BrowserRouter>
  )
}

export default App;
