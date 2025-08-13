import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useExpense } from "../context/ExpenseContext.tsx";

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, isLoading } = useAuth(); // Extract auth state and loading state
  const {setExpenses} = useExpense();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle Profile Icon Click
  const handleClick = () => {
    if (auth) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setExpenses([]); 
    navigate("/login");
  };

  // Show loading spinner while auth is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101014] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34ffd7]"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#101014] font-finance flex flex-col">
      {/* NAVIGATION */}
      <nav className="bg-[#181824] border-b border-[#232336] shadow-xl w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* BRAND LOGO */}
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] flex items-center justify-center mr-3 shadow-lg">
                <p className="text-2xl font-bold text-[#181824]">E</p>
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">ExisyFi</span>
            </Link>
            
            {/* NAV LINKS */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl 
                  ${isActive("/") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow-lg"
                    : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                  }`}
              >
                Home
              </Link>
              {auth && (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl 
                      ${isActive("/dashboard") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow-lg"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                      }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/reports"
                    className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl 
                      ${isActive("/reports") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow-lg"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                      }`}
                  >
                    Reports
                  </Link>
                  <Link
                    to="/add"
                    className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl 
                      ${isActive("/add") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow-lg"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                      }`}
                  >
                    Add Expense
                  </Link>
                  <Link
                    to="/groups"
                    className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl 
                      ${isActive("/groups") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow-lg"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                      }`}
                  >
                    Groups
                  </Link>
                </>
              )}
            </div>

            {/* PROFILE & LOGOUT */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleClick}
                className="p-3 rounded-2xl hover:bg-[#232336] transition-all duration-300 border border-[#232336] hover:border-[#34ffd7] shadow-md cursor-pointer"
                aria-label={auth ? "Go to Profile" : "Login"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              {auth && (
                    <button
                      onClick={handleLogout}
                      className="
                        px-6 py-3 text-sm font-bold 
                        bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] 
                        text-[#181824] 
                        rounded-2xl 
                        border-0 
                        cursor-pointer 
                        hover:shadow-xl 
                        transition-all duration-300 
                        hover:scale-105 
                        focus:outline-none focus:ring-2 focus:ring-[#34ffd7]
                      "
                    >
                      Logout
                    </button>
                  )}
            </div>
          </div>

          {/* MOBILE NAV LINKS */}
          <div className="flex md:hidden gap-2 pt-2 pb-3 overflow-x-auto scrollbar-hide">
            <Link
              to="/"
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-300 
                ${isActive("/") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow"
                  : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                }`}
            >Home</Link>
            {auth && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-300 
                    ${isActive("/dashboard") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                    }`}
                >Dashboard</Link>
                <Link
                  to="/reports"
                  className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-300 
                    ${isActive("/reports") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                    }`}
                >Reports</Link>
                <Link
                  to="/add"
                  className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-300 
                    ${isActive("/add") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                    }`}
                >Add Expense</Link>
                <Link
                  to="/groups"
                  className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-300 
                    ${isActive("/groups") ? "text-[#181824] bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] shadow"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#232336]"
                    }`}
                >Groups</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-[#181824] border-t border-[#232336] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <span className="text-xl sm:text-2xl font-bold highlight block mb-2 text-white">ExisyFi</span>
              <p className="text-[#a1a1aa] text-sm sm:text-base">
                Professional financial management made simple and efficient.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-2">Quick Links</h5>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/dashboard" className="text-[#a1a1aa] hover:text-[#34ffd7] transition-colors">Dashboard</Link></li>
                <li><Link to="/reports" className="text-[#a1a1aa] hover:text-[#34ffd7] transition-colors">Reports</Link></li>
                <li><Link to="/groups" className="text-[#a1a1aa] hover:text-[#34ffd7] transition-colors">Groups</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-2">Contact</h5>
              <p className="text-[#a1a1aa] text-sm sm:text-base">
                Email: support@exisyfi.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="pt-6 text-center text-xs text-[#a1a1aa]">
            © 2025 ExisyFi. Professional financial management made simple.
          </div>
        </div>
      </footer>
    </div>
  );
};
