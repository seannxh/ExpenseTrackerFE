import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

const Dashboard = () => {
  return (
    <div className="fixed inset-0 flex bg-gray-300 text-white font-[Itim] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1f1f1f] p-6 space-y-6 shadow-lg">
        <div className="text-white text-2xl font-bold flex items-center gap-2">
          <i className="bx bx-infinite text-3xl text-teal-400"></i>
          Finavise
        </div>
        <nav className="flex flex-col space-y-2">
          {['Dashboard', 'Analytics', 'Transactions', 'Account', 'Settings'].map((label, i) => (
            <a
              key={label}
              href="#"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 p-3 rounded-md transition"
            >
              <i className={`bx bx-${['home-alt', 'line-chart', 'wallet', 'user', 'cog'][i]} text-teal-400`}></i>
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col px-6 py-8 md:px-12 md:py-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl text-[#1f1f1f] font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back, Sean</p>
          </div>
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-full px-4 py-2 bg-[#1f1f1f] border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-white"
            />
            <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Expense Chart */}
          <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Spending Overview</h2>
            <ExpenseChart />
          </div>

          {/* Expense Form */}
          <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Record Expense</h2>
            <ExpenseForm />
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
          <ExpenseList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
