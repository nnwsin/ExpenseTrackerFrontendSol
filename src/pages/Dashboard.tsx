import { Link } from 'react-router-dom';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseTracker } from '../components/ExpenseTracker';
import { useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';

export const Dashboard = () => {
  const { fetchExpenses } = useExpense();
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchExpenses();
  }, []);

  const date = new Date();

  // Not logged in
  if (!token) {
    return (
      <div className="min-h-screen bg-[#101014] flex items-center justify-center px-4">
        <div className="bg-gray-700 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-[#232336]">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-[#34ffd7]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-white mb-3">Looks Like You Haven't Logged In</h2>
          <p className="text-[#a1a1aa] mb-6">Login to access your dashboard</p>
          <Link to="/login">
            <button className="w-full px-8 py-4 bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] text-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer font-bold border-0 hover:scale-105">
              Login Now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-[#101014] pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <div className=" card-finance bg-[#181824] rounded-2xl border border-[#232336] shadow-xl p-6 sm:p-8 mb-10 px-6 py-8 sm:px-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-[#a1a1aa] font-medium">
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Link to="/add">
            <button className="px-8 py-4 bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] text-lg rounded-2xl font-bold border-0 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Expense
            </button>
          </Link>
        </div>

        {/* Tracker */}
        <div className="mb-10">
          <div className="card-finance bg-[#181824] rounded-2xl border border-[#232336] shadow-xl p-6 sm:p-8">
            <ExpenseTracker />
          </div>
        </div>

        {/* Expense List Section, styled like a Home card */}
        <div className="card-finance bg-[#181824] rounded-2xl border border-[#232336] shadow-xl p-6 sm:p-8">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
};
