import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

const Login = () => {
  const { prefs, updateUser } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dark/light classes
  const bgClass = isDarkTheme
    ? 'bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-950'
    : 'bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-200';
  const cardClass = isDarkTheme
    ? 'bg-gray-800 text-gray-100 shadow-lg rounded-2xl p-8'
    : 'bg-white text-gray-900 shadow-lg rounded-2xl p-8';
  const inputClass = isDarkTheme
    ? 'w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    : 'w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const buttonClass = isDarkTheme
    ? 'w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200'
    : 'w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200';

  const textClass = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  const linkClass = 'text-blue-400 hover:text-blue-500 font-medium underline';

  return (
    <AuthLayout>
      <div className={`${bgClass} min-h-screen flex items-center justify-center p-4`}>
        <div className={`${cardClass} max-w-md w-full`}>
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className={`text-sm mb-6 text-center ${textClass}`}>
            Enter your details to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
              className={inputClass}
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
              className={inputClass}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className={buttonClass} disabled={loading}>
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <p className={`text-sm mt-4 text-center ${textClass}`}>
            Don't have an account?{' '}
            <Link className={linkClass} to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
