import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ALL_CATEGORIES } from '../utils/categories.jsx';
import { useState, useEffect } from 'react';

export default function FiltersBar({ filters, onChange, onReset }) {
    const [searchTerm, setSearchTerm] = useState(filters.search);

    useEffect(() => {
        setSearchTerm(filters.search);
    }, [filters.search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                onChange({ search: searchTerm });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, onChange, filters.search]);

    const hasActiveFilters =
        filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo;

    return (
        <div className="filters-bar" role="search" aria-label="Filter transactions">
            <div className="search-wrapper">
                <Search size={15} className="search-icon" aria-hidden="true" />
                <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    id="filter-search"
                    aria-label="Search transactions"
                />
            </div>

            <div className="filter-group">
                <span className="filter-label">Type</span>
                <select
                    className="form-select filter-select"
                    value={filters.type}
                    onChange={(e) => onChange({ type: e.target.value })}
                    id="filter-type"
                    aria-label="Filter by type"
                >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            <div className="filter-group">
                <span className="filter-label">Category</span>
                <select
                    className="form-select filter-select"
                    value={filters.category}
                    onChange={(e) => onChange({ category: e.target.value })}
                    id="filter-category"
                    aria-label="Filter by category"
                >
                    <option value="all">All</option>
                    {ALL_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <span className="filter-label">From</span>
                <input
                    type="date"
                    className="form-input"
                    value={filters.dateFrom}
                    onChange={(e) => onChange({ dateFrom: e.target.value })}
                    id="filter-date-from"
                    aria-label="From date"
                    style={{ minWidth: 130 }}
                />
            </div>

            <div className="filter-group">
                <span className="filter-label">To</span>
                <input
                    type="date"
                    className="form-input"
                    value={filters.dateTo}
                    onChange={(e) => onChange({ dateTo: e.target.value })}
                    id="filter-date-to"
                    aria-label="To date"
                    style={{ minWidth: 130 }}
                />
            </div>

            {hasActiveFilters && (
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={onReset}
                    id="filter-reset"
                    title="Clear all filters"
                    aria-label="Clear all filters"
                    style={{ marginTop: 'auto', height: '38px' }}
                >
                    <X size={14} /> Clear
                </button>
            )}
        </div>
    );
}
