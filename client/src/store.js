import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        product: productReducer,
        category: categoryReducer,
        notifications: notificationReducer,
    },
    devTools: true,
});

export default store;
