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

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

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
        navigate('/dashboard'); // ⬅ go to dashboard
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
        navigate('/dashboard'); // ⬅ go to dashboard after Google sign-in
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{/* fixed typo grid */}
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label='Full Name'
              placeholder='John Doe'
              type='text'
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Address'
              placeholder='john@example.com'
              type='text'
            />
            <div className='col-span-2'>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label='Password'
                placeholder='Minimum 8 characters'
                type='password'
                shake={error === 'Password is required'}
              />
            </div>
          </div>

          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

          <button type='submit' className='btn-primary w-full mt-4'>
            SIGN UP
          </button>

          <div className='flex items-center my-4'>
            <hr className='flex-1 border-slate-300' />
            <span className='px-2 text-sm text-slate-500'>OR</span>
            <hr className='flex-1 border-slate-300' />
          </div>

          {/* Google-branded button */}
          <div className='w-full flex justify-center'>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              useOneTap={false} // set to true if you want One Tap
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
            />
          </div>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{' '}
            <Link className='font-medium text-primary underline inline' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
