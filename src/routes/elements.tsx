import { Suspense, lazy, ElementType } from 'react';
// components
// import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => (
  <Suspense fallback={<>Loading...</>}>
    <Component {...props} />
  </Suspense>
);

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(
  lazy(() => import('../pages/Auth/LoginPage')),
);

//DASHBOARD
export const DashboardPage = Loadable(
  lazy(() => import('../pages/Dashboard/DashboardPage')),
);
export const CoursesPage = Loadable(
  lazy(() => import('../pages/Courses/CoursesPage')),
);