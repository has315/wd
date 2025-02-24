import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';

// ----------------------------------------------------------------------

type IProfileInitialState = {
  isLoading: boolean,
  error: any,
  profile: {
    email: string,
    phoneNumber: string,
    id: number,
  }
}


const initialState: IProfileInitialState = {
  isLoading: false,
  error: null,
  profile: {
    id: 0,
    email: "",
    phoneNumber: ""
  }
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
      state.profile = action.payload
    },

    updateProfileSuccess(state, action) {
      state.isLoading = false;
      state.profile = action.payload
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getProfileSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function updateProfile({ profile }: {
  profile: {
    email: string,
    phoneNumber: string,
    id: number,
  }
}) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/profile`, { ...profile });
      dispatch(slice.actions.updateProfileSuccess({
        id: response.data[0].id,
        email: response.data[0].email,
        phoneNumber: response.data[0].phone_number,
        username: response.data[0].username,
        createdAt: response.data[0].createdAt
      }))
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
