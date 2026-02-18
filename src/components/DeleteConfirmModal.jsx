import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { deleteTransaction } from '../services/transactionService';
import toast from 'react-hot-toast';

export default function DeleteConfirmModal({ transaction, onClose }) {
    const [loading, setLoading] = useState(false);

    if (!transaction) return null;

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteTransaction(transaction.id);
            toast.success('Transaction deleted');
            onClose();
        } catch {
            toast.error('Failed to delete transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div className="modal-box" style={{ maxWidth: 400 }}>
                <div className="modal-header">
                    <h2 className="modal-title" id="delete-modal-title" style={{ color: 'var(--expense)' }}>
                        <AlertTriangle size={18} style={{ display: 'inline', marginRight: 6 }} />
                        Delete Transaction
                    </h2>
                    <button className="btn btn-icon" onClick={onClose} id="delete-modal-close" aria-label="Close">
                        <X size={16} />
                    </button>
                </div>
                <div className="modal-body">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                        Are you sure you want to delete{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>"{transaction.title}"</strong>?
                        This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary w-full" onClick={onClose} id="delete-cancel">
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger w-full"
                            onClick={handleDelete}
                            disabled={loading}
                            id="delete-confirm"
                        >
                            {loading ? <span className="spinner" /> : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
