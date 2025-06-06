import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL, credentials: "include" }),
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
    "variation"
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/dashboardProducts",
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

    addTrackDetails:build.mutation({
      query: (newTrackDetails) => ({
        url: "order/trackDetails",
        method: "POST",
        body: newTrackDetails,
      }),
      invalidatesTags: ["OrderHistory"],
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
        url: "client/createVariation",
        method: "POST",
        body: newVariation,
      }),
      invalidatesTags: ["variation"],
    }),

    editVariation: build.mutation({
      query: ({id,formData}) => ({
        url: `productVariation/editVariation/${id}`,
        method: "PUT",
        body: formData,
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

    updateCategory: build.mutation({
      query: (id) => ({
        url: `sales/updateCategory/${id}`, // Backend endpoint
        method: "PUT",
      }),
      invalidatesTags: ["Category"], // Invalidate cache to trigger refetch
    }),
    getCategory: build.query({
      query: () => "sales/getCategories",
      providesTags: ["catrgory"],
    }),
    getVariation: build.query({
      query: () => "productVariation/getVariationsForDashobard",
      providesTags: ["variation"],
    }),
    getProductsDash: build.query({
      query: () => {
        
        return "client/dashboard/products";
      },
      providesTags: ["variation"],
    }),
    updateOneProduct: build.mutation({
      query: (id) => ({
        url: `client/updateOneProduct/${id}`, // Backend endpoint
        method: "PATCH",
      }),
      invalidatesTags: ["Products"], // Invalidate cache to trigger refetch
    }),
    deleteOneProduct: build.mutation({
      query: (id) => ({
        url: `client/deleteOneProduct/${id}`, // Backend endpoint
        method: "PATCH",
      }),
      invalidatesTags: ["Products"], // Invalidate cache to trigger refetch
    }),

    updateOneVariation: build.mutation({
      query: (id) => ({
        url: `productVariation/updateOneVariation/${id}`, // Backend endpoint
        method: "PATCH",
      }),
      invalidatesTags: ["variation"], // Invalidate cache to trigger refetch
    }),
    updateIsActive: build.mutation({
      query: (id) => ({
        url: `productVariation/updateIsActive/${id}`, // Backend endpoint
        method: "PATCH",
      }),
      invalidatesTags: ["variation"], // Invalidate cache to trigger refetch
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
  useUpdateProductMutation,
  useUpdateCategoryMutation,
  useUpdateOneProductMutation,
  useDeleteOneProductMutation,
  useAddTrackDetailsMutation,
  useEditVariationMutation,
  useUpdateOneVariationMutation,
  useUpdateIsActiveMutation,
  useGetProductsDashQuery,
} = api;
