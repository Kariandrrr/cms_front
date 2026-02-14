import jwtDecode from 'jwt-decode';

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    setUser({ username: decoded.sub, role: decoded.role });
  }
}, []);