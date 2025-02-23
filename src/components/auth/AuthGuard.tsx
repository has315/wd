import { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "@/store/store";
import { Navigate, useLocation } from "react-router-dom";
import { initializeAuth } from "@/store/slices/auth";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(initializeAuth())
    }, [isAuthenticated])


    if (isLoading) {
        return <>Loading...</>;
    }

    if (!isAuthenticated || !user) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <Navigate to="/auth/login" />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }

    return <>{children}</>;
}
