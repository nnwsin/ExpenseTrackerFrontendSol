import { useState } from "react";
import { ExpenseType, useExpense } from "../context/ExpenseContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_BACKEND_URL;

const categories = [
  "Food",
  "Rent",
  "Clothes",
  "Recreation",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other"
];

export const EditExpense = () => {
  const { selectExpense, expenses, setExpenses } = useExpense();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expense, setExpense] = useState<ExpenseType>(
    selectExpense.current || { id: "", name: "", amount: undefined ,category: "", date: "" }
  );
 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!expense.name || !expense.category || expense.amount === undefined || !expense.date) {
      setError("Please fill in all fields.");
      return;
    }

    setError(""); 
    await editExpense(expense);
  };

  const editExpense = async (updatedExpense: ExpenseType) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${API_URL}/api/expense/update/${updatedExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedExpense)
      });      if (!response.ok) {
        const errorData = await response.text();
        toast.error(errorData || "Failed to update expense");
        throw new Error(errorData || "Failed to update expense");
      }
  
      let data;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); 
      }
  
      // Update the expenses state
      setExpenses(expenses.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp)));
      console.log(data);
      // Show success message
      toast.success("Expense updated successfully!");

      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Failed to update expense. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5]"></div>
            <h1 className="text-2xl font-semibold text-white text-center">Edit Expense</h1>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Expense Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g., Groceries, Movie Tickets"
                value={expense.name}
                className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#34ffd7] focus:border-transparent transition-colors bg-gray-700 text-white placeholder-gray-400"
                onChange={(e) => setExpense({ ...expense, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#34ffd7] focus:border-transparent transition-colors bg-gray-700 text-white"
                value={expense.category}
                onChange={(e) => setExpense({ ...expense, category: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                        id="amount"
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        value={expense.amount ?? ""}
                                                 className="w-full pl-8 pr-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#34ffd7] focus:border-transparent transition-colors bg-gray-700 text-white placeholder-gray-400"
                        onChange={(e) =>
                          setExpense({
                            ...expense,
                            amount: e.target.value === "" ? undefined : Number(e.target.value)
                          })
                        }
                      />

              </div>
        </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                Date & Time
              </label>
              <input
                id="date"
                type="datetime-local"
                name="date"
                className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#34ffd7] focus:border-transparent transition-colors bg-gray-700 text-white"
                value={expense.date}
                onChange={(e) => setExpense({ ...expense, date: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Editing..." : "Edit Expense"}
              </button>
            </div>
          </form>        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss />
    </div>
  );
};
