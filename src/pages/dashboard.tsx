import { useEffect, useState } from 'react';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ClipLoader from 'react-spinners/ClipLoader';
import { signout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '../components/ChatAiWidget';

const Dashboard = () => {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [query, _setQuery] = useState('');
  const bump = () => setRefreshFlag(f => f + 1);

  const [takeHome, setTakeHome] = useState<number>(() => {
    const saved = localStorage.getItem('takeHome');
    return saved ? Number(saved) : 0;
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    localStorage.setItem('takeHome', String(takeHome || 0));
  }, [takeHome]);

  const navigate = useNavigate();

  const handleSignOut = () => {
    setLoading(true);
    signout();
    setTimeout(() => {
      navigate('/login');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1f1f1f] text-white z-50">
        <ClipLoader size={60} color="#14b8a6" />
        <p className="mt-4 text-lg font-semibold">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-gray-300 text-white font-[Itim] overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col px-6 py-8 md:px-12 md:py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl text-[#1f1f1f] font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back!</p>
          </div>

          {/* Search + Take-home */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* global search if you want it */}
            {/* <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="px-3 py-2 bg-[#1f1f1f] border border-white rounded-md text-sm text-white"
            /> */}
            <div className="flex items-center gap-2">
              <label className="text-[#1f1f1f] text-sm font-semibold">Monthly Take-Home</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                value={Number.isFinite(takeHome) ? takeHome : 0}
                onChange={(e) => setTakeHome(Number(e.target.value || 0))}
                className="w-40 px-3 py-2 bg-[#1f1f1f] border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-white"
                placeholder="e.g. 4000"
              />
            </div>
          </div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Spending Overview</h2>
            <ExpenseChart refreshFlag={refreshFlag} query={query} takeHome={takeHome} />
          </div>

          <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Record Expense</h2>
            <ExpenseForm onAdded={bump} />
          </div>
        </div>

        <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
          <ExpenseList refreshFlag={refreshFlag} query={query} onChanged={bump} />
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSignOut}
            className="px-4 py-3 bg-[#1f1f1f] hover:bg-red-600 transition rounded-md text-white font-semibold shadow-md"
          >
            Sign Out
          </button>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
};

export default Dashboard;
