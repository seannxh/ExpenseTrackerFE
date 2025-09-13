import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import ClipLoader from 'react-spinners/ClipLoader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Please Try Again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1f1f1f] text-white">
        <ClipLoader size={60} color="#14b8a6" />
        <p className="mt-4 text-lg font-semibold">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Left */}
      <div className="flex-1 bg-[#282c34] hidden md:flex items-center justify-center"></div>

      {/* Right */}
      <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-6 md:p-20">
        <div className="w-full max-w-md text-white">
          <h3 className="text-4xl font-bold mb-2">Login</h3>
          <p className="text-lg mb-6">Welcome back!</p>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border-b border-gray-500 py-2 mb-4 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border-b border-gray-500 py-2 mb-4 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            className="w-full bg-white text-black font-semibold p-4 rounded-md"
            onClick={handleLogin}
            disabled={loading}
          >
            Log In
          </button>

          <p className="text-sm text-gray-400 mt-10 text-center">
            Don’t have an account?{' '}
            <a href="/" className="text-white underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
