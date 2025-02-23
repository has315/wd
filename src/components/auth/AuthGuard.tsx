import { getAccessToken, isValidToken } from "@/lib/auth/utils";
import { useSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // const { isAuthenticated, isIdle, isInitialized } = useAuthContext();
    const { user, error, isAuthenticated, isLoading } = useSelector(state => state.auth)
    const token = getAccessToken()
    const navigate = useNavigate()

    const { pathname } = useLocation();

    const [requestedLocation, setRequestedLocation] = useState<string | null>(
        null,
    );


    useEffect(() => {
        if (!token || !isValidToken(token) || !user ||  !isAuthenticated) {
            navigate('/auth/login')
        }

    }, [token, user, isAuthenticated])

    if (isLoading) {
        return <>Loading ...</>;
    }

    if (!isAuthenticated || !user) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }

        return <Navigate to={'/auth/login'} />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }



    return <> {children} </>;
}