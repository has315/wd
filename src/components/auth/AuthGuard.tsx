import { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "@/store/store";
import { Navigate, useLocation } from "react-router-dom";
import { initializeAuth } from "@/store/slices/auth";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const { email, isLoading: isLoadingProfile } = useSelector((state) => state.profile);
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(initializeAuth())
    }, [isAuthenticated])


    if (isLoadingProfile || isLoading) {
        return <>Loading...</>;
    }

    if (!isAuthenticated || !email) {
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
