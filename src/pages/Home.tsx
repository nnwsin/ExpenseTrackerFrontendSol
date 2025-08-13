import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="relative z-12 overflow-hidden min-h-screen font-finance bg-[#101014]">
      {/* Main Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12 sm:py-16 lg:py-20">
            {/* Left Content - Hero */}
            <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Manage Your Expenses Easily With
              </h1>
              <div className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8">
                <span className="highlight">ExisyFi</span>
              </div>
              <p className="text-base sm:text-lg text-[#a1a1aa] mb-6 sm:mb-8 leading-relaxed">
                We are providing easiest way to manage expenses, Get a full view so you know where to save. Track spending, detect Fraud, and keep tabs on rising subscription costs.
              </p>
              <Link to="/dashboard">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] text-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer font-bold border-0 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Right Content - Data Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-full mx-auto lg:mx-0">
              {/* These cards remain as is */}
              {/* Top Left Card */}
              <div className="card-finance p-6 text-center border border-[#232336]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-white font-semibold">Budget Planner</div>
                <div className="text-xs text-[#a1a1aa]">Spend Smart Save More</div>
              </div>

              {/* Top Right Card */}
              <div className="card-finance p-6 text-center border border-[#232336]">
                <div className="text-2xl font-bold text-white mb-2">-1200$</div>
                <div className="flex justify-center space-x-1 mb-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent rounded-full"></div>
                  <div className="w-1 h-4 bg-gradient-to-b from-pink-400 to-transparent rounded-full"></div>
                </div>
                <div className="text-sm text-white">Expense</div>
              </div>

              {/* Middle Left Card */}
              <div className="card-finance p-6 text-center border border-[#232336]">
                <div className="text-sm text-white font-semibold mb-4">Keep Expense</div>
                <div className="relative h-12 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path d="M10,40 Q25,20 40,30 T70,10 T100,25" stroke="#ff7ce5" strokeWidth="2" fill="none"/>
                    <circle cx="70" cy="10" r="3" fill="#ff7ce5"/>
                  </svg>
                </div>
              </div>

              {/* Middle Right Card */}
              <div className="card-finance p-6 text-center border border-[#232336]">
                <div className="text-sm text-white font-semibold">Crystal Clear</div>
              </div>

              {/* Bottom Left Card */}
              <div className="card-finance p-6 text-center border border-[#232336]">
                <div className="flex justify-center space-x-1">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#34ffd7] to-transparent rounded-full"></div>
                  <div className="w-1 h-6 bg-gradient-to-b from-[#ff7ce5] to-transparent rounded-full"></div>
                  <div className="w-1 h-10 bg-gradient-to-b from-red-400 to-transparent rounded-full"></div>
                </div>
              </div>

              {/* Bottom Right Card */}
              <div className="card-finance p-6 text-center border border-[#232336]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-white font-semibold">Budget Planner</div>
                <div className="text-xs text-[#a1a1aa]">Spend Smart Save More</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 border-t border-[#232336]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-16">
            Everything you need for professional financial management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Smart Tracking",
                description: "Record and categorize expenses with intelligent automation",
                icon: "📊",
                gradient: "from-[#34ffd7] to-[#3b82f6]"
              },
              {
                title: "Advanced Analytics",
                description: "Get detailed insights about your spending patterns and trends",
                icon: "📈",
                gradient: "from-[#ff7ce5] to-[#34ffd7]"
              },
              {
                title: "Secure & Compliant",
                description: "Enterprise-grade security with financial compliance standards",
                icon: "🔒",
                gradient: "from-[#ffe066] to-[#ff7ce5]"
              }
            ].map((feature, index) => (
              <div key={index}
                className="group card-finance p-8 text-center border border-[#232336] hover:border-[#34ffd7] transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-2xl sm:text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#a1a1aa] text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 border-t border-[#232336]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="card-finance p-8 sm:p-12 text-center border border-[#232336]">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
              Ready to take control of your finances?
            </h2>
            <p className="text-[#a1a1aa] mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of professionals who are already managing their finances smarter.
            </p>
            <Link to="/dashboard">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer font-bold hover:scale-105">
                Get Started Now →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-[#232336] bg-[#181824]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-xl sm:text-2xl font-bold highlight mb-4 block">ExisyFi</span>
              <p className="text-[#a1a1aa] text-sm sm:text-base">
                Professional financial management made simple and efficient.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-2 sm:mb-4">Quick Links</h5>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/dashboard" className="text-[#a1a1aa] hover:text-[#34ffd7] transition-colors">Dashboard</Link></li>
                <li><Link to="/reports" className="text-[#a1a1aa] hover:text-[#34ffd7] transition-colors">Reports</Link></li>
                <li><Link to="/groups" className="text-[#a1a1aa] hover:text-[#34ffd7] transition-colors">Groups</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-2 sm:mb-4">Contact</h5>
              <p className="text-[#a1a1aa] text-sm sm:text-base">
                Email: support@exisyfi.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
