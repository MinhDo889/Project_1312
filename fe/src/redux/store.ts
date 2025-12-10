import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSilce";
import productReducer from "../redux/slices/productSlice";
import categoryReducer from "../redux/slices/categoriesSilce";
import cartReducer from "./slices/cartSlice";
import profileReducer from "./slices/profileSlice";
import orderReuducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    profile: profileReducer,
    order: orderReuducer,
    reviews: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
