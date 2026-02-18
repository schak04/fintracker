import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';
import { User, Mail, Calendar, TrendingUp, TrendingDown, Wallet, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { clearAllTransactions } from '../services/transactionService';

export default function ProfilePage() {
    const { user } = useAuth();
    const { summary, transactions } = useTransactions();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!displayName.trim()) { toast.error('Name cannot be empty'); return; }
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, { displayName: displayName.trim() });
            toast.success('Profile updated!');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleClearData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await clearAllTransactions(user.uid);
            toast.success('All data cleared successfully');
            setShowConfirmClear(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to clear data');
        } finally {
            setLoading(false);
        }
    };

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() || 'U';

    const joinedDate = user?.metadata?.creationTime
        ? format(new Date(user.metadata.creationTime), 'MMMM yyyy')
        : 'Unknown';

    return (
        <div className="page-wrapper">
            <h1 className="dashboard-greeting" style={{ marginBottom: 28 }}>My Profile</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', fontWeight: 700, color: 'white',
                            flexShrink: 0, boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                        }}>
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : initials}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user?.displayName || 'User'}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Mail size={13} /> {user?.email}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Calendar size={13} /> Member since {joinedDate}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                        Financial Overview
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { icon: <Wallet size={16} />, label: 'Net Balance', value: formatCurrency(summary.balance), color: 'var(--accent-light)' },
                            { icon: <TrendingUp size={16} />, label: 'Total Income', value: formatCurrency(summary.income), color: 'var(--income)' },
                            { icon: <TrendingDown size={16} />, label: 'Total Expenses', value: formatCurrency(summary.expense), color: 'var(--expense)' },
                        ].map((item) => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <span style={{ color: item.color }}>{item.icon}</span>
                                    {item.label}
                                </div>
                                <div style={{ fontWeight: 700, color: item.color }}>{item.value}</div>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Transactions</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{transactions.length}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                        Edit Profile
                    </div>
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="profile-name">Display Name</label>
                            <input
                                id="profile-name"
                                type="text"
                                className="form-input"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={user?.email || ''}
                                disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            id="profile-save-btn"
                        >
                            {loading ? <span className="spinner" /> : 'Save Changes'}
                        </button>
                    </form>
                </div>

                <div className="card" style={{ gridColumn: '1 / -1', border: '1px solid rgba(244, 63, 94, 0.2)', background: 'rgba(244, 63, 94, 0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--expense)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                                Danger Zone
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                This will permanently delete all your transactions and reset your balance. This action cannot be undone.
                            </div>
                        </div>

                        {!showConfirmClear ? (
                            <button
                                className="btn"
                                style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--expense)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
                                onClick={() => setShowConfirmClear(true)}
                                id="profile-clear-init-btn"
                            >
                                <Trash2 size={16} /> Clear All Data
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--expense)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    <AlertTriangle size={14} /> Are you sure?
                                </div>
                                <button
                                    className="btn"
                                    style={{ background: 'var(--expense)', color: 'white' }}
                                    onClick={handleClearData}
                                    disabled={loading}
                                    id="profile-clear-confirm-btn"
                                >
                                    {loading ? <span className="spinner" /> : 'Yes, Delete Everything'}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirmClear(false)}
                                    disabled={loading}
                                    id="profile-clear-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
