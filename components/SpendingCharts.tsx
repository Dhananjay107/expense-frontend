import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

interface CategoryData {
  category: string;
  total: number;
  count: number;
}

interface Stats {
  monthly: MonthlyData[];
  categories: CategoryData[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#6b7280',
  Healthcare: '#ef4444',
  Education: '#22c55e',
  Other: '#64748b',
};

interface SpendingChartsProps {
  refreshTrigger: number;
}

export function SpendingCharts({ refreshTrigger }: SpendingChartsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full mb-3"></div>
        <p className="text-gray-500 text-sm">Loading charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        <p className="font-medium">Error loading charts</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats || (stats.monthly.length === 0 && stats.categories.length === 0)) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600 font-medium">No data for charts</p>
        <p className="text-gray-400 text-sm mt-1">Add some expenses to see spending analysis</p>
      </div>
    );
  }

  const maxMonthly = Math.max(...stats.monthly.map(m => m.total), 1);
  const maxCategory = Math.max(...stats.categories.map(c => c.total), 1);
  const totalSpending = stats.categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="space-y-6">
      {/* Monthly Trend */}
      {stats.monthly.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          <div className="space-y-3">
            {stats.monthly.slice(-6).map((month) => (
              <div key={month.month} className="flex items-center gap-3">
                <span className="w-16 text-xs text-gray-600 shrink-0">{formatMonth(month.month)}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((month.total / maxMonthly) * 100, 10)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{formatCurrency(month.total)}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-16 text-right">{month.count} txns</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats.categories.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Spending by Category</h3>

          {/* Bar Chart */}
          <div className="space-y-3 mb-6">
            {stats.categories
              .sort((a, b) => b.total - a.total)
              .map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-gray-600 shrink-0">{cat.category}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max((cat.total / maxCategory) * 100, 5)}%`,
                        backgroundColor: CATEGORY_COLORS[cat.category] || '#64748b',
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-20 text-right">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))}
          </div>

          {/* Pie Chart (simplified as percentage bars) */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-medium text-gray-500 mb-3">Distribution</h4>
            <div className="flex rounded-lg overflow-hidden h-8">
              {stats.categories
                .sort((a, b) => b.total - a.total)
                .map((cat) => {
                  const percentage = (cat.total / totalSpending) * 100;
                  if (percentage < 1) return null;
                  return (
                    <div
                      key={cat.category}
                      className="h-full flex items-center justify-center text-xs text-white font-medium transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: CATEGORY_COLORS[cat.category] || '#64748b',
                        minWidth: percentage > 5 ? 'auto' : '0',
                      }}
                      title={`${cat.category}: ${percentage.toFixed(1)}%`}
                    >
                      {percentage > 10 && `${percentage.toFixed(0)}%`}
                    </div>
                  );
                })}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {stats.categories
                .sort((a, b) => b.total - a.total)
                .map((cat) => (
                  <div key={cat.category} className="flex items-center gap-1 text-xs">
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#64748b' }}
                    />
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="text-gray-400">({((cat.total / totalSpending) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
