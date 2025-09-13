import Login from './pages/homelogin';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Signup from './pages/signup';
import RequireAuth from './components/requiredauth';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        
        {/* Protected route */}
        <Route 
          path="/dashboard" 
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
