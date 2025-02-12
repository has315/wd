import { useLocation, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { useSelector } from '@/store/store';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
    const { user, error, isAuthenticated, isLoading} = useSelector(state => state.auth)

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
        navigate("/"); // AUTH GUARD HOOK TAKES OVER
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <>Loading ...</>;
  }

  return <> {children} </>;
}
