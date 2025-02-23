import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';
import { Course, Topic } from '@/types/Course';
import { jwtDecode, setSession } from '@/lib/auth/utils';
import { persistor } from '../store';
import { PURGE } from "redux-persist";
import Cookies from 'js-cookie';

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
      state.user = null
      state.isAuthenticated = false
    },
    setUser(state, action) {
      state.isLoading = false
      state.user = action.payload
    }
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
export const { loginSuccess, logoutSuccess, setUser } = slice.actions;

// ----------------------------------------------------------------------


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
