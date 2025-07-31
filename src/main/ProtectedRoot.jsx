import { Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';

const ProtectedRoute = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <RootLayout />;
};

export default ProtectedRoute;
