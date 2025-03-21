import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';
import { Course, Topic } from '@/types/Course';
import { isValidToken, jwtDecode, setSession } from '@/lib/auth/utils';
import { persistor } from '../store';
import { PURGE } from "redux-persist";
import Cookies from 'js-cookie';
import { getProfileSuccess } from './profile';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------


const initialState = {
  isLoading: false,
  error: null,
  user: null,
  isAuthenticated: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    loginSuccess(state) {
      state.isLoading = false
      state.isAuthenticated = true
    },
    loginFail(state) {
      state.isLoading = false
      state.isAuthenticated = false
    },
    registerSuccess(state) {
      state.isLoading = false
    },
    registerFail(state) {
      state.isLoading = false
    },
    logoutSuccess(state) {
      state.isLoading = false
      state.isAuthenticated = false
    },

  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return initialState;
    });
  },

});

// Reducer
export default slice.reducer;

// Actions
export const { loginSuccess, logoutSuccess, } = slice.actions;

// ----------------------------------------------------------------------
export function initializeAuth() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());

    const token = Cookies.get("token");
    if (!token || !isValidToken(token)) {
      dispatch(logoutSuccess());
      setSession(null);
      return;
    }

    try {
      setSession(token);
      const decodedToken = jwtDecode(token);
      const userResponse = await axios.get(`/auth/user/${decodedToken.id}`);

      if (userResponse.status === 200) {
        dispatch(getProfileSuccess({
          id: userResponse.data[0].id,
          email: userResponse.data[0].email,
          phoneNumber: userResponse.data[0].phone_number,
          username: userResponse.data[0].username,
          createdAt: userResponse.data[0].createdAt
        }))
        dispatch(loginSuccess())
      } else {
        dispatch(logoutSuccess());
        setSession(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      dispatch(logoutSuccess());
      setSession(null);
    }
  };
}


export function login({ email, password }: { email: string, password: string }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/auth/login`, { email, password }, {
        withCredentials: true, validateStatus: () => true
      });
      if (response.status !== 200) {
        dispatch(slice.actions.loginFail())
        if (response.status === 406) {
          toast(response.data.message, { type: "error" })
          return { status: 406 }
        }
        toast(response.data.message, { type: "error" })
        return { status: 500 }
      }

      toast('Login success', { type: "success" })
      setSession(response.data.token)
      dispatch(slice.actions.loginSuccess())
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.log(error)
    }
  };
}

export function register({ email, password }: { email: string, password: string }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/auth/register`, { email, password }, { validateStatus: () => true });
      if (response.status !== 200) {
        dispatch(slice.actions.registerFail())

        if (response.status === 406) {
          toast(response.data.message, { type: "error" })
          return { status: 406 }
        }          toast(response.data.message, { type: "error" })

        toast(response.data.message, { type: "error" })
        return { status: 500 }
      }
      toast('Account Created', { type: "success" })
      dispatch(slice.actions.registerSuccess())
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.log(error)
    }
  };
}
export function forgotPassword({ email, }: { email: string, }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/auth/forgot-password`, { email });
      if (response.status !== 200) {
        toast('Something went wrong', { type: "error" })
        return { status: 500 }
      }
      toast('Password reset email sent', { type: "success" })
      dispatch(slice.actions.registerSuccess())
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.log(error)
    }
  };
}
export function resetPassword({ password, id, token }: { password: string; id: number, token: string }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/auth/reset-password/`, { password, id, token });
      if (response.status !== 200) {
        toast('Something went wrong', { type: "error" })
        return { status: 500 }
      }
      toast('Password reset successfully', { type: "success" })
      dispatch(slice.actions.registerSuccess())
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.log(error)
    }
  };
}

export function logout() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setSession(null)
      dispatch(slice.actions.logoutSuccess())


    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.log(error)
    }
  };
}




// ----------------------------------------------------------------------
