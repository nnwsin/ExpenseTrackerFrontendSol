import { useExpense } from "../context/ExpenseContext";
import { ExpenseItem } from "./ExpenseItem";
import { useState, useEffect } from "react";
import {ToastContainer,toast} from "react-toastify"
import { subWeeks, subMonths, subYears, parseISO, isAfter, format } from "date-fns";
import * as XLSX from 'xlsx';

const categories = ["All", "Food", "Rent", "Clothes", "Recreation", "Transport", "Utilities", "Entertainment", "Healthcare", "Education", "Other"];

const downloadAsExcel = (expenses: any[]) => {
 
  if (expenses.length === 0) {
    toast.error("No data to export");
    return;
  }

  const excelData = expenses.map(expense => ({
    Date: format(parseISO(expense.date), "yyyy-MM-dd HH:mm:ss"),
    Name: expense.name,
    Category: expense.category,
    Amount: expense.amount
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  XLSX.writeFile(workbook, `expenses_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};
const timePeriods = ["All Time", "Last Week", "Last Month", "Last Year"];

export const ExpenseList = () => {
  const { expenses, loading, setActiveExpenses, activeExpenses } = useExpense();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All Time");

  const filterByDate = (expense: { date: string }) => {
    const expenseDate = parseISO(expense.date);
    const now = new Date();

    switch (selectedPeriod) {
      case "Last Week":
        return isAfter(expenseDate, subWeeks(now, 1));
      case "Last Month":
        return isAfter(expenseDate, subMonths(now, 1));
      case "Last Year":
        return isAfter(expenseDate, subYears(now, 1));
      default:
        return true;
    }
  };

  // Update filtered expenses and context whenever filters change
  useEffect(() => {
    const filtered = expenses
      .filter(expense => selectedCategory === "All" ? true : expense.category === selectedCategory)
      .filter(filterByDate);
    
    setActiveExpenses(filtered);
  }, [selectedCategory, selectedPeriod, expenses, setActiveExpenses]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6  ">
        <div>
          <h2 className="text-xl font-semibold text-gray-600">Recent Expenses</h2>
          <p className="text-sm text-gray-600 mt-1">{activeExpenses.length} of {expenses.length} transactions</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-500 rounded-xl focus:ring-2 focus:ring-[#0092FB] focus:border-transparent transition-colors bg-white text-gray-900"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-500 rounded-xl focus:ring-2 focus:ring-[#0092FB] focus:border-transparent transition-colors bg-white text-gray-900"
          >
            {timePeriods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
          <button
            onClick={() => downloadAsExcel(activeExpenses)}
            className="cursor-pointer w-full md:w-auto px-4 py-2 bg-[#0092FB] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-[#0092FB] border-r-[#0092FB] border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        ) : activeExpenses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-600">No expenses found for the selected filters</p>
          </div>
        ) : (
          activeExpenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
