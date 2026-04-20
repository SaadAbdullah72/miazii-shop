import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import notificationReducer from './slices/notificationSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './slices/apiSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'cart', 'category'], // Only persist these slices
};

const rootReducer = {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    category: categoryReducer,
    notifications: notificationReducer,
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
    // Basic root-level reducer logic if needed
    if (action.type === 'PERSIST_REHYDRATE') return state;
    return Object.keys(rootReducer).reduce((acc, key) => {
        acc[key] = rootReducer[key](state ? state[key] : undefined, action);
        return acc;
    }, {});
});

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
