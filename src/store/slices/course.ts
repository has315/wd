import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';
import { Course } from '@/types/Course';

// ----------------------------------------------------------------------

type CourseState = {
  isLoading: boolean;
  error: any;
  course: Course | null;
  selectedCourse: Course | null;
  courses: Course[]
}

const initialState: CourseState = {
  isLoading: false,
  error: null,
  course: null,
  selectedCourse: null,
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
      state.selectedCourse = action.payload;
    },

    setCourse(state, action) {
      state.isLoading = false;
      state.course = action.payload;
    },



    addCourse(state, action) {
      state.isLoading = false
      state.courses.push(action.payload)
    }
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
      const response = await axios.get(`/api/courses`,);
      dispatch(
        slice.actions.getCoursesSuccess(
          response.data
        ),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.log(error)
    }
  };
}

export function analzyeCourse({ notes, processingStyle }: { notes: any, processingStyle: number }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/courses/analyze`, { notes, processingStyle },);
      dispatch(
        slice.actions.setCourse(
          {
            topics: response.data.topics,
            active: true,
            delivery: { channel: "email", frequency: "daily" },
            totalTopics: response.data.totalTopics, 
            totalLessons: response.data.totalLessons, 
          }
        ),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function createCourse({ course }: { course: any }) {
  console.log({ course })
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/courses/`, { course },);
      dispatch(
        slice.actions.getCoursesSuccess(
          response.data
        ),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
