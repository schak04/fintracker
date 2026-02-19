import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';


export default function LoginPage() {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm((f) => ({ ...f, [field]: value }));
        if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

    const validate = () => {
        const errs = {};
        if (mode === 'signup' && !form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
        if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
        if (mode === 'signup' && form.password !== form.confirm) errs.confirm = 'Passwords do not match';
        return errs;
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setLoading(true);
        try {
            if (mode === 'login') {
                await signInWithEmail(form.email, form.password);
                toast.success('Welcome back!');
                navigate('/dashboard');
            } else {
                await signUpWithEmail(form.email, form.password, form.name);
                toast.success('Account created! Welcome to FinTracker!');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.code === 'auth/user-not-found' ? 'No account found with this email'
                : err.code === 'auth/wrong-password' ? 'Incorrect password'
                    : err.code === 'auth/email-already-in-use' ? 'Email already in use'
                        : err.code === 'auth/invalid-credential' ? 'Invalid email or password'
                            : 'Authentication failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success('Signed in with Google!');
            navigate('/dashboard');
        } catch {
            toast.error('Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-orb auth-bg-orb-1" aria-hidden="true" />
            <div className="auth-bg-orb auth-bg-orb-2" aria-hidden="true" />

            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="logo-icon" style={{ width: 44, height: 44, fontSize: '1.4rem' }}>
                            <Wallet size={24} />
                        </div>
                        <span className="logo-text" style={{ fontSize: '1.5rem' }}>FinTracker</span>
                    </div>

                    <h1 className="auth-title">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="auth-subtitle">
                        {mode === 'login'
                            ? 'Sign in to manage your finances'
                            : 'Start tracking your money today'}
                    </p>

                    <button
                        className="google-btn"
                        onClick={handleGoogle}
                        disabled={loading}
                        id="google-signin-btn"
                        type="button"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">or</span>
                        <div className="auth-divider-line" />
                    </div>

                    <form className="auth-form" onSubmit={handleEmailAuth} noValidate>
                        {mode === 'signup' && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="auth-name">Full Name</label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    autoComplete="name"
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="auth-email">Email</label>
                            <input
                                id="auth-email"
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                autoComplete="email"
                            />
                            {errors.email && <span className="form-error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="auth-password">Password</label>
                            <input
                                id="auth-password"
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                            {errors.password && <span className="form-error">{errors.password}</span>}
                        </div>

                        {mode === 'signup' && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="auth-confirm">Confirm Password</label>
                                <input
                                    id="auth-confirm"
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={form.confirm}
                                    onChange={(e) => handleChange('confirm', e.target.value)}
                                    autoComplete="new-password"
                                />
                                {errors.confirm && <span className="form-error">{errors.confirm}</span>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={loading}
                            id="auth-submit-btn"
                            style={{ marginTop: 4 }}
                        >
                            {loading ? (
                                <span className="spinner" aria-label="Loading" />
                            ) : mode === 'login' ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {mode === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <a onClick={() => { setMode('signup'); setErrors({}); setForm({ name: '', email: '', password: '', confirm: '' }); }} id="switch-to-signup">
                                    Sign up
                                </a>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <a onClick={() => { setMode('login'); setErrors({}); setForm({ name: '', email: '', password: '', confirm: '' }); }} id="switch-to-login">
                                    Sign in
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
