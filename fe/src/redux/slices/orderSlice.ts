// src/redux/slices/orderSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// ---------------------------
// Types
// ---------------------------
export interface Product {
  id: string;
  name: string;
  image_url?: string;
  price: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  Product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  OrderItems: OrderItem[];
}

export interface OrderState {
  order: Order | null; // đơn hàng vừa tạo
  orders: Order[]; // danh sách đơn hàng (user hoặc admin)
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
};

// ---------------------------
// API URL
// ---------------------------
const BASE_URL = "http://localhost:3001/api/orders";

// ---------------------------
// CREATE ORDER (User)
// ---------------------------
interface CreateOrderPayload {
  selectedItemIds: string[];
}

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>("order/createOrder", async ({ selectedItemIds }, thunkAPI) => {
  try {
    const user_id = localStorage.getItem("id");
    if (!user_id) return thunkAPI.rejectWithValue("User not logged in");

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}/create`,
      { user_id, selectedItemIds },
      { headers: { Authorization: token ? `Bearer ${token}` : "" } }
    );

    return response.data.order as Order;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error || "Server Error"
    );
  }
});

// ---------------------------
// FETCH ORDERS BY USER
// ---------------------------
export const fetchOrdersByUser = createAsyncThunk<
  Order[],
  string,
  { rejectValue: string }
>("order/fetchOrdersByUser", async (user_id, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/user/${user_id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return response.data.orders as Order[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error || "Server Error"
    );
  }
});

// ---------------------------
// ADMIN: FETCH ALL ORDERS
// ---------------------------
export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchAllOrders", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return response.data.orders as Order[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error || "Server Error"
    );
  }
});

// ---------------------------
// ADMIN: UPDATE ORDER STATUS
// ---------------------------
interface UpdateOrderStatusPayload {
  order_id: string;
  status: string;
}

export const updateOrderStatus = createAsyncThunk<
  Order,
  UpdateOrderStatusPayload,
  { rejectValue: string }
>("order/updateOrderStatus", async ({ order_id, status }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}/${order_id}/status`,
      { status },
      { headers: { Authorization: token ? `Bearer ${token}` : "" } }
    );
    return response.data.order as Order;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error || "Server Error"
    );
  }
});

// ---------------------------
// ADMIN: DELETE ORDER
// ---------------------------
export const deleteOrderAdmin = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("order/deleteOrderAdmin", async (order_id, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/${order_id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return order_id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error || "Server Error"
    );
  }
});

// ---------------------------
// SLICE
// ---------------------------
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ------------------- CREATE ORDER -------------------
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });

    // ------------------- FETCH ORDERS BY USER -------------------
    builder
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdersByUser.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });

    // ------------------- ADMIN: FETCH ALL ORDERS -------------------
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });

    // ------------------- ADMIN: UPDATE ORDER STATUS -------------------
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          const index = state.orders.findIndex(
            (o) => o.id === action.payload.id
          );
          if (index !== -1) state.orders[index] = action.payload;
        }
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });

    // ------------------- ADMIN: DELETE ORDER -------------------
    builder
      .addCase(deleteOrderAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteOrderAdmin.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.orders = state.orders.filter((o) => o.id !== action.payload);
        }
      )
      .addCase(deleteOrderAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
