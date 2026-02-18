import { format, parseISO, isValid } from 'date-fns';

export function formatCurrency(amount, currency = '₹') {
    const num = Number(amount);
    if (isNaN(num)) return `${currency}0.00`;
    return `${currency}${Math.abs(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        if (!isValid(date)) return dateStr;
        return format(date, 'dd MMM yyyy');
    } catch {
        return dateStr;
    }
}

export function formatDateInput(dateStr) {
    if (!dateStr) return '';
    try {
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        if (!isValid(date)) return '';
        return format(date, 'yyyy-MM-dd');
    } catch {
        return '';
    }
}

export function getTodayDate() {
    return format(new Date(), 'yyyy-MM-dd');
}

export function getMonthYear(dateStr) {
    if (!dateStr) return '';
    try {
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        if (!isValid(date)) return '';
        return format(date, 'MMM yyyy');
    } catch {
        return '';
    }
}
