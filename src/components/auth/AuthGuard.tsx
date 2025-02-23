import { isValidToken, jwtDecode, setSession } from "@/lib/auth/utils";
import axios from "@/lib/axios";
import { loginSuccess, logoutSuccess } from "@/store/slices/auth";
import { useDispatch, useSelector } from "@/store/store";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // const { isAuthenticated, isIdle, isInitialized } = useAuthContext();
    const { user, error, isAuthenticated, isLoading } = useSelector(state => state.auth)
    const token = Cookies.get("token")
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
                    loginSuccess(
                        userResponse.data[0]
                    ),
                );
            } else {
                dispatch(logoutSuccess());
            }
        } catch (error) {
            console.error(error);
            dispatch(logoutSuccess());

        }
    }, [token]);

    useEffect(() => {
        initialize()
    }, [initialize])

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