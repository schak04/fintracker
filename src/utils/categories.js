export const INCOME_CATEGORIES = [
    { value: 'salary', label: 'Salary', icon: '💼', color: '#10b981' },
    { value: 'freelance', label: 'Freelance', icon: '💻', color: '#06b6d4' },
    { value: 'investment', label: 'Investment', icon: '📈', color: '#6366f1' },
    { value: 'business', label: 'Business', icon: '🏢', color: '#8b5cf6' },
    { value: 'rental', label: 'Rental', icon: '🏠', color: '#f59e0b' },
    { value: 'gift', label: 'Gift', icon: '🎁', color: '#ec4899' },
    { value: 'other_income', label: 'Other Income', icon: '💰', color: '#84cc16' },
];

export const EXPENSE_CATEGORIES = [
    { value: 'food', label: 'Food & Dining', icon: '🍔', color: '#f97316' },
    { value: 'transport', label: 'Transport', icon: '🚗', color: '#3b82f6' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    { value: 'health', label: 'Health', icon: '🏥', color: '#ef4444' },
    { value: 'education', label: 'Education', icon: '📚', color: '#06b6d4' },
    { value: 'utilities', label: 'Utilities', icon: '💡', color: '#f59e0b' },
    { value: 'rent', label: 'Rent', icon: '🏠', color: '#10b981' },
    { value: 'travel', label: 'Travel', icon: '✈️', color: '#6366f1' },
    { value: 'subscriptions', label: 'Subscriptions', icon: '📱', color: '#84cc16' },
    { value: 'other_expense', label: 'Other', icon: '📦', color: '#94a3b8' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategoryInfo(value) {
    return ALL_CATEGORIES.find((c) => c.value === value) || {
        value,
        label: value,
        icon: '📦',
        color: '#94a3b8',
    };
}

export const CHART_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981',
    '#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#84cc16',
    '#14b8a6', '#a855f7',
];
