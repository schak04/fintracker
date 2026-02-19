import { memo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { getCategoryInfo } from '../utils/categories.jsx';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionItem = memo(function TransactionItem({ transaction, onEdit, onDelete, index }) {
    const cat = getCategoryInfo(transaction.category);

    return (
        <li
            className="transaction-item"
            style={{ animationDelay: `${index * 40}ms` }}
            id={`transaction-${transaction.id}`}
        >
            <div
                className="transaction-icon"
                style={{ background: `${cat.color}20` }}
                aria-hidden="true"
            >
                {cat.icon}
            </div>

            <div className="transaction-info">
                <div className="transaction-title">{transaction.title}</div>
                <div className="transaction-meta">
                    <span className="transaction-category">{cat.label}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>•</span>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                    {transaction.note && (
                        <>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>•</span>
                            <span className="transaction-note" title={transaction.note}>
                                {transaction.note}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
            </div>

            <div className="transaction-actions">
                <button
                    className="btn btn-icon btn-sm"
                    onClick={() => onEdit(transaction)}
                    title="Edit transaction"
                    id={`edit-${transaction.id}`}
                    aria-label={`Edit ${transaction.title}`}
                >
                    <Pencil size={13} />
                </button>
                <button
                    className="btn btn-icon btn-sm"
                    onClick={() => onDelete(transaction)}
                    title="Delete transaction"
                    id={`delete-${transaction.id}`}
                    aria-label={`Delete ${transaction.title}`}
                    style={{ color: 'var(--expense)' }}
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </li>
    );
});

export default TransactionItem;
