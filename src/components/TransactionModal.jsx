import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import { getTodayDate } from '../utils/formatters';
import { addTransaction, updateTransaction } from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: getTodayDate(),
    note: '',
};

export default function TransactionModal({ isOpen, onClose, editTransaction }) {
    const { user } = useAuth();
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const isEditing = Boolean(editTransaction);

    useEffect(() => {
        if (editTransaction) {
            setForm({
                title: editTransaction.title || '',
                amount: editTransaction.amount || '',
                type: editTransaction.type || 'expense',
                category: editTransaction.category || '',
                date: editTransaction.date || getTodayDate(),
                note: editTransaction.note || '',
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setErrors({});
    }, [editTransaction, isOpen]);

    if (!isOpen) return null;

    const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
            errs.amount = 'Enter a valid positive amount';
        if (!form.category) errs.category = 'Select a category';
        if (!form.date) errs.date = 'Date is required';
        return errs;
    };

    const handleChange = (field, value) => {
        setForm((f) => {
            const updated = { ...f, [field]: value };
            if (field === 'type') updated.category = '';
            return updated;
        });
        if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            const data = {
                title: form.title.trim(),
                amount: parseFloat(form.amount),
                type: form.type,
                category: form.category,
                date: form.date,
                note: form.note.trim(),
            };

            if (isEditing) {
                await updateTransaction(editTransaction.id, data);
                toast.success('Transaction updated!');
            } else {
                await addTransaction(user.uid, data);
                toast.success('Transaction added!');
            }
            onClose();
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
            console.error(err);
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
            aria-labelledby="modal-title"
        >
            <div className="modal-box">
                <div className="modal-header">
                    <h2 className="modal-title" id="modal-title">
                        {isEditing ? '✏️ Edit Transaction' : '➕ Add Transaction'}
                    </h2>
                    <button
                        className="btn btn-icon"
                        onClick={onClose}
                        id="modal-close"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit} noValidate>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">Transaction Type</label>
                        <div className="type-toggle" role="group" aria-label="Transaction type">
                            <button
                                type="button"
                                className={`type-btn income ${form.type === 'income' ? 'active' : ''}`}
                                onClick={() => handleChange('type', 'income')}
                                id="type-income"
                            >
                                📈 Income
                            </button>
                            <button
                                type="button"
                                className={`type-btn expense ${form.type === 'expense' ? 'active' : ''}`}
                                onClick={() => handleChange('type', 'expense')}
                                id="type-expense"
                            >
                                📉 Expense
                            </button>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label" htmlFor="form-title">Title</label>
                        <input
                            id="form-title"
                            type="text"
                            className="form-input"
                            placeholder="e.g. Monthly Salary, Grocery Shopping..."
                            value={form.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            maxLength={80}
                            autoFocus
                        />
                        {errors.title && <span className="form-error">{errors.title}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label" htmlFor="form-amount">Amount (₹)</label>
                        <input
                            id="form-amount"
                            type="number"
                            className="form-input"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            min="0.01"
                            step="0.01"
                        />
                        {errors.amount && <span className="form-error">{errors.amount}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label" htmlFor="form-category">Category</label>
                        <select
                            id="form-category"
                            className="form-select"
                            value={form.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                        >
                            <option value="">Select category...</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.icon} {cat.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className="form-error">{errors.category}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 14 }}>
                        <label className="form-label" htmlFor="form-date">Date</label>
                        <input
                            id="form-date"
                            type="date"
                            className="form-input"
                            value={form.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            max={getTodayDate()}
                        />
                        {errors.date && <span className="form-error">{errors.date}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label className="form-label" htmlFor="form-note">Note (optional)</label>
                        <textarea
                            id="form-note"
                            className="form-textarea"
                            placeholder="Add a note..."
                            value={form.note}
                            onChange={(e) => handleChange('note', e.target.value)}
                            maxLength={200}
                            rows={2}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            type="button"
                            className="btn btn-secondary w-full"
                            onClick={onClose}
                            id="modal-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                            id="modal-submit"
                        >
                            {loading ? (
                                <span className="spinner" aria-label="Loading" />
                            ) : isEditing ? (
                                'Update'
                            ) : (
                                'Add Transaction'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
