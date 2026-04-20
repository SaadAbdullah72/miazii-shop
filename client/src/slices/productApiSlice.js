import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber, category, isTrending, isDeals, limit }) => ({
                url: '/api/products',
                params: { keyword, pageNumber, category, isTrending, isDeals, limit },
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 300, // Keep in cache for 5 minutes
        }),
        getProductDetails: builder.query({
            query: (id) => ({
                url: `/api/products/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
    }),
});

export const { 
    useGetProductsQuery, 
    useGetProductDetailsQuery 
} = productApiSlice;
