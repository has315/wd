import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';

// ----------------------------------------------------------------------


type INote = {
  id: number;
  title: string;
  content: string;
  source: string;
}

type INoteInitialState = {
  isLoading: boolean,
  error: any,
  notes: INote[],
  note: INote | null
  selectedNotes: INote[] | null
}


const initialState: INoteInitialState = {
  isLoading: false,
  error: null,
  notes: [],
  note: null,
  selectedNotes: []
};


const slice = createSlice({
  name: 'note',
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

    getNotesSuccess(state, action) {
      state.isLoading = false;
      state.notes = action.payload.notes;
    },

    setSelectedNote(state, action) {
      state.isLoading = false;
      state.note = action.payload;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelectedNote } = slice.actions;

// ----------------------------------------------------------------------

export function getNotes() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/notes`);
      dispatch(
        slice.actions.getNotesSuccess({
          notes: response.data,
        }),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function uploadNote({ note }: { note: any }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/notes/upload`,
        note

      );
      dispatch(
        slice.actions.getNotesSuccess({
          notes: response.data,
        }),
      );
      return response.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
