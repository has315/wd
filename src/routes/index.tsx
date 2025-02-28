import { Navigate, useRoutes } from 'react-router-dom';

// config
// import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  LoginPage,
  DashboardPage,
  CoursesPage,
  ProfilePage,
  PasswordResetPage,
  ForgotPasswordPage
} from './elements';
import MainLayout from '@/layouts/dashboard/MainLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import GuestGuard from '@/components/auth/GuestGuard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'password-reset/:id/:token',
          element: (
              <PasswordResetPage />
          ),
        },
        {
          path: 'forgot-password',
          element: (
            <GuestGuard>
              <ForgotPasswordPage />
            </GuestGuard>
          ),
        },
     

      ]
    },
    {
      path: '/',
      element: <AuthGuard>
        <MainLayout />
      </AuthGuard>
      ,
      children: [
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'courses', element: <CoursesPage /> },
        { element: <Navigate to="/dashboard" replace />, index: true },
      ],
    },
    {
      path: 'profile',
      element: <AuthGuard>
        <MainLayout />
      </AuthGuard>,
      children: [
        { path: 'settings', element: <ProfilePage /> }
      ]
    }
  ]);
}
