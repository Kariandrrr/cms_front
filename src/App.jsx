import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';


import Login from './pages/Login.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ArticlesList from './pages/admin/ArticlesList.jsx';
import PublicHome from './pages/public/Home.jsx';
import ArticleView from './pages/public/ArticleView.jsx';

export default function App() {
    {return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="articles" element={<ArticlesList />} />

          </Route>
        </Route>
        <Route path="/" element={<PublicHome />} />
        <Route path="/articles/:slug" element={<ArticleView />} />
      </Routes>

    </BrowserRouter>
  );
}
}





