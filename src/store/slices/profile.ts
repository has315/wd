import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';

// ----------------------------------------------------------------------

type IProfileInitialState = {
  isLoading: boolean,
  error: any,
  email: string,
  phoneNumber: string,
  id: number,
}


const initialState: IProfileInitialState = {
  isLoading: false,
  error: null,
  id: 0,
  email: "",
  phoneNumber: ""
};


const slice = createSlice({
  name: 'profile',
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

    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
    },

    updateProfileSuccess(state, action) {
      state.isLoading = false;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getProfileSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function updateProfile() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/profile`);
      dispatch(slice.actions.updateProfileSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
