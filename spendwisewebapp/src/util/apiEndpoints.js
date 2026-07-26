export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1.0";
const CLOUDINARY_CLOUD_NAME = "dhadf5h7j";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    RESET_PASSWORD: "/reset-password",
    GET_USER_INFO: "/profile",
    UPDATE_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    CATEGORY_BUDGETS: "/categories-budgets",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_INCOMES: "/incomes",
    BULK_ADD_INCOME: "/incomes/bulk",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    INCOME_EXCEL_DOWNLOAD: "excel/download/income",
    EMAIL_INCOME: "/email/income-excel",
    GET_ALL_EXPENSE: "/expenses",
    BULK_ADD_EXPENSE: "/expenses/bulk",
    ADD_EXPENSE: "/expenses",
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    EXPENSE_EXCEL_DOWNLOAD: "excel/download/expense",
    EMAIL_EXPENSE: "/email/expense-excel",
    GET_SUBSCRIPTIONS: "/subscriptions",
    ADD_SUBSCRIPTION: "/subscriptions",
    DELETE_SUBSCRIPTION: (id) => `/subscriptions/${id}`,
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
};