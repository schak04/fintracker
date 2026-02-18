import { memo } from 'react';
import { formatCurrency } from '../utils/formatters';

const SummaryCards = memo(function SummaryCards({ summary, transactionCount }) {
    const { balance, income, expense } = summary;

    return (
        <div className="summary-grid" role="region" aria-label="Financial summary">
            <div className="summary-card balance" id="summary-balance">
                <div className="summary-card-glow" aria-hidden="true" />
                <div className="summary-card-icon">💳</div>
                <div className="summary-card-label">Total Balance</div>
                <div className="summary-card-amount">{formatCurrency(balance)}</div>
                <div className="summary-card-sub">
                    {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} total
                </div>
            </div>

            <div className="summary-card income" id="summary-income">
                <div className="summary-card-glow" aria-hidden="true" />
                <div className="summary-card-icon">📈</div>
                <div className="summary-card-label">Total Income</div>
                <div className="summary-card-amount">{formatCurrency(income)}</div>
                <div className="summary-card-sub">Money earned</div>
            </div>

            <div className="summary-card expense" id="summary-expense">
                <div className="summary-card-glow" aria-hidden="true" />
                <div className="summary-card-icon">📉</div>
                <div className="summary-card-label">Total Expenses</div>
                <div className="summary-card-amount">{formatCurrency(expense)}</div>
                <div className="summary-card-sub">Money spent</div>
            </div>
        </div>
    );
});

export default SummaryCards;
