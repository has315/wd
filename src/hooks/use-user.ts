import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type NewUser = any
type User = any

type RequestResult = {
    ok: true;
    message?: string;
} | {
    ok: false;
    message: string;
};

async function handleRequest(
    url: string,
    method: string,
    body?: NewUser
): Promise<RequestResult> {
    try {
        const response = await fetch(url, {
            method,
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        });

        if (!response.ok) {
            if (response.status >= 500) {
                return { ok: false, message: response.statusText };
            }

            const message = await response.text();
            return { ok: false, message };
        }

        const data = await response.json();
        return { ok: true, message: data.message };
    } catch (e: any) {
        return { ok: false, message: e.toString() };
    }
}

async function fetchUser(): Promise<User | null> {
    const response = await fetch("/api/user", {
        credentials: "include",
    });

    if (!response.ok) {
        if (response.status === 401) {
            return null;
        }

        throw new Error(`${response.status}: ${await response.text()}`);
    }

    return response.json();
}

export function useUser() {
    const queryClient = useQueryClient();

    const { data: user, error, isLoading } = useQuery<User | null, Error>({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: Infinity,
        retry: false,
    });

    const loginMutation = useMutation<RequestResult, Error, NewUser>({
        mutationFn: (userData: any) => handleRequest("/api/login", "POST", userData),
        onSuccess: (result) => {
            if (result.ok) {
                queryClient.invalidateQueries({ queryKey: ["user"] });
                toast(result.message, { type: "success", });
            } else {
                toast("Something went wrong", { type: "error" });
            }
        },
    });

    const logoutMutation = useMutation<RequestResult, Error>({
        mutationFn: () => handleRequest("/api/logout", "POST"),
        onSuccess: (result) => {
            if (result.ok) {
                queryClient.invalidateQueries({ queryKey: ["user"] });
                toast(result.message, { type: "success", });
            } else {
                toast("Something went wrong", { type: "error" });
            }
        },
    });

    const registerMutation = useMutation<RequestResult, Error, NewUser>({
        mutationFn: (userData) => handleRequest("/api/register", "POST", userData),
        onSuccess: (result) => {
            if (result.ok) {
                queryClient.invalidateQueries({ queryKey: ["user"] });
                toast(result.message, { type: "success", });
            } else {
                toast("Something went wrong", { type: "error" });
            }
        },
    });

    return {
        user,
        isLoading,
        error,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        register: registerMutation.mutateAsync,
    };
}
