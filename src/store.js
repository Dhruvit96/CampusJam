import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {useSelector as useReduxSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import {userReducer} from './reducers';

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWare = [thunk, logger];
const enhancer = [applyMiddleware(...middleWare)];
export const store = createStore(persistedReducer, compose(...enhancer));

export const useSelector = useReduxSelector;
export const persistor = persistStore(store);
