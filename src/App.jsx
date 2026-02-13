import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/" element={
          <div>
            <h1>Публичная главная страница CMS</h1>
            <a href="/login">Войти в админ-панель</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App