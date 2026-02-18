import { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Charts';
import FiltersBar from '../components/FiltersBar';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_FILTERS = {
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
};

export default function DashboardPage() {
    const { user } = useAuth();
    const { transactions, loading, summary, error } = useTransactions();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTx, setEditTx] = useState(null);
    const [deleteTx, setDeleteTx] = useState(null);

    const handleFilterChange = useCallback((update) => {
        setFilters((f) => ({ ...f, ...update }));
    }, []);

    const handleFilterReset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    const handleEdit = useCallback((tx) => {
        setEditTx(tx);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((tx) => {
        setDeleteTx(tx);
    }, []);

    const filteredTransactions = useMemo(() => {
        if (!filters.search && filters.type === 'all' && filters.category === 'all' && !filters.dateFrom && !filters.dateTo) {
            return transactions;
        }
        const searchLower = filters.search.toLowerCase();
        return transactions.filter((t) => {
            if (filters.search && !t.title.toLowerCase().includes(searchLower)) return false;
            if (filters.type !== 'all' && t.type !== filters.type) return false;
            if (filters.category !== 'all' && t.category !== filters.category) return false;
            if (filters.dateFrom && t.date < filters.dateFrom) return false;
            if (filters.dateTo && t.date > filters.dateTo) return false;
            return true;
        });
    }, [transactions, filters]);

    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const name = user?.displayName?.split(' ')[0] || 'there';

    return (
        <div className="page-wrapper">

            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-greeting">
                        {greeting}, {name}! 👋
                    </h1>
                    <div className="dashboard-date">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { setEditTx(null); setModalOpen(true); }}
                    id="add-transaction-btn"
                >
                    <Plus size={16} /> Add Transaction
                </button>
            </div>

            <SummaryCards summary={summary} transactionCount={transactions.length} />

            {error && (
                <div style={{
                    padding: '12px 16px',
                    margin: '0 0 24px 0',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    borderRadius: '12px',
                    color: 'var(--expense)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <span>⚠️</span> {error}
                </div>
            )}

            {transactions.length > 0 && <Charts transactions={transactions} />}

            <FiltersBar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
            />

            <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <button
                className="fab"
                onClick={() => { setEditTx(null); setModalOpen(true); }}
                id="fab-add-btn"
                aria-label="Add new transaction"
                title="Add Transaction"
            >
                <Plus size={24} />
            </button>

            <TransactionModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditTx(null); }}
                editTransaction={editTx}
            />
            <DeleteConfirmModal
                transaction={deleteTx}
                onClose={() => setDeleteTx(null)}
            />
        </div>
    );
}
