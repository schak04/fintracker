import {
    Briefcase, Monitor, TrendingUp, Building2, Home, Gift, Coins,
    UtensilsCrossed, Car, ShoppingBag, Film, Hospital, BookOpen,
    Lightbulb, Plane, Smartphone, Package
} from 'lucide-react';

export const INCOME_CATEGORIES = [
    { value: 'salary', label: 'Salary', icon: <Briefcase size={16} />, color: '#10b981' },
    { value: 'freelance', label: 'Freelance', icon: <Monitor size={16} />, color: '#06b6d4' },
    { value: 'investment', label: 'Investment', icon: <TrendingUp size={16} />, color: '#6366f1' },
    { value: 'business', label: 'Business', icon: <Building2 size={16} />, color: '#8b5cf6' },
    { value: 'rental', label: 'Rental', icon: <Home size={16} />, color: '#f59e0b' },
    { value: 'gift', label: 'Gift', icon: <Gift size={16} />, color: '#ec4899' },
    { value: 'other_income', label: 'Other Income', icon: <Coins size={16} />, color: '#84cc16' },
];

export const EXPENSE_CATEGORIES = [
    { value: 'food', label: 'Food & Dining', icon: <UtensilsCrossed size={16} />, color: '#f97316' },
    { value: 'transport', label: 'Transport', icon: <Car size={16} />, color: '#3b82f6' },
    { value: 'shopping', label: 'Shopping', icon: <ShoppingBag size={16} />, color: '#ec4899' },
    { value: 'entertainment', label: 'Entertainment', icon: <Film size={16} />, color: '#8b5cf6' },
    { value: 'health', label: 'Health', icon: <Hospital size={16} />, color: '#ef4444' },
    { value: 'education', label: 'Education', icon: <BookOpen size={16} />, color: '#06b6d4' },
    { value: 'utilities', label: 'Utilities', icon: <Lightbulb size={16} />, color: '#f59e0b' },
    { value: 'rent', label: 'Rent', icon: <Home size={16} />, color: '#10b981' },
    { value: 'travel', label: 'Travel', icon: <Plane size={16} />, color: '#6366f1' },
    { value: 'subscriptions', label: 'Subscriptions', icon: <Smartphone size={16} />, color: '#84cc16' },
    { value: 'other_expense', label: 'Other', icon: <Package size={16} />, color: '#94a3b8' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategoryInfo(value) {
    return ALL_CATEGORIES.find((c) => c.value === value) || {
        value,
        label: value,
        icon: <Package size={16} />,
        color: '#94a3b8',
    };
}

export const CHART_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981',
    '#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#84cc16',
    '#14b8a6', '#a855f7',
];
