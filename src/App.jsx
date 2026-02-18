import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';


function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <TransactionsProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <AppLayout>
                                            <DashboardPage />
                                        </AppLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/transactions"
                                element={
                                    <ProtectedRoute>
                                        <AppLayout>
                                            <TransactionsPage />
                                        </AppLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <AppLayout>
                                            <ProfilePage />
                                        </AppLayout>
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>

                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '0.875rem',
                                    boxShadow: 'var(--shadow-lg)',
                                },
                                success: {
                                    iconTheme: { primary: '#10b981', secondary: 'white' },
                                },
                                error: {
                                    iconTheme: { primary: '#f43f5e', secondary: 'white' },
                                },
                            }}
                        />
                    </BrowserRouter>
                </TransactionsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
