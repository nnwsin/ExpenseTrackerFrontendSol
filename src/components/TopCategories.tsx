import { useExpense } from "../context/ExpenseContext";

export const TopCategories = () => {
  const { activeExpenses } = useExpense();

  const categoryTotals = activeExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + (expense.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#0092FB]"></div>
        <h2 className="text-xl font-semibold text-gray-900">Top Spending Categories</h2>
      </div>
      <div className="space-y-4">
        {sortedCategories.map(([category, amount], index) => (
          <div key={category} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>
              <span className="text-gray-900 font-medium">{category}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0092FB] rounded-full"
                  style={{ 
                    width: `${(amount / sortedCategories[0][1]) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-gray-900 font-medium w-24 text-right">
                ₹{amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};