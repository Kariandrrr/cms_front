import {useState} from 'react';
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({username: "", password: ""});
    const [error, setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await login(form.username, form.password);
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Неверный логин или пароль");
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--accent)' }}>
          Вход в админ-панель
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Логин"
            className="w-full px-4 py-3 rounded"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-4 py-3 rounded"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded font-semibold text-white"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}