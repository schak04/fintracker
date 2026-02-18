import { useState, useEffect, useMemo } from 'react';
import { subscribeToTransactions } from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';

export function useTransactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToTransactions(user.uid, (data) => {
            setTransactions(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const summary = useMemo(() => {
        const income = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const expense = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);

    return { transactions, loading, error, summary };
}
