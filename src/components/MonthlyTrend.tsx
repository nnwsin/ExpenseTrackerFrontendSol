import { useExpense } from "../context/ExpenseContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parse } from "date-fns";



export const MonthlyTrend = () => {
  const { activeExpenses } = useExpense();


  const monthlyData = activeExpenses.reduce((acc, expense) => {
    try {
      const date = new Date(expense.date); 
      if (isNaN(date.getTime())) throw new Error("Invalid Date");
  
      const monthKey = format(date, "MMM yyyy");
  
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += (expense.amount || 0);
    } catch (error) {
      console.warn("Error parsing date:", expense.date);
    }
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => {
      const dateA = parse(a.month, "MMM yyyy", new Date());
      const dateB = parse(b.month, "MMM yyyy", new Date());
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#0092FB]"></div>
        <h2 className="text-xl font-semibold text-gray-900">Monthly Trend</h2>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#0092FB" 
              strokeWidth={2}
              dot={{ fill: '#0092FB', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};