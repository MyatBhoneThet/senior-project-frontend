// import React from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';

// import Login from './pages/Auth/Login';
// import SignUp from './pages/Auth/SignUp';
// import Home from './pages/Dashboard/Home';
// import Income from './pages/Dashboard/Income';
// import Expense from './pages/Dashboard/Expense';
// import Settings from './pages/Dashboard/Settings'; // ← top-level Settings page
// import UserProvider from './context/UserContext';
// import { Toaster } from 'react-hot-toast';


// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem('token');
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const Root = () => {
//   const isAuthenticated = !!localStorage.getItem('token');
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
// };

// const App = () => {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           {/* Landing: send users based on auth status */}
//           <Route path="/" element={<Root />} />

//           {/* Public auth routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signUp" element={<SignUp />} />

//           {/* Protected app routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/income"
//             element={
//               <ProtectedRoute>
//                 <Income />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/expense"
//             element={
//               <ProtectedRoute>
//                 <Expense />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <Settings />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>

//       <Toaster
//         toastOptions={{
//           className: '',
//           style: {
//             fontSize: '13px', // (fixed typo)
//           },
//         }}
//       />
//     </UserProvider>
//   );
// };

// export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Settings from './pages/Dashboard/Settings';
import UserProvider from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/Dashboard/ProfilePage';
import RecurringPage from './pages/Dashboard/Recurring';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Landing route: redirect based on auth
const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <UserProvider>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Root />} />

        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/recurring" element={<RecurringPage />} /> */}
        

        {/* Protected app routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/recurring"
          element={
            <ProtectedRoute>
              <RecurringPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback for any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        toastOptions={{
          className: '',
          style: {
            fontSize: '13px',
          },
        }}
      />
    </UserProvider>
  );
};

export default App;
