import { DateExpense } from "../components/DateExpense"
import { ExpenseChart } from "../components/ExpenseChart"
import { useExpense } from "../context/ExpenseContext"
import { Link } from "react-router-dom"
import { ExpenseSummary } from "../components/ExpenseSummary"
import { TopCategories } from "../components/TopCategories"
import { MonthlyTrend } from "../components/MonthlyTrend"
import { useAuth } from "../context/AuthContext"

export const Reports = () => {
  const { activeExpenses } = useExpense();
  const { auth } = useAuth();

  if(!auth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-300 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">Please log in to view your reports.</p>
          <Link to="/login">
            <button className="px-6 py-3 bg-[#0092FB] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center m-auto gap-2 shadow-sm cursor-pointer">
              Log In
            </button>
          </Link>
        </div>
      </div>
    )
  }
  
  if(activeExpenses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-300 max-w-md">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0092FB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Expenses Found</h2>
          <p className="text-gray-600 mb-8">No expenses match your current filters, or you haven't added any expenses yet.</p>
          <Link to="/add">
            <button className="px-6 py-3 bg-[#0092FB] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center m-auto gap-2 shadow-sm cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Expense
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Reports</h1>
          <p className="text-gray-600 mt-2">Visualize and analyze your spending patterns</p>
        </div>

        <div className="mb-8">
          <ExpenseSummary />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <ExpenseChart />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <DateExpense />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MonthlyTrend />
          <TopCategories />
        </div>
      </div>
    </div>
  )
};
