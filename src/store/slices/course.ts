import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';

// ----------------------------------------------------------------------

const MOCK_COURSES = [
  {
    id: 1,
    user_id: 1,
    title: "test topic course",
    description: "test",
    delivery: { channel: "slack", frequency: "daily" },
    active: "y",
  },
  {
    id: 2,
    user_id: 2,
    title: "test2 topic course",
    description: "test2",
    delivery: { channel: "slack", frequency: "daily" },
    active: "n",
  },
];

const initialState = {
  isLoading: false,
  error: null,
  course: null,
  courses: [],
};

const slice = createSlice({
  name: 'course',
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
    getCoursesSuccess(state, action) {
      state.isLoading = false;
      state.courses = action.payload;
    },

    setSelectedCourse(state, action) {
      state.isLoading = false;
      state.course = action.payload;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelectedCourse } = slice.actions;

// ----------------------------------------------------------------------

export function getCourses() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get(`/api/course`);
      const response = { data: MOCK_COURSES }
      dispatch(
        slice.actions.getCoursesSuccess({
          courses: response.data,
        }),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
