import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';
import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { prefs, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const isDarkTheme = prefs?.theme === 'dark';
  const bgClass = isDarkTheme ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardClass = isDarkTheme ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900';
  const inputClass = isDarkTheme
    ? 'w-full px-3 py-2 rounded-md border bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
    : 'w-full px-3 py-2 rounded-md border bg-white border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const buttonClass = isDarkTheme
    ? 'w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
    : 'w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500';
  const textClass = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const linkClass = 'text-blue-500 font-medium underline';

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';

    if (!fullName) { setError('Please enter your full name'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required'); return; }
    setError('');

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.data.imageUrl;
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName, email, password, profileImageUrl,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        setError('No Google credential received.');
        return;
      }
      const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, { credential });
      const { token, user } = res.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className={`min-h-screen flex items-center justify-center p-4 ${bgClass}`}>
        <div className={`w-full max-w-md md:max-w-lg lg:max-w-xl p-8 rounded-xl border ${cardClass}`}>
          <h3 className="text-2xl font-bold text-center mb-2">Create an Account</h3>
          <p className={`text-sm text-center mb-6 ${textClass}`}>
            Join us today by entering your details below.
          </p>

          <form onSubmit={handleSignUp} className="space-y-5">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="John Doe"
                type="text"
                className={inputClass}
              />
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
                className={inputClass}
              />
              <div className="col-span-2">
                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Minimum 8 characters"
                  type="password"
                  className={inputClass}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className={buttonClass}>
              SIGN UP
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-500" />
              <span className={`px-2 text-sm ${textClass}`}>OR</span>
              <hr className="flex-1 border-gray-500" />
            </div>

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed. Please try again.')}
                useOneTap={false}
                theme="outline"
                size="large"
                shape="rectangular"
                text="continue_with"
              />
            </div>

            <p className={`text-sm mt-4 text-center ${textClass}`}>
              Already have an account?{' '}
              <Link className={linkClass} to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
