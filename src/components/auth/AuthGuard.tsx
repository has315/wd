import { isValidToken, jwtDecode, setSession } from "@/lib/auth/utils";
import axios from "@/lib/axios";
import { loginSuccess, logoutSuccess, setUser } from "@/store/slices/auth";
import { useDispatch, useSelector } from "@/store/store";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const token = Cookies.get("token")


export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // const { isAuthenticated, isIdle, isInitialized } = useAuthContext();
    const { user, error, isAuthenticated, isLoading } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { pathname } = useLocation();

    const [requestedLocation, setRequestedLocation] = useState<string | null>(
        null,
    );

    const initialize = useCallback(async () => {
        try {

            if (token && isValidToken(token)) {
                setSession(token);
                const decodedToken = jwtDecode(token)
                const userResponse = await axios.get(`/auth/user/${decodedToken.id}`);
                if (userResponse.status !== 200) return false

                dispatch(
                    setUser(
                        userResponse.data[0]
                    ),
                );
                navigate("/dashboard")
            } else {
                dispatch(logoutSuccess());
            }
        } catch (error) {
            console.error(error);
            dispatch(logoutSuccess());

        }
    }, []);

    useEffect(() => {
        initialize()
    }, [initialize])

    useEffect(() => {
        window.addEventListener('storage', () => {
            // When storage changes refetch
            const token = Cookies.get("token")
            if (!token) {
                dispatch(logoutSuccess());
                setSession(null)
            }
        });

        return () => {
            // When the component unmounts remove the event listener
            window.removeEventListener('storage', () => { });
        };
    }, []);

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