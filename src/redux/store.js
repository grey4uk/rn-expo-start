import {
  configureStore,
  createReducer,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistStore, persistReducer, PERSIST } from "redux-persist";
// import storage from "redux-persist/lib/storage";

const initialState = {
  userName: null,
  userId: null,
  userPosts: [],
  avatar: "https://picua.org/images/2020/04/20/41581d17aefc850989b9ca98f49c2a03.jpg",
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const reducer = {
  CURRENT_USER: (state, { payload }) => {
    return {
      ...state,
      userName: payload.userName,
      userId: payload.userId,
      userPosts: payload.userPosts,
      avatar: payload.avatar,
    };
  },
  USER_SIGNOUT: () => initialState,
};

const user = createReducer(initialState, reducer);

const rootReducer = combineReducers({
  user,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [PERSIST],
    },
  }),
});

export const persistor = persistStore(store);
