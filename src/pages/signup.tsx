import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setAuthing(true);
    setError('');

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      setAuthing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Left side */}
      <div className="flex-1 bg-[#282c34] hidden md:flex items-center justify-center">
        {/* Optional: Logo or illustration */}
      </div>

      {/* Right side */}
      <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-6 md:p-20">
        <div className="w-full max-w-md text-white">
          <h3 className="text-4xl font-bold mb-2">Sign Up</h3>
          <p className="text-lg mb-4">Create your account</p>

          <input
            type="text"
            placeholder="Name"
            className="w-full bg-transparent border-b border-gray-500 py-2 mb-4 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-transparent border-b border-gray-500 py-2 mb-4 focus:outline-none"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            className="w-full bg-white text-black font-semibold p-4 rounded-md"
            onClick={handleSignup}
            disabled={authing}
          >
            Sign Up
          </button>

          <p className="text-sm text-gray-400 mt-10 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-white underline">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
