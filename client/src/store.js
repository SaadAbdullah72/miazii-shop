import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import notificationReducer from './slices/notificationSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { apiSlice } from './slices/apiSlice';

// IRON-CLAD STORAGE WRAPPER: Ensures zero 'getItem is not a function' errors by using native window.localStorage
const webStorage = {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
    },
    removeItem: (key) => {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    }
};

const persistConfig = {
    key: 'root',
    version: 1,
    storage: webStorage,
    whitelist: ['auth', 'cart', 'category'],
};

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    category: categoryReducer,
    notifications: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
    devTools: true,
});

export const persistor = persistStore(store);
export default store;
