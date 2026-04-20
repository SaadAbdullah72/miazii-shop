import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/api/categories',
            providesTags: ['Category'],
            keepUnusedDataFor: 600, // Keep for 10 minutes
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;
