import { useExpense } from "../context/ExpenseContext";

export const ExpenseTracker = () => {
  const { activeExpenses } = useExpense();

  const totalExpense = activeExpenses.reduce((sum: number, expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-300 ">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 ">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0092FB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Total Expenses</h2>
            <p className="text-gray-600">Track your spending</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{activeExpenses.length}</p>
          </div>
          <div className="h-12 w-px bg-gray-200"></div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-red-600">₹{totalExpense}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
