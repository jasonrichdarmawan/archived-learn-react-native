import AsyncStorage from '@react-native-community/async-storage';
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import accountReducer from './src/features/Account/AccountSlice';
import {
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  account: accountReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // temporary fix, issue caused by redux-persist passing a function as an action type.
  // reference: https://stackoverflow.com/questions/62160125/persist-store-with-redux-toolkit-in-react-native
  middleware: getDefaultMiddleware({
    serializableCheck: {ignoredActions: [REGISTER, REHYDRATE, PERSIST]},
  }),
});

export const persistor = persistStore(store);
