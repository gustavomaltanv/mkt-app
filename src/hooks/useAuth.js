import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const isAdmin = decodedToken.isAdmin || false;
            console.log('Token Decodificado:', decodedToken);
            return { isAuthenticated: true, isAdmin };

        } catch (error) {
            console.error("Token inválido:", error);
            return { isAuthenticated: false, isAdmin: false };
        }
    }

    return { isAuthenticated: false, isAdmin: false };
};