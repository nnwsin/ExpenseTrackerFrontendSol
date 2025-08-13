import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../context/AuthContext";
import { useExpense } from "../context/ExpenseContext";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { auth, logout } = useAuth();
  const { expenses } = useExpense();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + (exp?.amount || 0), 0);
  const avgExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;
  const joinedDays = user
    ? Math.floor(
        (new Date().getTime() - new Date(user.createdAt).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = auth || localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101014] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#34ffd7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#101014] flex items-center justify-center">
        <div className="bg-[#181824] p-8 rounded-2xl shadow-xl border border-[#232336] max-w-md text-center">
          <div className="text-[#ff3555] mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-center text-lg font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101014] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {user ? (
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-[#181824] rounded-2xl shadow-xl border border-[#232336] p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] flex items-center justify-center text-[#181824] text-4xl font-bold shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                  <p className="text-[#a1a1aa] mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-4 py-2 bg-gradient-to-r from-[#34ffd7]/20 to-[#ff7ce5]/20 text-[#34ffd7] rounded-full text-xs font-bold">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-[#ffe066]/20 to-[#34ffd7]/20 text-[#ffe066] rounded-full text-xs font-bold">
                      {joinedDays} days with us
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-finance bg-[#181824] rounded-2xl shadow-xl border border-[#232336] p-6 text-center">
                <div className="text-[#a1a1aa] mb-2">Total Expenses</div>
                <div className="text-2xl font-extrabold text-white">{totalExpenses}</div>
              </div>
              <div className="card-finance bg-[#181824] rounded-2xl shadow-xl border border-[#232336] p-6 text-center">
                <div className="text-[#a1a1aa] mb-2">Total Amount</div>
                <div className="text-2xl font-extrabold text-white">₹{totalAmount.toLocaleString()}</div>
              </div>
              <div className="card-finance bg-[#181824] rounded-2xl shadow-xl border border-[#232336] p-6 text-center">
                <div className="text-[#a1a1aa] mb-2">Average Expense</div>
                <div className="text-2xl font-extrabold text-white">₹{avgExpense.toLocaleString()}</div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-[#181824] rounded-2xl shadow-xl border border-[#232336] p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
              <div className="space-y-4 flex flex-col md:flex-row gap-4">
                <button
                  onClick={logout}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] text-lg rounded-2xl font-bold border-0 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#181824] rounded-2xl p-8 text-center border border-[#232336] shadow-xl">
            <p className="text-[#a1a1aa]">No user data found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
