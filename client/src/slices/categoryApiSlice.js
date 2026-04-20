import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/api/categories',
            keepUnusedDataFor: 86400, // Keep for 24 hours for instant persistent access
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;
