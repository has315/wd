import { useSelector } from "@/store/store";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // const { isAuthenticated, isIdle, isInitialized } = useAuthContext();
    const { user, error, isAuthenticated, isLoading} = useSelector(state => state.auth)


    const { pathname } = useLocation();

    const [requestedLocation, setRequestedLocation] = useState<string | null>(
        null,
    );

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