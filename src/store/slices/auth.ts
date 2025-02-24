import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';
import { Course, Topic } from '@/types/Course';
import { isValidToken, jwtDecode, setSession } from '@/lib/auth/utils';
import { persistor } from '../store';
import { PURGE } from "redux-persist";
import Cookies from 'js-cookie';
import { getProfileSuccess } from './profile';

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
    registerSuccess(state) {
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
      const response = await axios.post(`/auth/login`, { email, password }, { withCredentials: true });
      if (response.status !== 200) return false

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
      const response = await axios.post(`/auth/register`, { email, password });
      if (response.status !== 200) return false
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
