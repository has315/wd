import { useLocation, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { useSelector } from '@/store/store';
import { getAccessToken, isValidToken } from '@/lib/auth/utils';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { user, error, isAuthenticated, isLoading } = useSelector(state => state.auth)

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = getAccessToken()

  useEffect(() => {
    if (isAuthenticated && token && isValidToken(token)) {
      navigate("/"); // AUTH GUARD HOOK TAKES OVER
    }
  }, [isAuthenticated, navigate, token]);


  useEffect(() => {
    if (!token || !isValidToken(token)) {
      navigate('/auth/login')
    }

  }, [token])


  if (isLoading) {
    return <>Loading ...</>;
  }

  return <> {children} </>;
}
