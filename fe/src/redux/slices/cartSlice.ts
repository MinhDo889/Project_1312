// src/redux/slices/cartSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// BASE URL API
const BASE_URL = "http://localhost:3001/api/cart";

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  Product?: Product;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  cartId: null,
  loading: false,
  error: null,
};

// ---------------------------
// FETCH CART
// ---------------------------
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data as { id: string; CartItems: CartItem[] };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Server Error"
      );
    }
  }
);

// ---------------------------
// ADD TO CART
// ---------------------------
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { product_id, quantity }: { product_id: string; quantity: number },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        BASE_URL,
        { product_id, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data as CartItem;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Server Error"
      );
    }
  }
);

// ---------------------------
// UPDATE ITEM
// ---------------------------
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { item_id, quantity }: { item_id: string; quantity: number },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/${item_id}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data as CartItem;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Server Error"
      );
    }
  }
);

// ---------------------------
// REMOVE ITEM (XÓA SẢN PHẨM TRONG CART)
// ---------------------------
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (item_id: string, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/${item_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return item_id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Server Error"
      );
    }
  }
);

// ---------------------------
// CLEAR ALL
// ---------------------------
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await axios.delete(BASE_URL + "/clear", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Server Error"
      );
    }
  }
);

// ---------------------------
// SLICE
// ---------------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH CART
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCart.fulfilled,
      (state, action: PayloadAction<{ id: string; CartItems: CartItem[] }>) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.CartItems;
      }
    );
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ADD
    builder.addCase(
      addToCart.fulfilled,
      (state, action: PayloadAction<CartItem>) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index >= 0) state.items[index] = action.payload;
        else state.items.push(action.payload);
      }
    );

    // UPDATE
    builder.addCase(
      updateCartItem.fulfilled,
      (state, action: PayloadAction<CartItem>) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index >= 0) state.items[index] = action.payload;
      }
    );

    // REMOVE
    builder.addCase(
      removeCartItem.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    );

    // CLEAR
    builder.addCase(clearCart.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export default cartSlice.reducer;
