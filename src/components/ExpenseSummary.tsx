import { useExpense } from "../context/ExpenseContext";

export const ExpenseSummary = () => {
  const { activeExpenses } = useExpense();

  const totalExpenses = activeExpenses.reduce((sum: number, expense) => sum + (expense.amount || 0), 0);
  const averageExpense = activeExpenses.length > 0 ? totalExpenses / activeExpenses.length : 0;
  const maxExpense = activeExpenses.length > 0 ? Math.max(...activeExpenses.map(expense => expense.amount || 0)) : 0;
const minExpense = activeExpenses.length > 0 ? Math.min(...activeExpenses.map(expense => expense.amount || 0)) : 0;

  const metrics = [
    {
      title: "Total Expenses",
      value: `₹${totalExpenses.toLocaleString()}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0092FB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Average Expense",
      value: `₹${averageExpense.toLocaleString()}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Highest Expense",
      value: `₹${maxExpense.toLocaleString()}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Lowest Expense",
      value: `₹${minExpense.toLocaleString()}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
              {metric.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{metric.title}</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};