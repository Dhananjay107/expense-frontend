import { useState } from 'react';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { SpendingCharts } from '../components/SpendingCharts';

type Tab = 'expenses' | 'charts';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  const handleExpenseCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-sm text-gray-500">Manage your personal finances</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Tab Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'expenses'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'charts'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Charts
                </button>
              </div>

              {activeTab === 'expenses' && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {showForm ? 'Cancel' : '+ Add Expense'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === 'expenses' && (
          <>
            {/* Add Expense Form - Collapsible */}
            {showForm && (
              <div className="mb-6">
                <ExpenseForm onExpenseCreated={handleExpenseCreated} />
              </div>
            )}

            {/* Expense List */}
            <ExpenseList refreshTrigger={refreshTrigger} />
          </>
        )}

        {activeTab === 'charts' && (
          <SpendingCharts refreshTrigger={refreshTrigger} />
        )}
      </main>
    </div>
  );
}
