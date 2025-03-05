import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';
import { Course } from '@/types/Course';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

type CourseState = {
  isLoading: boolean;
  error: any;
  course: Course | null;
  selectedCourse: Course | null;
  courses: Course[];
  courseDialogueOpen: boolean;
}

const initialState: CourseState = {
  isLoading: false,
  error: null,
  course: null,
  selectedCourse: null,
  courses: [],
  courseDialogueOpen: false
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

    setDialogueOpen(state, action) {
      state.isLoading = false;
      state.courseDialogueOpen = action.payload;
    },

    addCourse(state, action) {
      state.isLoading = false
      state.courses.push(action.payload)
    },
    updateCourse(state, action) {
      state.isLoading = false
      const updatedCourses = state.courses.map(course => {
        if (course.id === action.payload.id) return action.payload
        return course
      })
      state.courses = updatedCourses
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelectedCourse, setDialogueOpen } = slice.actions;

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
            entriesProccesed: response.data.entriesProccesed,
            title: response.data.courseName,
            description: response.data.courseDescription
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

export function updateCourse({ course }: { course: any }) {
  console.log({ course })
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/course/`, { course },);
      console.log(response.data)
      dispatch(
        slice.actions.updateCourse(
          response.data[0]
        ),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function toggleCourseActive({ course }: { course: any }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/course/`, { course },);
      if (response.status !== 200) {
        toast('Something went wrong', { type: "error" })
        return { status: 500 }
      }
      dispatch(
        slice.actions.updateCourse(
          response.data[0]
        ),
      );
      toast('Course ', { type: "success" })
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
