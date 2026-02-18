import TransactionItem from './TransactionItem';
import { Receipt } from 'lucide-react';

export default function TransactionList({ transactions, onEdit, onDelete, loading }) {
    if (loading) {
        return (
            <div className="transactions-section">
                <div className="section-header">
                    <span className="section-title">Transactions</span>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ padding: '16px 24px', display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div className="skeleton" style={{ height: 14, width: '40%' }} />
                            <div className="skeleton" style={{ height: 11, width: '25%' }} />
                        </div>
                        <div className="skeleton" style={{ height: 16, width: 80 }} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="transactions-section" role="region" aria-label="Transaction list">
            <div className="section-header">
                <span className="section-title">Transactions</span>
                <span className="section-count">{transactions.length} records</span>
            </div>

            {transactions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><Receipt size={48} strokeWidth={1} /></div>
                    <div className="empty-title">No transactions found</div>
                    <div className="empty-sub">Add your first transaction using the + button below</div>
                </div>
            ) : (
                <ul className="transaction-list" aria-label="Transaction records">
                    {transactions.map((t, i) => (
                        <TransactionItem
                            key={t.id}
                            transaction={t}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            index={i}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
