import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="page-loader" aria-label="Loading">
                <div className="page-loader-spinner" />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading FinTracker...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
