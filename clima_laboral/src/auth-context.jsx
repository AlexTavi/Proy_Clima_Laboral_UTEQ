import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        restoreSession();

        const handleStorage = () => restoreSession();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    function restoreSession() {
        const token = localStorage.getItem('token');
        const usr   = localStorage.getItem('usuario');
        if (token && usr) {
            setUser(JSON.parse(usr));        // Sesión válida
        } else {
            setUser(null);                   // No hay sesión
        }
    }
    function login(token, usr) {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usr));
        setUser(usr);
    }
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
