import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  credentials: "include",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    " Delivery",
    "OrderHistory",
    "catrgory",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
    getUserProfile: build.query({
      query: () => "user/getUserProfile", // Change the URL if needed
      providesTags: ["User"],
    }),
    addProduct: build.mutation({
      query: (newProduct) => ({
        url: "client/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: build.mutation({
      query: ({ id, formData }) => ({
        url: `client/products/${id}`, // Endpoint for updating the product
        method: "PUT",
        body: formData, // Use FormData as the request body
      }),
    }),

    addVariation: build.mutation({
      query: (newVariation) => ({
        url: "productVariation/createVariation",
        method: "POST",
        body: newVariation,
      }),
      invalidatesTags: ["variation"],
    }),

    addDeliveryCost: build.mutation({
      query: (newCost) => ({
        url: "sales/addCost",
        method: "POST",
        body: newCost,
      }),
      invalidatesTags: ["Delivery"],
    }),
    getDeliveryCost: build.query({
      query: () => "sales/getCost",
      providesTags: ["Delivery"],
    }),
    getOrderHistory: build.query({
      query: () => "order/orderHistory",
      providesTags: ["OrderHistory"],
    }),
    addCategory: build.mutation({
      query: (category) => ({
        url: "sales/category",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["catrgory"],
    }),
    getCategory: build.query({
      query: () => "sales/getCategories",
      providesTags: ["catrgory"],
    }),
    getVariation: build.query({
      query: () => "productVariation/getVariations",
      providesTags: ["variation"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useAddProductMutation,
  useAddDeliveryCostMutation,
  useGetDeliveryCostQuery,
  useGetOrderHistoryQuery,
  useGetUserProfileQuery,
  useAddCategoryMutation,
  useGetCategoryQuery,
  useGetVariationQuery,
  useAddVariationMutation,
  useUpdateProductMutation 
} = api;
