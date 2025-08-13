import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useExpense } from "../context/ExpenseContext";
import { format, isValid, parse } from "date-fns"; 

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

// Function to parse custom date format
const parseCustomDate = (customDate: string) => {
  const parsedDate = new Date(customDate); // Directly parse ISO string

  return isValid(parsedDate) ? parsedDate : null;
};

export const DateExpense = () => {
  const { activeExpenses } = useExpense();

  interface GroupedExpense {
    date: string;
    [category: string]: number | string;
  }

  const groupedData: Record<string, GroupedExpense> = {};

  activeExpenses.forEach(({ date, amount, category }) => {
    const parsedDate = parseCustomDate(date);
    if (!parsedDate) {
      console.warn("Skipping invalid date:", date);
      return;
    }

    const formattedDate = format(parsedDate, "dd/MM/yyyy");

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = { date: formattedDate };
    }

    groupedData[formattedDate][category] = 
      (Number(groupedData[formattedDate][category]) || 0) + Number(amount);
  });

  // Convert object to array & sort by date
  const data = Object.values(groupedData).sort((a, b) => {
    return parse(a.date, "dd/MM/yyyy", new Date()).getTime() - 
           parse(b.date, "dd/MM/yyyy", new Date()).getTime();
  });

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#0092FB]"></div>
        <h2 className="text-xl font-semibold text-gray-900">Daily Expense Trend</h2>
      </div>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="date" 
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
            <Legend 
              wrapperStyle={{
                paddingTop: '1rem',
                fontSize: '0.875rem'
              }}
            />
            {Object.keys(COLORS).map((category) => (
              <Bar 
                key={category} 
                dataKey={category} 
                stackId="a" 
                fill={COLORS[category]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
