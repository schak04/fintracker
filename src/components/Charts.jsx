import { useMemo, memo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Banknote, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { getCategoryInfo, CHART_COLORS } from '../utils/categories.jsx';
import { formatCurrency, getMonthYear } from '../utils/formatters';

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
            }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    {payload[0]?.payload?.icon} {payload[0]?.name}
                </div>
                <div style={{ color: payload[0]?.color || 'var(--accent-light)' }}>
                    {formatCurrency(payload[0]?.value)}
                </div>
            </div>
        );
    }
    return null;
}

function BarTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
            }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                {payload.map((p) => (
                    <div key={p.dataKey} style={{ color: p.fill, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {p.dataKey === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {formatCurrency(p.value)}
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

const Charts = memo(function Charts({ transactions }) {
    const expenseByCategory = useMemo(() => {
        const map = {};
        transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                map[t.category] = (map[t.category] || 0) + Number(t.amount);
            });
        return Object.entries(map)
            .map(([cat, value]) => {
                const info = getCategoryInfo(cat);
                return { name: info.label, value, color: info.color, icon: info.icon };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [transactions]);

    const monthlyData = useMemo(() => {
        const map = {};
        transactions.forEach((t) => {
            const month = getMonthYear(t.date);
            if (!month) return;
            if (!map[month]) map[month] = { month, income: 0, expense: 0 };
            map[month][t.type] += Number(t.amount);
        });
        return Object.values(map)
            .sort((a, b) => new Date('01 ' + a.month) - new Date('01 ' + b.month))
            .slice(-6);
    }, [transactions]);

    const hasExpenses = expenseByCategory.length > 0;
    const hasMonthly = monthlyData.length > 0;

    return (
        <div className="charts-grid" role="region" aria-label="Financial charts">
            <div className="chart-card">
                <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Banknote size={18} /> Expense Breakdown
                </div>
                {hasExpenses ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={expenseByCategory}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={95}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {expenseByCategory.map((entry, i) => (
                                    <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value, entry) => (
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        {entry?.payload?.icon} {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                        <div className="empty-icon"><PieIcon size={40} /></div>
                        <div className="empty-sub">No expense data yet</div>
                    </div>
                )}
            </div>

            <div className="chart-card">
                <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BarChart3 size={18} /> Monthly Overview
                </div>
                {hasMonthly ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={monthlyData} barSize={14} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                            />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                        <div className="empty-icon"><BarChart3 size={40} /></div>
                        <div className="empty-sub">No monthly data yet</div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default Charts;
