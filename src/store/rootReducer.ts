import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import courseReducer from './slices/course'
import noteReducer from './slices/note'
import authReducer from './slices/auth'
import profileReducer from './slices/profile'
import modalReducer from './slices/modal'
// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};
export const authPersistConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['user', 'isAuthenticated'],
};

export const coursePersistConfig = {
  key: 'course',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const notePersistConfig = {
  key: 'note',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const profilePersistConfig = {
  key: 'profile',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};
export const modalPersistConfig = {
  key: 'modal',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  course: persistReducer(coursePersistConfig, courseReducer),
  note: persistReducer(notePersistConfig, noteReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  profile: persistReducer(profilePersistConfig, profileReducer),
  modal: persistReducer(profilePersistConfig, modalReducer),
});

export default rootReducer;
