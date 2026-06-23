import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/axiosConfig';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include', // ✅ FIX: Send cookies with every request (JWT cookie fallback)
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userInfo?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'Order', 'User', 'Category'],
    endpoints: (builder) => ({}), // Injected by other slices
});
