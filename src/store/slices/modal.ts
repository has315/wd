import { createSlice, Dispatch } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

type CourseState = {
  isLoading: boolean;
  error: any;
  editDialogueOpen: boolean;
  deleteDialogueOpen: boolean;
}

const initialState: CourseState = {
  isLoading: false,
  error: null,
  editDialogueOpen: false,
  deleteDialogueOpen: false
};

const slice = createSlice({
  name: 'modal',
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
    setEditDialogueOpen(state, action) {
      state.isLoading = false;
      state.editDialogueOpen = action.payload;
    },
    setDeleteDialogueOpen(state, action) {
      state.isLoading = false;
      state.deleteDialogueOpen = action.payload;
    },


  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setEditDialogueOpen, setDeleteDialogueOpen } = slice.actions;

// ----------------------------------------------------------------------

