// src/redux/slices/productSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product } from "../types/auth";
import api from "../../services/api";

interface ProductState {
  products: Product[];
  productDetail?: Product;
  loading: boolean;
  error?: string;
}

const initialState: ProductState = {
  products: [],
  productDetail: undefined,
  loading: false,
  error: undefined,
};

// ========================
// Fetch ALL Products
// ========================
export const fetchProducts = createAsyncThunk<Product[], string | undefined>(
  "products/fetchProducts",
  async (category, { rejectWithValue }) => {
    try {
      let url = "/api/products";
      if (category) url += `?category=${encodeURIComponent(category)}`;
      const res = await api.get(url);
      return res.data as Product[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Fetch Product BY ID
// ========================
export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/products/${id}`);
      return res.data as Product;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Create Product
// ========================
export const createProduct = createAsyncThunk<Product, FormData>(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as Product;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Update Product
// ========================
export interface UpdateProductPayload {
  id: string;
  data: FormData;
}
export const updateProduct = createAsyncThunk<Product, UpdateProductPayload>(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(`/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as Product;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Delete Product
// ========================
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Toggle Hide/Show Product
// ========================
export const toggleHideProduct = createAsyncThunk<Product, string>(
  "products/toggleHideProduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `api/products/${id}/toggle-hide`,
        {}, // ✅ gửi body rỗng thay vì null để tránh lỗi JSON parse
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data as Product;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Slice
// ========================
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductDetail(state) {
      state.productDetail = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.productDetail = undefined;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.productDetail = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.push(action.payload);
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products = state.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          );
          if (state.productDetail?.id === action.payload.id)
            state.productDetail = action.payload;
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.products = state.products.filter(
            (p) => p.id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // toggleHideProduct
      .addCase(toggleHideProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        toggleHideProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products = state.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          );
          if (state.productDetail?.id === action.payload.id)
            state.productDetail = action.payload;
        }
      )
      .addCase(toggleHideProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductDetail } = productSlice.actions;
export default productSlice.reducer;
