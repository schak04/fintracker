import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import FiltersBar from '../components/FiltersBar';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { formatCurrency } from '../utils/formatters';

const DEFAULT_FILTERS = {
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
};

export default function TransactionsPage() {
    const { transactions, loading, summary } = useTransactions();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTx, setEditTx] = useState(null);
    const [deleteTx, setDeleteTx] = useState(null);

    const handleFilterChange = (update) => setFilters((f) => ({ ...f, ...update }));
    const handleFilterReset = () => setFilters(DEFAULT_FILTERS);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.type !== 'all' && t.type !== filters.type) return false;
            if (filters.category !== 'all' && t.category !== filters.category) return false;
            if (filters.dateFrom && t.date < filters.dateFrom) return false;
            if (filters.dateTo && t.date > filters.dateTo) return false;
            return true;
        });
    }, [transactions, filters]);

    const filteredSummary = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
        const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
        return { income, expense };
    }, [filteredTransactions]);

    return (
        <div className="page-wrapper">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-greeting">All Transactions</h1>
                    <div className="dashboard-date">
                        {transactions.length} total records
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { setEditTx(null); setModalOpen(true); }}
                    id="tx-page-add-btn"
                >
                    <Plus size={16} /> Add Transaction
                </button>
            </div>

            {filteredTransactions.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: 20,
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        background: 'var(--income-bg)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtered Income</span>
                        <span style={{ color: 'var(--income)', fontWeight: 700 }}>{formatCurrency(filteredSummary.income)}</span>
                    </div>
                    <div style={{
                        background: 'var(--expense-bg)',
                        border: '1px solid rgba(244,63,94,0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtered Expense</span>
                        <span style={{ color: 'var(--expense)', fontWeight: 700 }}>{formatCurrency(filteredSummary.expense)}</span>
                    </div>
                </div>
            )}

            <FiltersBar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
            />

            <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                onEdit={(tx) => { setEditTx(tx); setModalOpen(true); }}
                onDelete={(tx) => setDeleteTx(tx)}
            />

            <button
                className="fab"
                onClick={() => { setEditTx(null); setModalOpen(true); }}
                id="tx-page-fab"
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
