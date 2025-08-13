import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useExpense } from "../context/ExpenseContext";

const COLORS: Record<string, string> = {
  Food: "#0092FB",
  Rent: "#00C49F",
  Clothes: "#FFBB28",
  Recreation: "#FF8042",
  Transport: "#8884d8",
  Utilities: "#82ca9d",
  Entertainment: "#FF1493",
  Healthcare: "#9370DB",
  Education: "#20B2AA",
  Other: "#808080"
};

export const ExpenseChart = () => {
  const { activeExpenses } = useExpense();

  const categoryTotals = activeExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + (expense.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#0092FB]"></div>
        <h2 className="text-xl font-semibold text-gray-900">Expense Breakdown</h2>
      </div>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={150} 
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry) => (
                <Cell key={entry.name} name={entry.name} fill={COLORS[entry.name] || COLORS.Other} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
