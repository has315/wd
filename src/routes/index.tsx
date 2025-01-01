import { Navigate, useRoutes } from 'react-router-dom';

// config
// import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  LoginPage,
  DashboardPage,
  CoursesPage
} from './elements';
import MainLayout from '@/layouts/dashboard/MainLayout';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <LoginPage />
          ),
        },

      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'courses', element: <CoursesPage /> },
        { element: <Navigate to="/dashboard" replace />, index: true }, 
      ],
    }


  ]);
}
