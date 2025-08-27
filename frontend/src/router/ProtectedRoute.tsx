import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingPage from '../components/ui/LoadingPage';

export const ProtectedRoute = () => {
    const { isAuthChecked, isAuthenticated } = useAuthStore();

    if (!isAuthChecked) {
        return <LoadingPage />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};