import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const getInitialState = () => {
    try {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            const parsed = JSON.parse(storedCart);
            // Verify structure is an object with cartItems array (not legacy array)
            if (parsed && typeof parsed === 'object' && Array.isArray(parsed.cartItems)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Failed to parse cartItems from localStorage', e);
    }
    return { cartItems: [], shippingAddress: {}, paymentMethod: 'COD' };
};

const initialState = getInitialState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            return updateCart(state);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
